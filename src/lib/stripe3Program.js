import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";
import idl from "../idl/stripe3.json";

export const STRIPE3_PROGRAM_ID = new PublicKey(idl.address);

export function getProductPda(resource) {
  const merchant = new PublicKey(resource.merchant);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("product"), merchant.toBuffer(), Buffer.from(resource.id)],
    STRIPE3_PROGRAM_ID,
  )[0];
}

export function getReceiptPda(resource, buyer) {
  const product = getProductPda(resource);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("receipt"), product.toBuffer(), buyer.toBuffer()],
    STRIPE3_PROGRAM_ID,
  )[0];
}

export function createStripe3Program(connection, wallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });

  return new Program(idl, provider);
}

export async function payForResource({ connection, wallet, resource }) {
  if (!wallet?.publicKey) {
    throw new Error("Connect a Solana wallet first.");
  }

  const program = createStripe3Program(connection, wallet);
  const merchant = new PublicKey(resource.merchant);
  const product = getProductPda(resource);
  const receipt = getReceiptPda(resource, wallet.publicKey);
  const existingReceipt = await connection.getAccountInfo(receipt, "confirmed");

  if (existingReceipt) {
    return {
      alreadyVerified: true,
      signature: null,
      product: product.toBase58(),
      receipt: receipt.toBase58(),
    };
  }

  const signature = await program.methods
    .payForResource(resource.id)
    .accountsStrict({
      buyer: wallet.publicKey,
      product,
      merchant,
      receipt,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return {
    alreadyVerified: false,
    signature,
    product: product.toBase58(),
    receipt: receipt.toBase58(),
  };
}
