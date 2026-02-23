'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const InvoiceDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchInvoice = async () => {
                const response = await fetch(`/api/invoices/${id}`);
                const data = await response.json();
                setInvoice(data);
                setLoading(false);
            };

            fetchInvoice();
        }
    }, [id]);

    if (loading) {
        return <div className="loading">Loading invoice...</div>;
    }

    if (!invoice) {
        return <div className="error">Invoice not found</div>;
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <button className="secondary" onClick={() => router.back()}>
                    ← Back to Invoices
                </button>
            </div>

            {/* Invoice Header */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{invoice.invoiceNumber}</h1>
                        <span 
                            style={{ 
                                background: invoice.status === 'Paid' ? '#10b981' : '#f59e0b',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}
                        >
                            {invoice.status}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                            ${invoice.totalAmount.toLocaleString()}
                        </div>
                        {invoice.amountDue > 0 && (
                            <div style={{ color: '#ef4444', fontSize: '1.125rem', marginTop: '0.5rem' }}>
                                Due: ${invoice.amountDue.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Bill To:</h3>
                        <div><strong>{invoice.customer.name}</strong></div>
                        <div>{invoice.customer.email}</div>
                        <div>{invoice.customer.phone}</div>
                        <div>{invoice.customer.address}</div>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Invoice Details:</h3>
                        <div><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</div>
                        <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
                        {invoice.deal && (
                            <div><strong>Deal:</strong> <Link href={`/deals/${invoice.deal.id}`}>{invoice.deal.title}</Link></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Invoice Items */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Items</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '1rem' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '1rem' }}>Quantity</th>
                            <th style={{ textAlign: 'right', padding: '1rem' }}>Unit Price</th>
                            <th style={{ textAlign: 'right', padding: '1rem' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: any) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '1rem' }}>{item.description}</td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}>${item.unitPrice.toLocaleString()}</td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}><strong>${item.amount.toLocaleString()}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Subtotal:</strong></td>
                            <td style={{ textAlign: 'right', padding: '1rem' }}>${invoice.subtotal.toLocaleString()}</td>
                        </tr>
                        {invoice.taxAmount > 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Tax ({(invoice.taxRate * 100).toFixed(0)}%):</strong></td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}>${invoice.taxAmount.toLocaleString()}</td>
                            </tr>
                        )}
                        {invoice.discountAmount > 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Discount:</strong></td>
                                <td style={{ textAlign: 'right', padding: '1rem', color: '#10b981' }}>-${invoice.discountAmount.toLocaleString()}</td>
                            </tr>
                        )}
                        <tr style={{ borderTop: '2px solid #e5e7eb', fontSize: '1.25rem' }}>
                            <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Total:</strong></td>
                            <td style={{ textAlign: 'right', padding: '1rem' }}><strong>${invoice.totalAmount.toLocaleString()}</strong></td>
                        </tr>
                        {invoice.amountPaid > 0 && (
                            <tr style={{ color: '#10b981' }}>
                                <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Amount Paid:</strong></td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}><strong>${invoice.amountPaid.toLocaleString()}</strong></td>
                            </tr>
                        )}
                        {invoice.amountDue > 0 && (
                            <tr style={{ color: '#ef4444', fontSize: '1.25rem' }}>
                                <td colSpan={3} style={{ textAlign: 'right', padding: '1rem' }}><strong>Amount Due:</strong></td>
                                <td style={{ textAlign: 'right', padding: '1rem' }}><strong>${invoice.amountDue.toLocaleString()}</strong></td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>

            {/* Payments */}
            {invoice.payments && invoice.payments.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Payments</h2>
                    <div className="grid">
                        {invoice.payments.map((payment: any) => (
                            <Link href={`/payments/${payment.id}`} key={payment.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{payment.paymentNumber}</strong>
                                    <span style={{ color: payment.status === 'Completed' ? '#10b981' : '#6b7280' }}>
                                        {payment.status}
                                    </span>
                                </div>
                                <div>${payment.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    {payment.paymentMethod} • {new Date(payment.paymentDate).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {invoice.notes && (
                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem' }}>Notes</h3>
                    <p>{invoice.notes}</p>
                </div>
            )}
        </div>
    );
};

export default InvoiceDetail;