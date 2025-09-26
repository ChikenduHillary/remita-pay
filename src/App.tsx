import { useState } from "react";
import { StepIndicator } from "./components/StepIndicator";
import { RRRInputForm } from "./components/RRRInputForm";
import { InvoiceDetails as InvoiceDetailsComponent } from "./components/InvoiceDetails";
import { SolanaPayment } from "./components/SolanaPayment";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { PaymentStep, RemitaDetails } from "./types";
import { fetchInvoice, fetchReceipt } from "./utils/remita";
import { config } from "./config";

function App() {
	const [currentStep, setCurrentStep] = useState<PaymentStep>("input");
	const [invoice, setInvoice] = useState<RemitaDetails | null>(null);
	const [receipt, setReceipt] = useState<RemitaDetails | null>(null);
	const [transactionSignature, setTransactionSignature] =
		useState<string>("");
	const [error, setError] = useState<string>("");

	const handleRRRSubmit = async (rrr: string) => {
		setCurrentStep("loading");
		setError("");

		try {
			const invoiceDetails = await fetchInvoice(rrr);
			setInvoice(invoiceDetails);
			setCurrentStep("review");
		} catch (err) {
			setError(
				"Failed to fetch invoice details. Please check your RRR and try again."
			);
			setCurrentStep("error");
		}
	};

	const handleProceedToPayment = () => {
		setCurrentStep("payment");
	};

	const handlePaymentVerified = async (signature: string) => {
		if (!invoice) return;

		setCurrentStep("processing");
		setTransactionSignature(signature);

		try {
			const receiptDetails = await fetchReceipt(invoice.rrr);
			setReceipt(receiptDetails);
			setCurrentStep("success");
		} catch (err) {
			setError(
				"Payment was verified but failed to update Remita. Please contact support."
			);
			setCurrentStep("error");
		}
	};

	const handleStartOver = () => {
		setCurrentStep("input");
		setInvoice(null);
		setReceipt(null);
		setTransactionSignature("");
		setError("");
	};

	const handleBack = () => {
		if (currentStep === "review") {
			setCurrentStep("input");
		} else if (currentStep === "payment") {
			setCurrentStep("review");
		}
	};

	const handleRetry = () => {
		if (currentStep === "error" && invoice) {
			setCurrentStep("review");
		} else {
			setCurrentStep("input");
		}
		setError("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						{config.app.name}
					</h1>
					<p className="text-gray-600 text-lg">
						Settle Remita invoices instantly using USDC on Solana
					</p>
				</div>

				{/* Step Indicator */}
				{currentStep !== "error" && (
					<StepIndicator currentStep={currentStep} />
				)}

				{/* Main Content */}
				<div className="flex justify-center">
					{currentStep === "input" && (
						<RRRInputForm
							onSubmit={handleRRRSubmit}
							loading={false}
						/>
					)}

					{currentStep === "loading" && (
						<div className="w-full max-w-md mx-auto text-center">
							<div className="bg-white rounded-2xl shadow-xl p-8">
								<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<h2 className="text-xl font-bold text-gray-900 mb-2">
									Fetching Invoice Details
								</h2>
								<p className="text-gray-600">
									Please wait while we retrieve your invoice
									information...
								</p>
							</div>
						</div>
					)}

					{currentStep === "review" && invoice && (
						<InvoiceDetailsComponent
							invoice={invoice}
							onProceedToPayment={handleProceedToPayment}
							onBack={handleBack}
						/>
					)}

					{currentStep === "payment" && invoice && (
						<SolanaPayment
							invoice={invoice}
							onPaymentVerified={handlePaymentVerified}
							onBack={handleBack}
						/>
					)}

					{currentStep === "processing" && (
						<div className="w-full max-w-md mx-auto text-center">
							<div className="bg-white rounded-2xl shadow-xl p-8">
								<div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<h2 className="text-xl font-bold text-gray-900 mb-2">
									Processing Payment
								</h2>
								<p className="text-gray-600">
									Confirming payment with Remita and
									generating your receipt...
								</p>
							</div>
						</div>
					)}

					{currentStep === "success" && receipt && (
						<PaymentSuccess
							receipt={receipt}
							transactionSignature={transactionSignature}
							onStartOver={handleStartOver}
						/>
					)}

					{currentStep === "error" && (
						<ErrorDisplay
							message={error}
							onRetry={handleRetry}
							onStartOver={handleStartOver}
						/>
					)}
				</div>

				{/* Footer */}
				<div className="mt-16 text-center text-gray-500 text-sm">
					<p>
						Powered by Solana blockchain • Secured by USDC • Built
						for speed
					</p>
					<p className="mt-2">
						This demo uses Solana devnet. For production use, ensure
						you're on mainnet.
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
