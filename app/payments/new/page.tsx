'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const paymentSchema = z.object({
    invoiceId: z.string().min(1, 'Invoice is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'Cash', 'PayPal', 'Stripe']),
    paymentDate: z.string().min(1, 'Payment date is required'),
    status: z.enum(['Pending', 'Completed', 'Failed', 'Cancelled']),
    transactionId: z.string().optional(),
    referenceNumber: z.string().optional(),
    notes: z.string().optional(),
    processedBy: z.string().min(1, 'Processor name is required'),
    
    // Card details
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    cardExpiry: z.string().optional(),
    
    // Bank details
    bankName: z.string().optional(),
    accountLast4: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const NewPayment = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedInvoiceId = searchParams.get('invoiceId');
    
    const [invoices, setInvoices] = useState<any[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            status: 'Completed',
            paymentMethod: 'Credit Card',
            paymentDate: new Date().toISOString().split('T')[0],
            invoiceId: preselectedInvoiceId || '',
        },
    });

    const watchPaymentMethod = watch('paymentMethod');
    const watchInvoiceId = watch('invoiceId');

    useEffect(() => {
        const fetchInvoices = async () => {
            const response = await fetch('/api/invoices');
            const data = await response.json();
            // Only show unpaid or partially paid invoices
            const unpaidInvoices = data.filter((inv: any) => inv.amountDue > 0);
            setInvoices(unpaidInvoices);
            
            if (preselectedInvoiceId) {
                const invoice = data.find((inv: any) => inv.id === preselectedInvoiceId);
                if (invoice) {
                    setSelectedInvoice(invoice);
                    setValue('amount', invoice.amountDue);
                }
            }
        };
        fetchInvoices();
    }, [preselectedInvoiceId, setValue]);

    useEffect(() => {
        if (watchInvoiceId) {
            const invoice = invoices.find((inv) => inv.id === watchInvoiceId);
            setSelectedInvoice(invoice);
            if (invoice) {
                setValue('amount', invoice.amountDue);
            }
        }
    }, [watchInvoiceId, invoices, setValue]);

    const onSubmit = async (data: PaymentFormData) => {
        setLoading(true);
        try {
            const paymentNumber = `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

            const paymentData = {
                paymentNumber,
                invoiceId: data.invoiceId,
                customerId: selectedInvoice.customerId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                paymentDate: new Date(data.paymentDate),
                status: data.status,
                transactionId: data.transactionId || null,
                referenceNumber: data.referenceNumber || null,
                notes: data.notes || null,
                processedBy: data.processedBy,
                cardLast4: data.cardLast4 || null,
                cardBrand: data.cardBrand || null,
                cardExpiry: data.cardExpiry || null,
                bankName: data.bankName || null,
                accountLast4: data.accountLast4 || null,
                isStopped: false,
            };

            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                const payment = await response.json();
                
                // Update invoice amounts
                if (data.status === 'Completed') {
                    const newAmountPaid = selectedInvoice.amountPaid + data.amount;
                    const newAmountDue = selectedInvoice.totalAmount - newAmountPaid;
                    const newStatus = newAmountDue <= 0 ? 'Paid' : selectedInvoice.status;
                    
                    await fetch(`/api/invoices/${data.invoiceId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amountPaid: newAmountPaid,
                            amountDue: newAmountDue,
                            status: newStatus,
                        }),
                    });
                }
                
                router.push(`/payments/${payment.id}`);
            } else {
                alert('Failed to create payment');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <button className="secondary" onClick={() => router.back()}>
                    ← Back
                </button>
            </div>

            <h1 style={{ marginBottom: '2rem' }}>Record New Payment</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Payment Information */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Payment Information</h2>
                    
                    <div className="form-grid">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="invoiceId">
                                Invoice <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select id="invoiceId" {...register('invoiceId')} className="form-input">
                                <option value="">Select an invoice</option>
                                {invoices.map((invoice) => (
                                    <option key={invoice.id} value={invoice.id}>
                                        {invoice.invoiceNumber} - {invoice.customer?.name} - Due: ${invoice.amountDue.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            {errors.invoiceId && (
                                <span className="error-message">{errors.invoiceId.message}</span>
                            )}
                        </div>

                        {selectedInvoice && (
                            <div style={{ gridColumn: 'span 2', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Invoice Details</h4>
                                <div style={{ fontSize: '0.875rem' }}>
                                    <div><strong>Customer:</strong> {selectedInvoice.customer?.name}</div>
                                    <div><strong>Total Amount:</strong> ${selectedInvoice.totalAmount.toLocaleString()}</div>
                                    <div><strong>Amount Paid:</strong> ${selectedInvoice.amountPaid.toLocaleString()}</div>
                                    <div style={{ color: '#dc2626', fontWeight: 'bold' }}>
                                        <strong>Amount Due:</strong> ${selectedInvoice.amountDue.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="amount">
                                Payment Amount <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                id="amount"
                                step="0.01"
                                {...register('amount', { valueAsNumber: true })}
                                className="form-input"
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <span className="error-message">{errors.amount.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="paymentDate">
                                Payment Date <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="paymentDate"
                                {...register('paymentDate')}
                                className="form-input"
                            />
                            {errors.paymentDate && (
                                <span className="error-message">{errors.paymentDate.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="paymentMethod">
                                Payment Method <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select id="paymentMethod" {...register('paymentMethod')} className="form-input">
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Check">Check</option>
                                <option value="Cash">Cash</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Stripe">Stripe</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">
                                Status <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select id="status" {...register('status')} className="form-input">
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="processedBy">
                                Processed By <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="processedBy"
                                {...register('processedBy')}
                                className="form-input"
                                placeholder="Your name"
                            />
                            {errors.processedBy && (
                                <span className="error-message">{errors.processedBy.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="transactionId">Transaction ID</label>
                            <input
                                type="text"
                                id="transactionId"
                                {...register('transactionId')}
                                className="form-input"
                                placeholder="External transaction ID"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="referenceNumber">Reference Number</label>
                            <input
                                type="text"
                                id="referenceNumber"
                                {...register('referenceNumber')}
                                className="form-input"
                                placeholder="Check number, wire reference, etc."
                            />
                        </div>
                    </div>
                </div>

                {/* Card Details (conditional) */}
                {(watchPaymentMethod === 'Credit Card' || watchPaymentMethod === 'Debit Card') && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Card Details</h2>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="cardBrand">Card Brand</label>
                                <select id="cardBrand" {...register('cardBrand')} className="form-input">
                                    <option value="">Select brand</option>
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="American Express">American Express</option>
                                    <option value="Discover">Discover</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardLast4">Last 4 Digits</label>
                                <input
                                    type="text"
                                    id="cardLast4"
                                    {...register('cardLast4')}
                                    className="form-input"
                                    placeholder="1234"
                                    maxLength={4}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardExpiry">Expiry Date</label>
                                <input
                                    type="text"
                                    id="cardExpiry"
                                    {...register('cardExpiry')}
                                    className="form-input"
                                    placeholder="MM/YY"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Bank Details (conditional) */}
                {watchPaymentMethod === 'Bank Transfer' && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Bank Transfer Details</h2>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="bankName">Bank Name</label>
                                <input
                                    type="text"
                                    id="bankName"
                                    {...register('bankName')}
                                    className="form-input"
                                    placeholder="Bank name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="accountLast4">Account Last 4 Digits</label>
                                <input
                                    type="text"
                                    id="accountLast4"
                                    {...register('accountLast4')}
                                    className="form-input"
                                    placeholder="5678"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Additional Notes</h2>
                    
                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            {...register('notes')}
                            className="form-input"
                            rows={4}
                            placeholder="Any additional notes about this payment..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Recording...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPayment;