export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatAddress(address = "") {
  if (!address || address.length < 12) return address || "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatLamports(lamports) {
  return `${(Number(lamports) / 1_000_000_000).toFixed(4)} SOL`;
}

export function getResourceById(resources, id) {
  return resources.find((resource) => resource.id === id) || resources[0] || null;
}

export function slugifyResourceId(title) {
  const base = String(title || "resource")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 22) || "resource";
  const suffix = Date.now().toString(36).slice(-6);
  return `${base}-${suffix}`.slice(0, 32);
}

export function solToLamports(value) {
  const text = String(value || "").trim();

  if (!/^\d+(\.\d{1,9})?$/.test(text)) {
    throw new Error("Enter a valid SOL amount with up to 9 decimals.");
  }

  const [whole, fraction = ""] = text.split(".");
  const lamports =
    BigInt(whole) * 1_000_000_000n +
    BigInt((fraction + "000000000").slice(0, 9));

  if (lamports <= 0n || lamports > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Enter a positive SOL amount below the safe demo limit.");
  }

  return Number(lamports);
}
