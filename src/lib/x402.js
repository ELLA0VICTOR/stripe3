export const PAYMENT_REQUIRED_HEADER = "PAYMENT-REQUIRED";
export const PAYMENT_SIGNATURE_HEADER = "PAYMENT-SIGNATURE";
export const PAYMENT_RESPONSE_HEADER = "PAYMENT-RESPONSE";

export function encodePaymentHeader(payload) {
  return btoa(JSON.stringify(payload));
}

export function decodePaymentHeader(value) {
  if (!value) return null;
  return JSON.parse(atob(value));
}
