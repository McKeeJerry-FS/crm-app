'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Refund } from '@/lib/types';

const Refunds = () => {
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchRefunds = async () => {
            const response = await fetch('/api/refunds');
            const data = await response.json();
            setRefunds(data);
            setLoading(false);
        };

        fetchRefunds();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'Approved': return '#3b82f6';
            case 'Pending': return '#f59e0b';
            case 'Rejected': return '#ef4444';
            case 'Failed': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const filteredRefunds = filter === 'all' 
        ? refunds 
        : refunds.filter(refund => refund.status === filter);

    const totalRefunded = refunds.filter(r => r.status === 'Completed').reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = refunds.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

    if (loading) {
        return <div className="loading">Loading refunds...</div>;
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>🔄 Refunds</h1>
                <Link href="/refunds/new">
                    <button>+ New Refund Request</button>
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card stat-success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Refunded</div>
                        <div className="stat-value">${totalRefunded.toLocaleString()}</div>
                        <div className="stat-description">{refunds.filter(r => r.status === 'Completed').length} completed</div>
                    </div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-label">Pending Review</div>
                        <div className="stat-value">${pendingAmount.toLocaleString()}</div>
                        <div className="stat-description">{refunds.filter(r => r.status === 'Pending').length} requests</div>
                    </div>
                </div>

                <div className="stat-card stat-info">
                    <div className="stat-icon">👍</div>
                    <div className="stat-content">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{refunds.filter(r => r.status === 'Approved').length}</div>
                        <div className="stat-description">Awaiting processing</div>
                    </div>
                </div>

                <div className="stat-card stat-danger">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{refunds.filter(r => r.status === 'Rejected').length}</div>
                        <div className="stat-description">Declined requests</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                    className={filter === 'all' ? '' : 'secondary'}
                    onClick={() => setFilter('all')}
                >
                    All ({refunds.length})
                </button>
                <button 
                    className={filter === 'Pending' ? '' : 'secondary'}
                    onClick={() => setFilter('Pending')}
                >
                    Pending ({refunds.filter(r => r.status === 'Pending').length})
                </button>
                <button 
                    className={filter === 'Approved' ? '' : 'secondary'}
                    onClick={() => setFilter('Approved')}
                >
                    Approved ({refunds.filter(r => r.status === 'Approved').length})
                </button>
                <button 
                    className={filter === 'Completed' ? '' : 'secondary'}
                    onClick={() => setFilter('Completed')}
                >
                    Completed ({refunds.filter(r => r.status === 'Completed').length})
                </button>
                <button 
                    className={filter === 'Rejected' ? '' : 'secondary'}
                    onClick={() => setFilter('Rejected')}
                >
                    Rejected ({refunds.filter(r => r.status === 'Rejected').length})
                </button>
            </div>

            {/* Refunds Grid */}
            <div className="grid">
                {filteredRefunds.map((refund) => (
                    <Link href={`/refunds/${refund.id}`} key={refund.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{refund.refundNumber}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    Payment: {refund.payment?.paymentNumber}
                                </p>
                            </div>
                            <span 
                                style={{ 
                                    background: getStatusColor(refund.status),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                {refund.status}
                            </span>
                        </div>
                        
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#dc2626' }}>
                            -${refund.amount.toLocaleString()}
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            <strong>Reason:</strong> {refund.reason.substring(0, 60)}{refund.reason.length > 60 ? '...' : ''}
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            <strong>Method:</strong> {refund.refundMethod}
                        </div>
                        
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Requested: {new Date(refund.requestedAt).toLocaleDateString()}
                            {refund.requestedBy && ` by ${refund.requestedBy}`}
                        </div>
                        
                        {refund.status === 'Pending' && (
                            <div style={{ 
                                marginTop: '1rem', 
                                padding: '0.5rem', 
                                background: '#fef3c7', 
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                color: '#92400e',
                                fontWeight: '600'
                            }}>
                                ⚠️ Awaiting Approval
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {filteredRefunds.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No refunds found
                </div>
            )}
        </div>
    );
};

export default Refunds;