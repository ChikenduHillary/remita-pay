import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { encodeURL, findReference, validateTransfer } from "@solana/pay";
import QRCode from "qrcode";
import { BigNumber } from "bignumber.js";
import { PaymentReference, PaymentVerification } from "../types";
import { config } from "../config";

import { getRate, RateType } from "paj_ramp";

const RECIPIENT_ADDRESS = new PublicKey(config.solana.recipientWalletAddress);
const USDC_MINT_ADDRESS = new PublicKey(config.solana.usdcMintAddress);

export const formatUSDCAmount = async (ngnAmount: number): Promise<string> => {
	const rate: any = await getRate(RateType.offRamp);
	const usdcAmount = ngnAmount / rate.rate;
	return usdcAmount.toFixed(2);
};

export const generatePaymentReference = async (
	memo: string
): Promise<PaymentReference> => {
	const keypair = Keypair.generate();
	const rate: any = await getRate(RateType.offRamp);
	return { key: keypair.publicKey.toBase58(), rate: rate.rate, memo };
};

export const createSolanaPayQR = async (
	amount: number,
	reference: PaymentReference,
	memo: string
): Promise<string> => {
	try {
		const referenceKey = new PublicKey(reference.key);
		const usdcAmount = amount / reference.rate;

		const paymentUrl = encodeURL({
			recipient: RECIPIENT_ADDRESS,
			amount: new BigNumber(usdcAmount).decimalPlaces(
				6,
				BigNumber.ROUND_FLOOR
			),
			splToken: USDC_MINT_ADDRESS,
			reference: referenceKey,
			memo,
		});

		const qrDataUrl = await QRCode.toDataURL(paymentUrl.toString(), {
			width: 256,
			margin: 2,
		});

		return qrDataUrl;
	} catch (error) {
		console.error("Error creating Solana Pay QR:", error);
		throw error; // Re-throw the error so the caller can handle it
	}
};

export const verifyPayment = async (
	reference: PaymentReference,
	amount: number
): Promise<PaymentVerification> => {
	try {
		const connection = new Connection(config.solana.rpcUrl);
		const referenceKey = new PublicKey(reference.key);
		const usdcAmount = amount / reference.rate;

		let response: any = null;
		const maxAttempts = 10;
		const delay = 2000;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				const signature = await findReference(connection, referenceKey);
				reference.signature = signature.signature;

				response = await validateTransfer(
					connection,
					signature.signature,
					{
						amount: new BigNumber(usdcAmount).decimalPlaces(
							6,
							BigNumber.ROUND_FLOOR
						),
						recipient: RECIPIENT_ADDRESS,
						splToken: USDC_MINT_ADDRESS,
						reference: referenceKey,
						memo: reference.memo,
					},
					{ commitment: "confirmed" }
				);

				if (!response) {
					throw new Error(
						"Payment Verification failed after max attempts"
					);
				}
			} catch (err) {
				console.log(`Attempt ${attempt + 1} failed, retrying...`);
				await new Promise((res) => setTimeout(res, delay));
			}
		}

		return {
			verified: true,
			transactionSignature: reference.signature,
			amount: usdcAmount,
			timestamp: Date.now(),
		};
	} catch (error) {
		console.error("Error verifying payment:", error);
		return {
			verified: false,
		};
	}
};
