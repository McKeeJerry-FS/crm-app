'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Payment } from '@/lib/types';

const Payments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchPayments = async () => {
            const response = await fetch('/api/payments');
            const data = await response.json();
            setPayments(data);
            setLoading(false);
        };

        fetchPayments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'Pending': return '#f59e0b';
            case 'Failed': return '#ef4444';
            case 'Stopped': return '#dc2626';
            case 'Cancelled': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'Credit Card': return '💳';
            case 'Debit Card': return '💳';
            case 'Bank Transfer': return '🏦';
            case 'Check': return '📝';
            case 'Cash': return '💵';
            case 'PayPal': return '🅿️';
            default: return '💰';
        }
    };

    const filteredPayments = filter === 'all' 
        ? payments 
        : payments.filter(payment => payment.status === filter);

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return <div className="loading">Loading payments...</div>;
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>💳 Payments</h1>
                <Link href="/payments/new">
                    <button>+ Record Payment</button>
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card stat-primary">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Payments</div>
                        <div className="stat-value">${totalAmount.toLocaleString()}</div>
                        <div className="stat-description">{payments.length} transactions</div>
                    </div>
                </div>

                <div className="stat-card stat-success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">${completedAmount.toLocaleString()}</div>
                        <div className="stat-description">{payments.filter(p => p.status === 'Completed').length} payments</div>
                    </div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{payments.filter(p => p.status === 'Pending').length}</div>
                        <div className="stat-description">Awaiting processing</div>
                    </div>
                </div>

                <div className="stat-card stat-danger">
                    <div className="stat-icon">🛑</div>
                    <div className="stat-content">
                        <div className="stat-label">Stopped/Failed</div>
                        <div className="stat-value">{payments.filter(p => p.status === 'Stopped' || p.status === 'Failed').length}</div>
                        <div className="stat-description">Requires attention</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                    className={filter === 'all' ? '' : 'secondary'}
                    onClick={() => setFilter('all')}
                >
                    All ({payments.length})
                </button>
                <button 
                    className={filter === 'Completed' ? '' : 'secondary'}
                    onClick={() => setFilter('Completed')}
                >
                    Completed ({payments.filter(p => p.status === 'Completed').length})
                </button>
                <button 
                    className={filter === 'Pending' ? '' : 'secondary'}
                    onClick={() => setFilter('Pending')}
                >
                    Pending ({payments.filter(p => p.status === 'Pending').length})
                </button>
                <button 
                    className={filter === 'Stopped' ? '' : 'secondary'}
                    onClick={() => setFilter('Stopped')}
                >
                    Stopped ({payments.filter(p => p.status === 'Stopped').length})
                </button>
                <button 
                    className={filter === 'Failed' ? '' : 'secondary'}
                    onClick={() => setFilter('Failed')}
                >
                    Failed ({payments.filter(p => p.status === 'Failed').length})
                </button>
            </div>

            {/* Payments Grid */}
            <div className="grid">
                {filteredPayments.map((payment) => (
                    <Link href={`/payments/${payment.id}`} key={payment.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{payment.paymentNumber}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    {payment.customer?.name}
                                </p>
                            </div>
                            <span 
                                style={{ 
                                    background: getStatusColor(payment.status),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                {payment.status}
                            </span>
                        </div>
                        
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                            ${payment.amount.toLocaleString()}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span>{getMethodIcon(payment.paymentMethod)}</span>
                            <span>{payment.paymentMethod}</span>
                            {payment.cardBrand && payment.cardLast4 && (
                                <span style={{ color: '#6b7280' }}>
                                    {payment.cardBrand} •••• {payment.cardLast4}
                                </span>
                            )}
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            <div>Date: {new Date(payment.paymentDate).toLocaleDateString()}</div>
                            {payment.invoice && (
                                <div>Invoice: {payment.invoice.invoiceNumber}</div>
                            )}
                            {payment.isStopped && (
                                <div style={{ color: '#dc2626', marginTop: '0.5rem' }}>
                                    ⚠️ Payment Stopped
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {filteredPayments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No payments found
                </div>
            )}
        </div>
    );
};

export default Payments;