import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { encodeURL } from "@solana/pay";
import QRCode from "qrcode";
import { BigNumber } from "bignumber.js";
import { PaymentReference, PaymentVerification } from "../types";
import { config } from "../config";

export const generatePaymentReference = (): PaymentReference => {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toBase58(),
  };
};

export const createSolanaPayQR = async (
  amount: number | any, // Accept both number and Decimal
  reference: PaymentReference,
  memo: string
): Promise<string> => {
  try {
    console.log(
      "Creating Solana Pay QR with amount:",
      amount,
      "type:",
      typeof amount
    );

    // Validate configuration
    if (
      !config.solana.recipientWalletAddress ||
      !config.solana.usdcMintAddress
    ) {
      throw new Error(
        "Missing Solana configuration. Please check your environment variables: VITE_RECIPIENT_WALLET_ADDRESS and VITE_USDC_MINT_ADDRESS"
      );
    }

    const recipient = new PublicKey(config.solana.recipientWalletAddress);
    const splToken = new PublicKey(config.solana.usdcMintAddress);
    const referenceKey = new PublicKey(reference.publicKey);

    console.log({ amount });

    // Handle Decimal objects
    let numericAmount: number;
    if (
      typeof amount === "object" &&
      amount &&
      typeof amount.toNumber === "function" &&
      typeof amount.decimalPlaces === "function"
    ) {
      // It's a Decimal object
      numericAmount = amount.toNumber();
    } else if (typeof amount === "number") {
      numericAmount = amount;
    } else {
      console.error("Invalid amount object:", amount, "Type:", typeof amount);
      throw new Error(
        `Invalid amount type: ${typeof amount}. Expected number or Decimal object with toNumber and decimalPlaces methods.`
      );
    }

    console.log("Converted amount to number:", numericAmount);

    // Convert NGN to USDC (simplified conversion for demo)
    // In production, you'd use real exchange rates
    const usdcAmount = numericAmount / 1600; // Rough NGN to USD conversion

    // Convert to lamports for Solana Pay (6 decimals for USDC)
    const amountInLamports = Math.floor(usdcAmount * Math.pow(10, 6));

    // Create BigNumber instance (required by @solana/pay)
    const amountBigNumber = new BigNumber(amountInLamports);

    console.log(
      "Amount in lamports:",
      amountInLamports,
      "BigNumber:",
      amountBigNumber.toString()
    );

    // Create Solana Pay URL
    const paymentUrl = encodeURL({
      recipient,
      amount: amountBigNumber,
      splToken,
      reference: referenceKey,
      memo,
    });

    // Generate QR code from the payment URL
    const qrDataUrl = await QRCode.toDataURL(paymentUrl.toString(), {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    console.log("QR code generated successfully");

    return qrDataUrl;
  } catch (error) {
    console.error("Error creating Solana Pay QR:", error);
    throw error; // Re-throw the error so the caller can handle it
  }
};

export const verifyPayment = async (
  reference: PaymentReference,
  expectedAmount: number
): Promise<PaymentVerification> => {
  try {
    const connection = new Connection(config.solana.rpcUrl);
    const referenceKey = new PublicKey(reference.publicKey);

    // TODO: Implement actual payment verification
    // This would involve:
    // 1. Finding transactions that include the reference key
    // 2. Verifying the transaction details (amount, recipient, token mint)
    // 3. Confirming the transaction is confirmed on-chain

    // For demo purposes, simulate a successful verification after delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      verified: true,
      transactionSignature: "demo_signature_" + Date.now(),
      amount: expectedAmount,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      verified: false,
    };
  }
};

export const formatUSDCAmount = (ngnAmount: number): string => {
  const usdcAmount = ngnAmount / 1600; // Rough conversion
  return usdcAmount.toFixed(6);
};
