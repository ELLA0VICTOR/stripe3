/* global process */

import http from "node:http";

const PORT = process.env.PORT || 4100;

const resources = [
  {
    id: "premium-signal",
    title: "Premium Solana Signal API",
    priceLamports: 3_000_000,
    endpoint: "/api/protected/premium-signal",
  },
  {
    id: "agent-toolkit",
    title: "Agent Route Optimizer",
    priceLamports: 5_000_000,
    endpoint: "/api/protected/agent-toolkit",
  },
  {
    id: "dataset-drop",
    title: "Liquidity Dataset Drop",
    priceLamports: 8_000_000,
    endpoint: "/api/protected/dataset-drop",
  },
];

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

function buildPaymentRequired(resource, buyer) {
  const invoiceId = `inv_${resource.id}_${Date.now()}`;

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
        payTo: "stripe3_invoice_pda_demo",
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

    const receipt = receipts.get(getReceiptKey(resource.id, buyer));

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
        note: "This mock payload will later be served after Solana receipt PDA verification.",
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
