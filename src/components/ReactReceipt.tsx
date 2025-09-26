import React from "react";
import { Download } from "lucide-react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFDownloadLink,
	Link,
} from "@react-pdf/renderer";

import { RemitaDetails } from "../types";

interface ReceiptPDFProps {
	receipt: RemitaDetails;
	transactionSignature: string;
}

const styles = StyleSheet.create({
	page: {
		fontSize: 12,
		padding: 30,
		backgroundColor: "#fff",
	},
	header: {
		backgroundColor: "#16a34a",
		padding: 30,
		borderRadius: 6,
		color: "#fff",
		marginBottom: 20,
		textAlign: "center",
	},
	headerTitle: {
		paddingBottom: 2,
		fontSize: 20,
		fontWeight: "bold",
	},
	section: {
		marginBottom: 15,
		padding: 15,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 6,
	},
	label: {
		paddingBottom: 2,
		fontSize: 12,
		color: "#555",
	},
	value: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10,
		marginTop: 3,
	},
	row: {
		paddingTop: 2,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
});

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({
	receipt,
	transactionSignature,
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Payment Successful!</Text>
				<Text>Remita invoice settled using Solana USDC</Text>
			</View>

			{/* Payment Summary */}
			<View style={styles.section}>
				<Text style={styles.value}>Payment Receipt</Text>

				<View style={styles.row}>
					<View>
						<Text style={styles.label}>RRR</Text>
						<Text style={styles.value}>{receipt.rrr}</Text>
					</View>
					<View>
						<Text style={styles.label}>Amount Paid</Text>
						<Text style={styles.value}>
							{new Intl.NumberFormat("en-NG", {}).format(
								receipt.amount
							)}{" "}
							NGN
						</Text>
					</View>
				</View>

				<View style={styles.row}>
					<View>
						<Text style={styles.label}>Payment Date</Text>
						<Text style={styles.value}>
							{new Date(
								receipt.metadata.paymentDate
							).toLocaleString()}
						</Text>
					</View>
					<View>
						<Text style={styles.label}>Payer Name</Text>
						<Text style={styles.value}>{receipt.name}</Text>
					</View>
				</View>

				<Text style={styles.label}>Description</Text>
				<Text style={styles.value}>{receipt.description}</Text>
			</View>

			{/* Blockchain Info */}
			<View style={styles.section}>
				<Text style={styles.value}>Blockchain Transaction</Text>
				<Text style={styles.label}>
					Signature:{" "}
					<Link
						style={{ fontFamily: "Courier" }}
						href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
					>
						{transactionSignature}
					</Link>
				</Text>
				<Text style={styles.label}>Network: Solana Devnet</Text>
				<Text style={styles.label}>Token: USDC</Text>
				<Text style={styles.label}>Payment Method: Solana Pay</Text>
			</View>

			{/* Footer */}
			<View style={{ textAlign: "center", margin: 12 }}>
				<Text style={{ fontSize: 10, color: "#555" }}>
					Powered by RemitaPay
				</Text>
			</View>
		</Page>
	</Document>
);

export const ReceiptDownloadLink: React.FC<ReceiptPDFProps> = (props) => (
	<button className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
		<PDFDownloadLink
			document={<ReceiptPDF {...props} />}
			fileName={`receipt-${props.receipt.rrr}.pdf`}
			className="flex items-center"
		>
			<Download className="w-5 h-5 mr-2" />
			Download Receipt (PDF)
		</PDFDownloadLink>
	</button>
);
