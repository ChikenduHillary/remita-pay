import { RemitaDetails } from "../types";
import { config } from "../config";

// remita test data for development
const REMITA_TEST_INVOICE: RemitaDetails = {
	billerId: "S0000573002",
	billerName: "FEDERAL UNIVERSITY OF TECHNOLOGY, OWERRI",
	productName: "ACCOMMODATION UNDERGRADUATE",
	categoryId: "6",
	categoryName: "Educational Institutions",
	name: "Hillary Chikendu",
	phoneNumber: "08028892288",
	email: "hillarychikendu@gmail.com",
	paymentIdentifier: "799068434",
	amount: 2000,
	fee: 0,
	rrrAmount: 2000,
	rrr: "210799068434",
	currency: "NGN",
	description: "UNDERGRADUATE ACCOMMODATION",
	vtu: false,
	rrrType: "PY",
	commission: 17,
	status: "PENDING",
	processorId: "Remita",
	metadata: {
		transactionDate: "2025-10-10 00:00:00",
		paymentDate: null,
	},
};

const REMITA_TEST_RECEIPT: RemitaDetails = {
	...REMITA_TEST_INVOICE,
	status: "COMPLETED",
	metadata: {
		transactionDate: REMITA_TEST_INVOICE.metadata.transactionDate,
		paymentDate: new Date().toISOString(),
	},
};

export const fetchInvoice = async (rrr: string): Promise<RemitaDetails> => {
	try {
		const urlPath = `${config.remita.baseUrl}/api/v1/biller/lookup/${rrr}`;

		const response = await fetch(urlPath, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				secretKey: config.remita.apiKey,
			},
		});

		const data = await response.json();

		return data;
	} catch (error: any) {
		console.error("Something went wrong!", error);
	} finally {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return REMITA_TEST_INVOICE;
	}
};

export const fetchReceipt = async (rrr: string): Promise<RemitaDetails> => {
	try {
		const urlPath = `${config.remita.baseUrl}/api/v1/biller/lookup/${rrr}`;
		const response = await fetch(urlPath, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				secretKey: config.remita.apiKey,
			},
		});
		const data = await response.json();
		return data;
	} catch (error: any) {
		console.error("Something went wrong!", error);
	} finally {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return REMITA_TEST_RECEIPT;
	}
};
