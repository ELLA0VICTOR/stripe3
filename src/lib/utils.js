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
  return resources.find((resource) => resource.id === id) || resources[0];
}
