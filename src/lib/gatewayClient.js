import {
  decodePaymentHeader,
  encodePaymentHeader,
  PAYMENT_REQUIRED_HEADER,
  PAYMENT_RESPONSE_HEADER,
  PAYMENT_SIGNATURE_HEADER,
} from "./x402";

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4100";

function gatewayUrl(path) {
  return `${GATEWAY_URL.replace(/\/$/, "")}${path}`;
}

function protectedUrl(resource, buyer) {
  const url = new URL(gatewayUrl(resource.endpoint));
  if (buyer) url.searchParams.set("buyer", buyer);
  return url.toString();
}

export async function requestPaymentTerms(resource, buyer) {
  const response = await fetch(protectedUrl(resource, buyer), {
    headers: buyer ? { "X-Stripe3-Buyer": buyer } : {},
  });
  const body = await response.json();

  if (response.status === 402) {
    return {
      paid: false,
      body,
      required: decodePaymentHeader(response.headers.get(PAYMENT_REQUIRED_HEADER)),
    };
  }

  if (!response.ok) {
    throw new Error(body.error || "Unable to request payment terms.");
  }

  return {
    paid: true,
    payload: body,
    settlement: decodePaymentHeader(response.headers.get(PAYMENT_RESPONSE_HEADER)),
  };
}

export async function unlockProtectedResource({ resource, buyer, payment }) {
  const response = await fetch(protectedUrl(resource, buyer), {
    headers: {
      "X-Stripe3-Buyer": buyer,
      [PAYMENT_SIGNATURE_HEADER]: encodePaymentHeader(payment),
    },
  });
  const body = await response.json();
  const settlement = decodePaymentHeader(response.headers.get(PAYMENT_RESPONSE_HEADER));

  if (!response.ok) {
    throw new Error(body.error || settlement?.error || "Unable to unlock protected resource.");
  }

  return { body, settlement };
}

export async function fetchReceiptsForBuyer(buyer) {
  if (!buyer) return [];

  const url = new URL(gatewayUrl("/api/receipts"));
  url.searchParams.set("buyer", buyer);
  const response = await fetch(url.toString());
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || "Unable to fetch receipts.");
  }

  return body.receipts || [];
}
