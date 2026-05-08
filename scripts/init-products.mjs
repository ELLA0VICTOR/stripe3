import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../src/idl/stripe3.json" with { type: "json" };
import { resources } from "../src/lib/data.js";

const rpcUrl = process.env.ANCHOR_PROVIDER_URL || process.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com";
const walletPath = process.env.ANCHOR_WALLET || path.join(os.homedir(), ".config", "solana", "id.json");
const programId = new PublicKey(idl.address);

function readKeypair(filePath) {
  const secret = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return anchor.web3.Keypair.fromSecretKey(Uint8Array.from(secret));
}

function productPda(resource) {
  const merchant = new PublicKey(resource.merchant);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("product"), merchant.toBuffer(), Buffer.from(resource.id)],
    programId,
  )[0];
}

const connection = new anchor.web3.Connection(rpcUrl, "confirmed");
const wallet = new anchor.Wallet(readKeypair(walletPath));
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
  preflightCommitment: "confirmed",
});
const program = new anchor.Program(idl, provider);

console.log(`RPC: ${rpcUrl}`);
console.log(`Merchant wallet: ${wallet.publicKey.toBase58()}`);
console.log(`Program: ${programId.toBase58()}`);

for (const resource of resources) {
  const merchant = new PublicKey(resource.merchant);

  if (!merchant.equals(wallet.publicKey)) {
    throw new Error(`Merchant mismatch for ${resource.id}. Expected ${wallet.publicKey.toBase58()}, got ${merchant.toBase58()}`);
  }

  const product = productPda(resource);
  const account = await connection.getAccountInfo(product, "confirmed");
  const price = new anchor.BN(resource.priceLamports);

  if (account) {
    const signature = await program.methods
      .updateProductPrice(resource.id, price)
      .accountsStrict({
        merchant: wallet.publicKey,
        product,
      })
      .rpc();

    console.log(`[updated] ${resource.id}: ${product.toBase58()} ${signature}`);
    continue;
  }

  const signature = await program.methods
    .createProduct(resource.id, price)
    .accountsStrict({
      merchant: wallet.publicKey,
      product,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log(`[created] ${resource.id}: ${product.toBase58()} ${signature}`);
}
