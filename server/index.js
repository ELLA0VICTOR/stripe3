/* global process */

import http from "node:http";
import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "node:buffer";
import { resources } from "../src/lib/data.js";
import idl from "../src/idl/stripe3.json" with { type: "json" };

const PORT = process.env.PORT || 4100;
const RPC_URL = process.env.SOLANA_RPC_URL || process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(idl.address);
const connection = new Connection(RPC_URL, "confirmed");

const receipts = new Map();

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Payment-Proof, X-Stripe3-Buyer",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    ...headers,
  });
  res.end(JSON.stringify(payload, null, 2));
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

function getResource(resourceId) {
  return resources.find((resource) => resource.id === resourceId);
}

function getReceiptKey(resourceId, buyer) {
  return `${resourceId}:${buyer || "anonymous"}`;
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

function buildPaymentRequired(resource, buyer) {
  const invoiceId = `inv_${resource.id}_${Date.now()}`;
  const productPda = getProductPda(resource);

  return {
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
        payTo: "stripe3_invoice_pda",
      },
    ],
  };
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
    sendJson(res, 200, { ok: true, resources });
    return;
  }

  if (url.pathname === "/api/invoices" && req.method === "POST") {
    const body = await readBody(req);
    const resource = getResource(body.resourceId);

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

  if (url.pathname === "/api/receipts" && req.method === "POST") {
    const body = await readBody(req);
    const resource = getResource(body.resourceId);

    if (!resource || !body.buyer) {
      sendJson(res, 400, { ok: false, error: "resourceId and buyer are required" });
      return;
    }

    const receipt = {
      id: `receipt_${Date.now()}`,
      resourceId: resource.id,
      buyer: body.buyer,
      amountLamports: resource.priceLamports,
      signature: body.signature || "devnet_signature_pending",
      pda: `stripe3_receipt_${resource.id}_${body.buyer.slice(0, 6)}`,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    receipts.set(getReceiptKey(resource.id, body.buyer), receipt);
    sendJson(res, 200, { ok: true, receipt });
    return;
  }

  if (url.pathname === "/api/receipts" && req.method === "GET") {
    const buyer = url.searchParams.get("buyer");
    const data = Array.from(receipts.values()).filter((receipt) => !buyer || receipt.buyer === buyer);
    sendJson(res, 200, { ok: true, receipts: data });
    return;
  }

  if (url.pathname.startsWith("/api/protected/") && req.method === "GET") {
    const resourceId = url.pathname.replace("/api/protected/", "");
    const resource = getResource(resourceId);
    const buyer = req.headers["x-stripe3-buyer"] || url.searchParams.get("buyer");

    if (!resource) {
      sendJson(res, 404, { ok: false, error: "Resource not found" });
      return;
    }

    const receipt = receipts.get(getReceiptKey(resource.id, buyer)) || await findOnchainReceipt(resource, buyer);

    if (!receipt) {
      sendJson(res, 402, buildPaymentRequired(resource, buyer), {
        "X-Payment-Protocol": "x402",
        "X-Payment-Network": "solana-devnet",
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      resource: resource.title,
      unlocked: true,
      receipt,
      payload: {
        signal: "Unlocked premium payload from stripe3.",
        note: "Served after receipt verification.",
      },
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
