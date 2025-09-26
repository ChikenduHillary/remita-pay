import React, { useState } from "react";
import {
	CheckCircle2,
	Receipt as ReceiptIcon,
	ExternalLink,
	Copy,
	Check,
} from "lucide-react";
import { ReceiptDownloadLink } from "./ReactReceipt";

import { RemitaDetails } from "../types";

interface PaymentSuccessProps {
	receipt: RemitaDetails;
	transactionSignature: string;
	onStartOver: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
	receipt,
	transactionSignature,
	onStartOver,
}) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const truncateSignature = (signature: string) => {
		return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
	};

	return (
		<div className="w-full max-w-3xl mx-auto">
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
				{/* Success Header */}
				<div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
						<CheckCircle2 className="w-10 h-10" />
					</div>
					<h1 className="text-3xl font-bold mb-2">
						Payment Successful!
					</h1>
					<p className="text-green-100 text-lg">
						Your Remita invoice has been settled using Solana USDC
					</p>
				</div>

				{/* Receipt Details */}
				<div className="p-8 space-y-6">
					{/* Transaction Summary */}
					<div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
						<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
							<ReceiptIcon className="w-6 h-6 mr-2 text-gray-600" />
							Payment Receipt
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-600 mb-1">
										Remita Retrieval Reference (RRR){" "}
									</p>
									<p className="font-mono text-lg font-bold text-gray-900">
										{receipt.rrr}
									</p>
								</div>

								<div>
									<p className="text-sm text-gray-600 mb-1">
										Amount Paid
									</p>
									<p className="text-2xl font-bold text-green-600">
										{formatCurrency(
											receipt.amount,
											receipt.currency
										)}
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-600 mb-1">
										Payment Date
									</p>
									<p className="font-semibold text-gray-900">
										{formatDate(
											receipt.metadata.paymentDate
										)}
									</p>
								</div>

								<div>
									<p className="text-sm text-gray-600 mb-1">
										Payer Name
									</p>
									<p className="font-semibold text-gray-900">
										{receipt.name}
									</p>
								</div>

								<div>
									<p className="text-sm text-gray-600 mb-1">
										Status
									</p>
									<span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
										{receipt.status}
									</span>
								</div>
							</div>
						</div>

						<div className="mt-6 pt-6 border-t border-gray-200">
							<div>
								<p className="text-sm text-gray-600 mb-1">
									Description
								</p>
								<p className="text-gray-900 font-medium">
									{receipt.description}
								</p>
							</div>
						</div>
					</div>

					{/* Blockchain Details */}
					<div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
						<h3 className="text-lg font-bold text-blue-900 mb-4">
							Blockchain Transaction
						</h3>

						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-white rounded-lg">
								<div>
									<p className="text-sm text-blue-600 mb-1">
										Solana Transaction
									</p>
									<p className="font-mono text-blue-900 font-semibold">
										{truncateSignature(
											transactionSignature
										)}
									</p>
								</div>
								<div className="flex space-x-2">
									<button
										onClick={() =>
											copyToClipboard(
												transactionSignature
											)
										}
										className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
										title="Copy transaction signature"
									>
										{copied ? (
											<Check size={16} />
										) : (
											<Copy size={16} />
										)}
									</button>
									<button
										onClick={() =>
											window.open(
												`https://solscan.io/tx/${transactionSignature}?cluster=devnet`,
												"_blank"
											)
										}
										className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
										title="View on Solscan"
									>
										<ExternalLink size={16} />
									</button>
								</div>
							</div>

							<div className="text-sm text-blue-700 bg-white p-3 rounded-lg">
								<p>
									<strong>Network:</strong> Solana Devnet
								</p>
								<p>
									<strong>Token:</strong> USDC
								</p>
								<p>
									<strong>Payment Method:</strong> Solana Pay
								</p>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4">
						<ReceiptDownloadLink
							receipt={receipt}
							transactionSignature={transactionSignature}
						/>

						<button
							onClick={onStartOver}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
						>
							Make Another Payment
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
