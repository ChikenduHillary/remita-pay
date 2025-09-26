import React, { useState, useEffect } from "react";
import { FileText, User, Calendar, DollarSign, Building } from "lucide-react";
import { RemitaDetails } from "../types";
import { formatUSDCAmount } from "../utils/solana";

interface InvoiceDetailsProps {
	invoice: RemitaDetails;
	onProceedToPayment: () => void;
	onBack: () => void;
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
	invoice,
	onProceedToPayment,
	onBack,
}) => {
	const [formattedAmount, setFormattedAmount] = useState<string>("0.00");

	useEffect(() => {
		async function fetchUSDCAmount() {
			setFormattedAmount(await formatUSDCAmount(invoice.amount));
		}
		fetchUSDCAmount();
	}, [invoice]);

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold mb-1">
								Invoice Details
							</h2>
							<p className="text-blue-100">
								Review payment information
							</p>
						</div>
						<FileText className="w-8 h-8 text-blue-200" />
					</div>
				</div>

				{/* Invoice Content */}
				<div className="p-6 space-y-6">
					{/* RRR and Status */}
					<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
						<div>
							<p className="text-sm text-gray-600 mb-1">
								RRR Reference
							</p>
							<p className="text-xl font-mono font-bold text-gray-900">
								{invoice.rrr}
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-600 mb-1">Status</p>
							<span
								className={`
                inline-flex px-3 py-1 rounded-full text-sm font-medium
                ${
					invoice.status === "PENDING"
						? "bg-yellow-100 text-yellow-800"
						: "bg-green-100 text-green-800"
				}
              `}
							>
								{invoice.status}
							</span>
						</div>
					</div>

					{/* Amount Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 border border-gray-200 rounded-xl">
							<div className="flex items-center mb-2">
								<DollarSign className="w-5 h-5 text-gray-500 mr-2" />
								<p className="text-sm text-gray-600">
									Amount (NGN)
								</p>
							</div>
							<p className="text-2xl font-bold text-gray-900">
								{formatCurrency(
									invoice.amount,
									invoice.currency
								)}
							</p>
						</div>
						<div className="p-4 border border-gray-200 rounded-xl bg-blue-50">
							<div className="flex items-center mb-2">
								<DollarSign className="w-5 h-5 text-blue-600 mr-2" />
								<p className="text-sm text-blue-600">
									Equivalent (USDC)
								</p>
							</div>
							<p className="text-2xl font-bold text-blue-900">
								${formattedAmount} USDC
							</p>
						</div>
					</div>

					{/* Description */}
					<div className="p-4 border border-gray-200 rounded-xl">
						<p className="text-sm text-gray-600 mb-2">
							Description
						</p>
						<p className="text-gray-900 font-medium">
							{invoice.description}
						</p>
					</div>

					{/* Payer Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 border border-gray-200 rounded-xl">
							<div className="flex items-center mb-2">
								<User className="w-5 h-5 text-gray-500 mr-2" />
								<p className="text-sm text-gray-600">
									Payer Name
								</p>
							</div>
							<p className="text-gray-900 font-medium">
								{invoice.name}
							</p>
						</div>
						<div className="p-4 border border-gray-200 rounded-xl">
							<div className="flex items-center mb-2">
								<Building className="w-5 h-5 text-gray-500 mr-2" />
								<p className="text-sm text-gray-600">
									Merchant ID
								</p>
							</div>
							<p className="text-gray-900 font-mono">
								{invoice.billerId}
							</p>
						</div>
					</div>

					{/* Due Date */}
					{invoice.metadata.transactionDate && (
						<div className="p-4 border border-gray-200 rounded-xl">
							<div className="flex items-center mb-2">
								<Calendar className="w-5 h-5 text-gray-500 mr-2" />
								<p className="text-sm text-gray-600">
									Due Date
								</p>
							</div>
							<p className="text-gray-900 font-medium">
								{new Date(
									invoice.metadata.transactionDate
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="p-6 bg-gray-50 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row gap-3">
						<button
							onClick={onBack}
							className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Back to RRR Input
						</button>
						<button
							onClick={onProceedToPayment}
							className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl active:transform active:scale-95"
						>
							Proceed to Payment
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
