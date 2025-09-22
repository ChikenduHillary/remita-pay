export interface InvoiceDetails {
  rrr: string;
  amount: number;
  description: string;
  payerName: string;
  payerEmail: string;
  merchantId: string;
  serviceTypeId: string;
  orderId: string;
  status: string;
  currency: string;
  dueDate?: string;
}

export interface PaymentReference {
  publicKey: string;
  signature?: string;
}

export interface PaymentVerification {
  verified: boolean;
  transactionSignature?: string;
  amount?: number;
  timestamp?: number;
}

export interface Receipt {
  rrr: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  status: string;
  payerName: string;
  description: string;
  merchantReference?: string;
}

export type PaymentStep = 'input' | 'loading' | 'review' | 'payment' | 'processing' | 'success' | 'error';