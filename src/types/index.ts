export interface RemitaDetails {
	billerId: string;
	billerName: string;
	productName: string;
	categoryId: string;
	categoryName: string;
	name: string;
	phoneNumber: string;
	email: string;
	paymentIdentifier: string;
	amount: number;
	fee: number;
	rrrAmount: number;
	rrr: string;
	currency: string;
	description: string;
	vtu: boolean;
	rrrType: string;
	commission: number;
	status: string;
	processorId: string;
	metadata: {
		transactionDate: string;
		paymentDate: any;
	};
}

export interface PaymentReference {
	key: string;
	memo: string;
	rate: number;
	signature?: string;
}

export interface PaymentVerification {
	verified: boolean;
	transactionSignature?: string;
	amount?: number;
	timestamp?: number;
}

export type PaymentStep =
	| "input"
	| "loading"
	| "review"
	| "payment"
	| "processing"
	| "success"
	| "error";
