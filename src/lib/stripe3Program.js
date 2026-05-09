import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";
import idl from "../idl/stripe3.json";
import { assertStripe3ProgramConfigured, getModeFromNetwork } from "./networks";

export const STRIPE3_PROGRAM_ID = new PublicKey(idl.address);

function getProgramIdForResource(resource) {
  const mode = getModeFromNetwork(resource.network);
  const config = assertStripe3ProgramConfigured(mode);
  return new PublicKey(resource.programId || config.programId);
}

export function getProductPda(resource) {
  const merchant = new PublicKey(resource.merchant);
  const programId = getProgramIdForResource(resource);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("product"), merchant.toBuffer(), Buffer.from(resource.id)],
    programId,
  )[0];
}

export function getReceiptPda(resource, buyer) {
  const product = getProductPda(resource);
  const programId = getProgramIdForResource(resource);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("receipt"), product.toBuffer(), buyer.toBuffer()],
    programId,
  )[0];
}

export function createStripe3Program(connection, wallet, resource) {
  const programId = getProgramIdForResource(resource);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });

  return new Program({ ...idl, address: programId.toBase58() }, provider);
}

export async function createProduct({ connection, wallet, resource }) {
  if (!wallet?.publicKey) {
    throw new Error("Connect a Solana wallet first.");
  }

  const program = createStripe3Program(connection, wallet, resource);
  const product = getProductPda(resource);
  const existingProduct = await connection.getAccountInfo(product, "confirmed");

  if (existingProduct) {
    return {
      alreadyExists: true,
      signature: null,
      product: product.toBase58(),
    };
  }

  try {
    const signature = await program.methods
      .createProduct(resource.id, new BN(resource.priceLamports))
      .accountsStrict({
        merchant: wallet.publicKey,
        product,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      alreadyExists: false,
      signature,
      product: product.toBase58(),
    };
  } catch (error) {
    const recoveredProduct = await connection.getAccountInfo(product, "confirmed");
    if (!recoveredProduct) throw error;

    return {
      alreadyExists: true,
      signature: null,
      product: product.toBase58(),
    };
  }

}

export async function setProductActive({ connection, wallet, resource, active }) {
  if (!wallet?.publicKey) {
    throw new Error("Connect a Solana wallet first.");
  }

  if (wallet.publicKey.toBase58() !== resource.merchant) {
    throw new Error("Connect the seller wallet for this resource.");
  }

  const program = createStripe3Program(connection, wallet, resource);
  const product = getProductPda(resource);

  const signature = await program.methods
    .setProductActive(resource.id, active)
    .accountsStrict({
      merchant: wallet.publicKey,
      product,
    })
    .rpc();

  return {
    signature,
    product: product.toBase58(),
    active,
  };
}

export async function payForResource({ connection, wallet, resource }) {
  if (!wallet?.publicKey) {
    throw new Error("Connect a Solana wallet first.");
  }

  const program = createStripe3Program(connection, wallet, resource);
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

  try {
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
  } catch (error) {
    const recoveredReceipt = await connection.getAccountInfo(receipt, "confirmed");
    if (!recoveredReceipt) throw error;

    return {
      alreadyVerified: true,
      signature: null,
      product: product.toBase58(),
      receipt: receipt.toBase58(),
    };
  }

}
