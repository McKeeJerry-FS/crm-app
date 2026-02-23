'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/lib/types';

const Invoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchInvoices = async () => {
            const response = await fetch('/api/invoices');
            const data = await response.json();
            setInvoices(data);
            setLoading(false);
        };

        fetchInvoices();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return '#10b981';
            case 'Overdue': return '#ef4444';
            case 'Sent': return '#f59e0b';
            case 'Draft': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const filteredInvoices = filter === 'all' 
        ? invoices 
        : invoices.filter(inv => inv.status === filter);

    if (loading) {
        return <div className="loading">Loading invoices...</div>;
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>💰 Invoices</h1>
                <Link href="/invoices/new">
                    <button>+ New Invoice</button>
                </Link>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button 
                    className={filter === 'all' ? '' : 'secondary'}
                    onClick={() => setFilter('all')}
                >
                    All ({invoices.length})
                </button>
                <button 
                    className={filter === 'Paid' ? '' : 'secondary'}
                    onClick={() => setFilter('Paid')}
                >
                    Paid ({invoices.filter(i => i.status === 'Paid').length})
                </button>
                <button 
                    className={filter === 'Sent' ? '' : 'secondary'}
                    onClick={() => setFilter('Sent')}
                >
                    Sent ({invoices.filter(i => i.status === 'Sent').length})
                </button>
                <button 
                    className={filter === 'Overdue' ? '' : 'secondary'}
                    onClick={() => setFilter('Overdue')}
                >
                    Overdue ({invoices.filter(i => i.status === 'Overdue').length})
                </button>
            </div>

            {/* Invoices Grid */}
            <div className="grid">
                {filteredInvoices.map((invoice) => (
                    <Link href={`/invoices/${invoice.id}`} key={invoice.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{invoice.invoiceNumber}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    {invoice.customer?.name}
                                </p>
                            </div>
                            <span 
                                style={{ 
                                    background: getStatusColor(invoice.status),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                {invoice.status}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Total:</strong> ${invoice.totalAmount.toLocaleString()}
                        </div>
                        
                        {invoice.amountPaid > 0 && (
                            <div style={{ marginBottom: '0.5rem', color: '#10b981' }}>
                                <strong>Paid:</strong> ${invoice.amountPaid.toLocaleString()}
                            </div>
                        )}
                        
                        {invoice.amountDue > 0 && (
                            <div style={{ marginBottom: '0.5rem', color: '#ef4444' }}>
                                <strong>Due:</strong> ${invoice.amountDue.toLocaleString()}
                            </div>
                        )}
                        
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            <div>Issue: {new Date(invoice.issueDate).toLocaleDateString()}</div>
                            <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredInvoices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No invoices found
                </div>
            )}
        </div>
    );
};

export default Invoices;