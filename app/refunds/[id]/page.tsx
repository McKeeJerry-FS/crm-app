'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const RefundDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [refund, setRefund] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [approvedBy, setApprovedBy] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (id) {
            fetchRefund();
        }
    }, [id]);

    const fetchRefund = async () => {
        const response = await fetch(`/api/refunds/${id}`);
        const data = await response.json();
        setRefund(data);
        setLoading(false);
    };

    const handleApprove = async () => {
        if (!approvedBy) {
            alert('Please enter your name');
            return;
        }

        const response = await fetch(`/api/refunds/${id}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approvedBy })
        });

        if (response.ok) {
            setShowApproveModal(false);
            fetchRefund();
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            alert('Please provide a rejection reason');
            return;
        }

        const response = await fetch(`/api/refunds/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'Rejected',
                notes: rejectionReason
            })
        });

        if (response.ok) {
            setShowRejectModal(false);
            fetchRefund();
        }
    };

    if (loading) {
        return <div className="loading">Loading refund...</div>;
    }

    if (!refund) {
        return <div className="error">Refund not found</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'Approved': return '#3b82f6';
            case 'Pending': return '#f59e0b';
            case 'Rejected': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <button className="secondary" onClick={() => router.back()}>
                    ← Back to Refunds
                </button>
            </div>

            {/* Refund Header */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{refund.refundNumber}</h1>
                        <span 
                            style={{ 
                                background: getStatusColor(refund.status),
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}
                        >
                            {refund.status}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                            -${refund.amount.toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                            {refund.refundMethod}
                        </div>
                    </div>
                </div>

                {refund.status === 'Pending' && (
                    <div style={{ 
                        background: '#fef3c7', 
                        border: '1px solid #f59e0b', 
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ color: '#92400e', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            ⏳ Pending Approval
                        </div>
                        <div style={{ fontSize: '0.875rem' }}>
                            This refund request is awaiting review and approval from a finance manager.
                        </div>
                    </div>
                )}

                {refund.status === 'Rejected' && (
                    <div style={{ 
                        background: '#fee2e2', 
                        border: '1px solid #dc2626', 
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            ❌ Refund Rejected
                        </div>
                        <div style={{ fontSize: '0.875rem' }}>
                            This refund request has been rejected.
                        </div>
                    </div>
                )}

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Refund Details</h3>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Requested By</div>
                            <div style={{ fontWeight: '500' }}>{refund.requestedBy || 'N/A'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Requested Date</div>
                            <div style={{ fontWeight: '500' }}>{new Date(refund.requestedAt).toLocaleString()}</div>
                        </div>
                        {refund.approvedBy && (
                            <>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved By</div>
                                    <div style={{ fontWeight: '500' }}>{refund.approvedBy}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved Date</div>
                                    <div style={{ fontWeight: '500' }}>{new Date(refund.approvedAt).toLocaleString()}</div>
                                </div>
                            </>
                        )}
                        {refund.processedBy && (
                            <>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Processed By</div>
                                    <div style={{ fontWeight: '500' }}>{refund.processedBy}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Processed Date</div>
                                    <div style={{ fontWeight: '500' }}>{new Date(refund.processedAt).toLocaleString()}</div>
                                </div>
                            </>
                        )}
                        {refund.transactionId && (
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Transaction ID</div>
                                <div style={{ fontWeight: '500', fontFamily: 'monospace' }}>{refund.transactionId}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reason */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Refund Reason</h3>
                <p style={{ color: '#1f2937', lineHeight: '1.6' }}>{refund.reason}</p>
            </div>

            {/* Related Payment */}
            {refund.payment && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Related Payment</h2>
                    <Link href={`/payments/${refund.payment.id}`} className="card" style={{ display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>{refund.payment.paymentNumber}</strong>
                            <span style={{ color: '#10b981' }}>${refund.payment.amount.toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {refund.payment.paymentMethod} • {new Date(refund.payment.paymentDate).toLocaleDateString()}
                        </div>
                        {refund.payment.customer && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                Customer: {refund.payment.customer.name}
                            </div>
                        )}
                    </Link>
                </div>
            )}

            {/* Related Invoice */}
            {refund.invoice && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Related Invoice</h2>
                    <Link href={`/invoices/${refund.invoice.id}`} className="card" style={{ display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>{refund.invoice.invoiceNumber}</strong>
                            <span>${refund.invoice.totalAmount.toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Status: {refund.invoice.status}
                        </div>
                        {refund.invoice.items && refund.invoice.items.length > 0 && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                <strong>Items:</strong>
                                {refund.invoice.items.slice(0, 3).map((item: any) => (
                                    <div key={item.id} style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        • {item.description}
                                    </div>
                                ))}
                                {refund.invoice.items.length > 3 && (
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        ... and {refund.invoice.items.length - 3} more
                                    </div>
                                )}
                            </div>
                        )}
                    </Link>
                </div>
            )}

            {/* Notes */}
            {refund.notes && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Additional Notes</h3>
                    <p style={{ color: '#6b7280' }}>{refund.notes}</p>
                </div>
            )}

            {/* Actions */}
            {refund.status === 'Pending' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setShowApproveModal(true)}>
                            ✅ Approve Refund
                        </button>
                        <button className="danger" onClick={() => setShowRejectModal(true)}>
                            ❌ Reject Refund
                        </button>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && (
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
                        <h2 style={{ marginBottom: '1rem' }}>Approve Refund</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                            You are approving a refund of <strong>${refund.amount.toLocaleString()}</strong>.
                        </p>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Your Name:
                            </label>
                            <input
                                type="text"
                                value={approvedBy}
                                onChange={(e) => setApprovedBy(e.target.value)}
                                placeholder="Enter your name"
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #d1d5db'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="secondary" onClick={() => setShowApproveModal(false)}>
                                Cancel
                            </button>
                            <button onClick={handleApprove}>
                                Approve Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
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
                        <h2 style={{ marginBottom: '1rem' }}>Reject Refund</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                            Please provide a reason for rejecting this refund request.
                        </p>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Rejection Reason:
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why this refund is being rejected..."
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
                            <button className="secondary" onClick={() => setShowRejectModal(false)}>
                                Cancel
                            </button>
                            <button className="danger" onClick={handleReject}>
                                Reject Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundDetail;