/* global process */

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "node:buffer";
import { resources as seededResources } from "../src/lib/data.js";
import idl from "../src/idl/stripe3.json" with { type: "json" };

const PORT = process.env.PORT || 4100;
const RPC_URL = process.env.SOLANA_RPC_URL || process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(idl.address);
const connection = new Connection(RPC_URL, "confirmed");
const PAYMENT_REQUIRED_HEADER = "PAYMENT-REQUIRED";
const PAYMENT_SIGNATURE_HEADER = "PAYMENT-SIGNATURE";
const PAYMENT_RESPONSE_HEADER = "PAYMENT-RESPONSE";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.STRIPE3_DATA_DIR || path.join(__dirname, "..", ".data");
const RESOURCE_STORE = path.join(DATA_DIR, "resources.json");
const PRODUCT_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,31}$/;

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": `Content-Type, X-Stripe3-Buyer, ${PAYMENT_SIGNATURE_HEADER}`,
    "Access-Control-Expose-Headers": `${PAYMENT_REQUIRED_HEADER}, ${PAYMENT_RESPONSE_HEADER}`,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    ...headers,
  });
  res.end(JSON.stringify(payload, null, 2));
}

function encodePaymentHeader(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function decodePaymentHeader(value) {
  if (!value) return null;
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function cleanText(value, fallback = "", maxLength = 240) {
  const text = String(value || fallback).trim();
  return text.slice(0, maxLength);
}

function normalizeResource(input) {
  const id = cleanText(input.id, "", 32).toLowerCase();
  const title = cleanText(input.title, "", 80);
  const type = cleanText(input.type, "API", 24);
  const description = cleanText(input.description, "", 320);
  const protectedContent = cleanText(input.protectedContent, "", 1000);
  const merchant = cleanText(input.merchant, "", 64);
  const priceLamports = Number(input.priceLamports);

  if (!PRODUCT_ID_PATTERN.test(id)) {
    throw new Error("Resource id must be 3-32 lowercase letters, numbers, or hyphens.");
  }

  if (!title) {
    throw new Error("Resource title is required.");
  }

  if (!Number.isSafeInteger(priceLamports) || priceLamports <= 0) {
    throw new Error("Price must be a positive lamport amount.");
  }

  new PublicKey(merchant);

  return {
    id,
    title,
    type,
    priceLamports,
    merchant,
    status: "Live",
    endpoint: `/api/protected/${id}`,
    description,
    protectedContent,
    source: "merchant",
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

async function readStoredResources() {
  try {
    const file = await fs.readFile(RESOURCE_STORE, "utf8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeStoredResources(resources) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(RESOURCE_STORE, JSON.stringify(resources, null, 2));
}

async function getAllResources() {
  const storedResources = await readStoredResources();
  const seededIds = new Set(seededResources.map((resource) => resource.id));
  return [
    ...seededResources,
    ...storedResources.filter((resource) => !seededIds.has(resource.id)),
  ];
}

async function getResource(resourceId) {
  const resources = await getAllResources();
  return resources.find((resource) => resource.id === resourceId);
}

function getProductPda(resource) {
  const merchant = new PublicKey(resource.merchant);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("product"), merchant.toBuffer(), Buffer.from(resource.id)],
    PROGRAM_ID,
  )[0];
}

function getReceiptPda(resource, buyer) {
  const product = getProductPda(resource);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("receipt"), product.toBuffer(), new PublicKey(buyer).toBuffer()],
    PROGRAM_ID,
  )[0];
}

async function findOnchainReceipt(resource, buyer) {
  if (!buyer) return null;

  try {
    const receiptPda = getReceiptPda(resource, buyer);
    const account = await connection.getAccountInfo(receiptPda, "confirmed");

    if (!account) return null;
    if (!account.owner.equals(PROGRAM_ID)) return null;

    return {
      resourceId: resource.id,
      buyer,
      pda: receiptPda.toBase58(),
      verified: true,
      source: "solana",
    };
  } catch {
    return null;
  }
}

async function findAllOnchainReceipts(buyer) {
  if (!buyer) return [];
  const resources = await getAllResources();

  const receipts = await Promise.all(
    resources.map(async (resource) => {
      const receipt = await findOnchainReceipt(resource, buyer);
      if (!receipt) return null;

      return {
        ...receipt,
        resource: resource.title,
        amountLamports: resource.priceLamports,
      };
    }),
  );

  return receipts.filter(Boolean);
}

async function verifyPaymentSignature(resource, encodedPayload, buyer) {
  if (!encodedPayload) {
    return { ok: false, error: "Missing PAYMENT-SIGNATURE header." };
  }

  let payload;

  try {
    payload = decodePaymentHeader(encodedPayload);
  } catch {
    return { ok: false, error: "PAYMENT-SIGNATURE is not valid base64 JSON." };
  }

  if (payload?.protocol !== "x402" || payload?.scheme !== "solana-transfer") {
    return { ok: false, error: "Unsupported payment payload." };
  }

  if (payload.resourceId !== resource.id) {
    return { ok: false, error: "Payment payload does not match this resource." };
  }

  if (buyer && payload.buyer !== buyer) {
    return { ok: false, error: "Payment buyer does not match request buyer." };
  }

  const receipt = await findOnchainReceipt(resource, payload.buyer);

  if (!receipt) {
    return { ok: false, error: "On-chain receipt PDA was not found yet." };
  }

  return {
    ok: true,
    payload,
    receipt,
    settlement: {
      success: true,
      network: "solana-devnet",
      resourceId: resource.id,
      buyer: payload.buyer,
      receipt: receipt.pda,
      transactionSignature: payload.transactionSignature || null,
    },
  };
}

function buildPaymentRequired(resource, buyer) {
  const invoiceId = `inv_${resource.id}_${Date.now()}`;
  const productPda = getProductPda(resource);

  return {
    x402Version: 2,
    error: "payment_required",
    status: 402,
    protocol: "x402",
    message: "Payment required before this resource can be unlocked.",
    accepts: [
      {
        scheme: "solana-transfer",
        network: "solana-devnet",
        asset: "SOL",
        amountLamports: resource.priceLamports,
        invoiceId,
        resourceId: resource.id,
        buyer: buyer || null,
        programId: PROGRAM_ID.toBase58(),
        product: productPda.toBase58(),
        merchant: resource.merchant,
        payTo: resource.merchant,
        settlementProgram: PROGRAM_ID.toBase58(),
      },
    ],
    extensions: {
      paymentIdentifier: true,
    },
  };
}

async function registerResource(body) {
  const resource = normalizeResource(body);
  const resources = await getAllResources();

  if (resources.some((item) => item.id === resource.id)) {
    throw new Error("A resource with this id already exists.");
  }

  const productPda = getProductPda(resource);
  const productAccount = await connection.getAccountInfo(productPda, "confirmed");

  if (!productAccount || !productAccount.owner.equals(PROGRAM_ID)) {
    throw new Error("Product PDA was not found on-chain. Create the Solana product first.");
  }

  const storedResources = await readStoredResources();
  const storedResource = {
    ...resource,
    productPda: productPda.toBase58(),
    creationSignature: cleanText(body.creationSignature, "", 120),
  };

  await writeStoredResources([...storedResources, storedResource]);
  return storedResource;
}

async function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/health") {
    sendJson(res, 200, { ok: true, service: "stripe3-gateway" });
    return;
  }

  if (url.pathname === "/api/resources" && req.method === "GET") {
    const resources = await getAllResources();
    sendJson(res, 200, { ok: true, resources });
    return;
  }

  if (url.pathname === "/api/resources" && req.method === "POST") {
    const body = await readBody(req);

    try {
      const resource = await registerResource(body);
      sendJson(res, 201, { ok: true, resource });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (url.pathname === "/api/invoices" && req.method === "POST") {
    const body = await readBody(req);
    const resource = await getResource(body.resourceId);

    if (!resource) {
      sendJson(res, 404, { ok: false, error: "Resource not found" });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      invoice: buildPaymentRequired(resource, body.buyer).accepts[0],
    });
    return;
  }

  if (url.pathname === "/api/receipts" && req.method === "GET") {
    const buyer = url.searchParams.get("buyer");
    const data = await findAllOnchainReceipts(buyer);
    sendJson(res, 200, { ok: true, receipts: data });
    return;
  }

  if (url.pathname.startsWith("/api/protected/") && req.method === "GET") {
    const resourceId = url.pathname.replace("/api/protected/", "");
    const resource = await getResource(resourceId);
    const buyer = req.headers["x-stripe3-buyer"] || url.searchParams.get("buyer");

    if (!resource) {
      sendJson(res, 404, { ok: false, error: "Resource not found" });
      return;
    }

    const paymentSignature = req.headers[PAYMENT_SIGNATURE_HEADER.toLowerCase()];
    const receipt = await findOnchainReceipt(resource, buyer);

    if (!receipt) {
      const paymentRequired = buildPaymentRequired(resource, buyer);

      sendJson(res, 402, paymentRequired, {
        [PAYMENT_REQUIRED_HEADER]: encodePaymentHeader(paymentRequired),
      });
      return;
    }

    if (paymentSignature) {
      const verification = await verifyPaymentSignature(resource, paymentSignature, buyer);

      if (!verification.ok) {
        const settlement = { success: false, error: verification.error };
        sendJson(res, 402, { ok: false, error: verification.error }, {
          [PAYMENT_RESPONSE_HEADER]: encodePaymentHeader(settlement),
        });
        return;
      }

      sendJson(res, 200, {
        ok: true,
        resource: resource.title,
        unlocked: true,
        receipt: verification.receipt,
        payload: {
          signal: resource.protectedContent || `Unlocked ${resource.title}.`,
          note: "Served after x402 payment and receipt verification.",
        },
      }, {
        [PAYMENT_RESPONSE_HEADER]: encodePaymentHeader(verification.settlement),
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      resource: resource.title,
      unlocked: true,
      receipt,
      payload: {
        signal: resource.protectedContent || `Unlocked ${resource.title}.`,
        note: "Served after receipt verification.",
      },
    }, {
      [PAYMENT_RESPONSE_HEADER]: encodePaymentHeader({
        success: true,
        network: "solana-devnet",
        resourceId: resource.id,
        buyer,
        receipt: receipt.pda,
      }),
    });
    return;
  }

  sendJson(res, 404, { ok: false, error: "Route not found" });
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, 500, { ok: false, error: error.message });
  });
});

server.listen(PORT, () => {
  process.stdout.write(`stripe3 gateway running on http://localhost:${PORT}\n`);
});
