import React, { useState, useEffect } from "react";
import { QrCode, Smartphone, AlertCircle } from "lucide-react";
import { RemitaDetails, PaymentReference } from "../types";
import {
	createSolanaPayQR,
	generatePaymentReference,
	verifyPayment,
	formatUSDCAmount,
} from "../utils/solana";

interface SolanaPaymentProps {
	invoice: RemitaDetails;
	onPaymentVerified: (transactionSignature: string) => void;
	onBack: () => void;
}

export const SolanaPayment: React.FC<SolanaPaymentProps> = ({
	invoice,
	onPaymentVerified,
	onBack,
}) => {
	const [qrCodeData, setQrCodeData] = useState<string>("");
	const [paymentReference, setPaymentReference] =
		useState<PaymentReference | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [error, setError] = useState<string>("");
	const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
	const [formattedAmount, setFormattedAmount] = useState<string>("0.00");

	useEffect(() => {
		async function fetchUSDCAmount() {
			setFormattedAmount(await formatUSDCAmount(invoice.amount));
		}
		fetchUSDCAmount();
	}, [invoice]);

	useEffect(() => {
		generateQRCode();
	}, []);

	useEffect(() => {
		if (timeRemaining > 0) {
			const timer = setTimeout(
				() => setTimeRemaining(timeRemaining - 1),
				1000
			);
			return () => clearTimeout(timer);
		}
	}, [timeRemaining]);

	const generateQRCode = async (retryCount = 0) => {
		try {
			setError("");

			const memo = `Remita Invoice Payment - RRR: ${invoice.rrr}`;
			const reference = await generatePaymentReference(memo);
			setPaymentReference(reference);

			const qrData = await createSolanaPayQR(
				invoice.amount,
				reference,
				memo
			);

			setQrCodeData(qrData);
			setTimeRemaining(300);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to generate payment QR code";

			console.error(
				"QR Generation Error (attempt",
				retryCount + 1,
				"):",
				err
			);

			if (errorMessage.includes("Missing Solana configuration")) {
				setError(
					"QR generation failed: Please configure your Solana wallet address and USDC mint address in the .env file. See SETUP.md for instructions."
				);
			} else if (errorMessage.includes("Invalid amount type")) {
				setError(
					"QR generation failed: Invalid amount format. Please check the invoice amount."
				);
			} else if (retryCount < 2) {
				// Retry up to 2 times for transient errors
				console.log("Retrying QR generation...");
				setTimeout(() => generateQRCode(retryCount + 1), 1000);
				return;
			} else {
				setError(
					`QR generation failed after ${
						retryCount + 1
					} attempts: ${errorMessage}`
				);
			}
		}
	};

	const startPaymentMonitoring = async () => {
		if (!paymentReference) return;

		setIsMonitoring(true);
		setError("");

		try {
			const verification = await verifyPayment(
				paymentReference,
				invoice.amount
			);

			if (verification.verified && verification.transactionSignature) {
				onPaymentVerified(verification.transactionSignature);
			} else {
				setError("Payment verification failed. Please try again.");
			}
		} catch (err) {
			setError(
				"Error verifying payment. Please check your transaction and try again."
			);
			console.error(err);
		} finally {
			setIsMonitoring(false);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold mb-1">
								Solana Payment
							</h2>
							<p className="text-purple-100">
								Scan QR code with your Solana wallet
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-right">
								<p className="text-sm text-purple-100">
									Time remaining
								</p>
								<p className="text-xl font-bold">
									{formatTime(timeRemaining)}
								</p>
							</div>
							<QrCode className="w-8 h-8 text-purple-200" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
					{/* QR Code Section */}
					<div className="flex flex-col items-center">
						<div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-lg mb-6">
							{qrCodeData ? (
								<img
									src={qrCodeData}
									alt="Solana Pay QR Code"
									className="w-64 h-64"
								/>
							) : (
								<div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
									<div className="text-center">
										<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
										<p className="text-gray-600">
											Generating QR code...
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="text-center space-y-4">
							<div className="flex items-center justify-center space-x-2 text-blue-600">
								<Smartphone className="w-5 h-5" />
								<p className="font-semibold">
									Scan with your Solana wallet
								</p>
							</div>

							<button
								onClick={startPaymentMonitoring}
								disabled={isMonitoring || !qrCodeData}
								className={`
                  w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200
                  ${
						isMonitoring
							? "bg-gray-400 text-white cursor-not-allowed"
							: "bg-green-600 text-white hover:bg-green-700 active:transform active:scale-95 shadow-lg hover:shadow-xl"
					}
                `}
							>
								{isMonitoring ? (
									<div className="flex items-center justify-center">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
										Verifying Payment...
									</div>
								) : (
									"I have sent the payment"
								)}
							</button>

							{error && (
								<div className="space-y-3">
									<div className="flex items-center justify-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
										<AlertCircle
											size={16}
											className="mr-2"
										/>
										{error}
									</div>
									<button
										onClick={() => generateQRCode()}
										className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										Retry QR Generation
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Payment Details Section */}
					<div className="space-y-6">
						<div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
							<h3 className="text-lg font-bold text-blue-900 mb-4">
								Payment Details
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-blue-700">
										Amount (NGN):
									</span>
									<span className="font-bold text-blue-900">
										₦{invoice.amount.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-blue-700">
										Amount (USDC):
									</span>
									<span className="font-bold text-blue-900">
										${formattedAmount} USDC
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-blue-700">
										Network:
									</span>
									<span className="font-bold text-blue-900">
										Solana (Devnet)
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-blue-700">
										Token:
									</span>
									<span className="font-bold text-blue-900">
										USDC
									</span>
								</div>
							</div>
						</div>

						<div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
							<h3 className="text-lg font-bold text-yellow-900 mb-4">
								Instructions
							</h3>
							<ol className="list-decimal list-inside space-y-2 text-yellow-800">
								<li>
									Open your Solana wallet (Phantom, Solflare,
									etc.)
								</li>
								<li>Scan the QR code above</li>
								<li>
									Review the payment details in your wallet
								</li>
								<li>Confirm the transaction</li>
								<li>
									Click "I have sent the payment" to verify
								</li>
							</ol>
						</div>

						<div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Invoice Information
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">RRR:</span>
									<span className="font-mono font-bold">
										{invoice.rrr}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">
										Description:
									</span>
									<span className="text-right max-w-xs">
										{invoice.description}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">
										Payer:
									</span>
									<span>{invoice.name}</span>
								</div>
							</div>
						</div>

						<button
							onClick={onBack}
							className="w-full px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Back to Invoice Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
