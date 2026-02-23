'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const PaymentDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showStopModal, setShowStopModal] = useState(false);
    const [stopReason, setStopReason] = useState('');
    const [stoppedBy, setStoppedBy] = useState('');

    useEffect(() => {
        if (id) {
            fetchPayment();
        }
    }, [id]);

    const fetchPayment = async () => {
        const response = await fetch(`/api/payments/${id}`);
        const data = await response.json();
        setPayment(data);
        setLoading(false);
    };

    const handleStopPayment = async () => {
        if (!stopReason || !stoppedBy) {
            alert('Please provide reason and your name');
            return;
        }

        const response = await fetch(`/api/payments/${id}/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: stopReason, stoppedBy })
        });

        if (response.ok) {
            setShowStopModal(false);
            fetchPayment();
        }
    };

    if (loading) {
        return <div className="loading">Loading payment...</div>;
    }

    if (!payment) {
        return <div className="error">Payment not found</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'Pending': return '#f59e0b';
            case 'Failed': return '#ef4444';
            case 'Stopped': return '#dc2626';
            default: return '#6b7280';
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <button className="secondary" onClick={() => router.back()}>
                    ← Back to Payments
                </button>
            </div>

            {/* Payment Header */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{payment.paymentNumber}</h1>
                        <span 
                            style={{ 
                                background: getStatusColor(payment.status),
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}
                        >
                            {payment.status}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                            ${payment.amount.toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                            {new Date(payment.paymentDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {payment.isStopped && (
                    <div style={{ 
                        background: '#fee2e2', 
                        border: '1px solid #dc2626', 
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            ⚠️ Payment Stopped
                        </div>
                        <div><strong>Stopped By:</strong> {payment.stoppedBy}</div>
                        <div><strong>Date:</strong> {new Date(payment.stoppedAt).toLocaleString()}</div>
                        <div><strong>Reason:</strong> {payment.stopReason}</div>
                    </div>
                )}

                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Customer Information</h3>
                        <div><strong>Name:</strong> {payment.customer.name}</div>
                        <div><strong>Email:</strong> {payment.customer.email}</div>
                        <div><strong>Phone:</strong> {payment.customer.phone}</div>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Payment Details</h3>
                        <div><strong>Method:</strong> {payment.paymentMethod}</div>
                        {payment.transactionId && (
                            <div><strong>Transaction ID:</strong> {payment.transactionId}</div>
                        )}
                        {payment.referenceNumber && (
                            <div><strong>Reference:</strong> {payment.referenceNumber}</div>
                        )}
                        {payment.processedBy && (
                            <div><strong>Processed By:</strong> {payment.processedBy}</div>
                        )}
                    </div>
                </div>

                {/* Card Details */}
                {payment.cardBrand && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Card Information</h4>
                        <div><strong>Brand:</strong> {payment.cardBrand}</div>
                        <div><strong>Last 4 Digits:</strong> •••• {payment.cardLast4}</div>
                        {payment.cardExpiry && (
                            <div><strong>Expiry:</strong> {payment.cardExpiry}</div>
                        )}
                    </div>
                )}

                {/* Bank Details */}
                {payment.bankName && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Bank Information</h4>
                        <div><strong>Bank:</strong> {payment.bankName}</div>
                        <div><strong>Account:</strong> •••• {payment.accountLast4}</div>
                    </div>
                )}
            </div>

            {/* Invoice Information */}
            {payment.invoice && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Related Invoice</h2>
                    <Link href={`/invoices/${payment.invoice.id}`} className="card" style={{ display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>{payment.invoice.invoiceNumber}</strong>
                            <span>${payment.invoice.totalAmount.toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Status: {payment.invoice.status}
                        </div>
                        {payment.invoice.items && payment.invoice.items.length > 0 && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                <strong>Items:</strong>
                                {payment.invoice.items.map((item: any) => (
                                    <div key={item.id} style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        • {item.description} ({item.quantity} × ${item.unitPrice})
                                    </div>
                                ))}
                            </div>
                        )}
                    </Link>
                </div>
            )}

            {/* Refunds */}
            {payment.refunds && payment.refunds.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Refunds</h2>
                    <div className="grid">
                        {payment.refunds.map((refund: any) => (
                            <Link href={`/refunds/${refund.id}`} key={refund.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{refund.refundNumber}</strong>
                                    <span style={{ 
                                        color: refund.status === 'Completed' ? '#10b981' : '#f59e0b'
                                    }}>
                                        {refund.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>
                                    -${refund.amount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                    {refund.reason}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment History */}
            {payment.paymentHistory && payment.paymentHistory.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Payment History</h2>
                    <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '1rem' }}>
                        {payment.paymentHistory.map((history: any, index: number) => (
                            <div key={history.id} style={{ 
                                marginBottom: index < payment.paymentHistory.length - 1 ? '1.5rem' : '0',
                                paddingBottom: index < payment.paymentHistory.length - 1 ? '1.5rem' : '0',
                                borderBottom: index < payment.paymentHistory.length - 1 ? '1px solid #f3f4f6' : 'none'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                                            {history.action}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {history.description}
                                        </div>
                                        {history.performedBy && (
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                                By: {history.performedBy}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                        {new Date(history.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            {payment.notes && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Notes</h3>
                    <p>{payment.notes}</p>
                </div>
            )}

            {/* Actions */}
            {payment.status !== 'Stopped' && payment.status !== 'Cancelled' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {payment.status === 'Completed' && (
                            <Link href={`/refunds/new?paymentId=${payment.id}`}>
                                <button>Request Refund</button>
                            </Link>
                        )}
                        {(payment.status === 'Pending' || payment.status === 'Completed') && !payment.isStopped && (
                            <button className="danger" onClick={() => setShowStopModal(true)}>
                                Stop Payment
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Stop Payment Modal */}
            {showStopModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Stop Payment</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                            Are you sure you want to stop this payment? This action cannot be undone.
                        </p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Your Name:
                            </label>
                            <input
                                type="text"
                                value={stoppedBy}
                                onChange={(e) => setStoppedBy(e.target.value)}
                                placeholder="Enter your name"
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #d1d5db'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Reason:
                            </label>
                            <textarea
                                value={stopReason}
                                onChange={(e) => setStopReason(e.target.value)}
                                placeholder="Explain why this payment needs to be stopped..."
                                rows={4}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #d1d5db'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="secondary" onClick={() => setShowStopModal(false)}>
                                Cancel
                            </button>
                            <button className="danger" onClick={handleStopPayment}>
                                Stop Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentDetail;