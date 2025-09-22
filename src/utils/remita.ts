import { InvoiceDetails, Receipt } from '../types';

// Dummy data for development
const DUMMY_INVOICE: InvoiceDetails = {
  rrr: '123456789012',
  amount: 25000,
  description: 'University Tuition Fee Payment - Computer Science Department',
  payerName: 'John Doe',
  payerEmail: 'john.doe@email.com',
  merchantId: 'DEMO001',
  serviceTypeId: 'EDU001',
  orderId: 'ORD-2024-001',
  status: 'PENDING',
  currency: 'NGN',
  dueDate: '2024-03-15',
};

const DUMMY_RECEIPT: Receipt = {
  rrr: '123456789012',
  transactionId: 'TXN-2024-001234',
  amount: 25000,
  currency: 'NGN',
  paymentDate: new Date().toISOString(),
  status: 'COMPLETED',
  payerName: 'John Doe',
  description: 'University Tuition Fee Payment - Computer Science Department',
  merchantReference: 'REF-2024-001',
};

export const fetchInvoiceDetails = async (rrr: string): Promise<InvoiceDetails> => {
  // TODO: Implement actual Remita API call
  // const response = await fetch(`${config.remita.baseUrl}/rrr/${rrr}/details`, {
  //   headers: {
  //     'Authorization': `Bearer ${config.remita.apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return dummy data with the provided RRR
  return { ...DUMMY_INVOICE, rrr };
};

export const notifyPaymentComplete = async (
  rrr: string, 
  transactionSignature: string,
  amount: number
): Promise<boolean> => {
  // TODO: Implement actual Remita payment notification
  // const response = await fetch(`${config.remita.baseUrl}/payment/notify`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${config.remita.apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     rrr,
  //     transactionReference: transactionSignature,
  //     amount,
  //     paymentMethod: 'SOLANA_USDC',
  //   }),
  // });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

export const fetchReceipt = async (rrr: string): Promise<Receipt> => {
  // TODO: Implement actual Remita receipt fetch
  // const response = await fetch(`${config.remita.baseUrl}/rrr/${rrr}/receipt`, {
  //   headers: {
  //     'Authorization': `Bearer ${config.remita.apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { ...DUMMY_RECEIPT, rrr };
};