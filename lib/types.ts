export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  value: number;
  amount: number;
  status: string;
  customerId?: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  dealId?: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: string;
  notes?: string;
  termsConditions?: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  deal?: Deal;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt: Date;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  status: string;
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
  processedBy?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  bankName?: string;
  accountLast4?: string;
  isStopped: boolean;
  stoppedAt?: Date;
  stoppedBy?: string;
  stopReason?: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  invoice?: Invoice;
  refunds?: Refund[];
}

export interface Refund {
  id: string;
  refundNumber: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  refundMethod: string;
  status: string;
  requestedBy?: string;
  approvedBy?: string;
  processedBy?: string;
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  payment?: Payment;
  invoice?: Invoice;
}