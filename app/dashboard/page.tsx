'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
    totalCustomers: number;
    totalContacts: number;
    totalDeals: number;
    totalRevenue: number;
    wonDeals: number;
    openDeals: number;
    inProgressDeals: number;
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        totalContacts: 0,
        totalDeals: 0,
        totalRevenue: 0,
        wonDeals: 0,
        openDeals: 0,
        inProgressDeals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [customersRes, contactsRes, dealsRes] = await Promise.all([
                    fetch('/api/customers'),
                    fetch('/api/contacts'),
                    fetch('/api/deals')
                ]);

                const customers = await customersRes.json();
                const contacts = await contactsRes.json();
                const deals = await dealsRes.json();

                const wonDeals = deals.filter((d: any) => d.status === 'Won');
                const openDeals = deals.filter((d: any) => d.status === 'Open');
                const inProgressDeals = deals.filter((d: any) => d.status === 'In Progress');
                const totalRevenue = wonDeals.reduce((sum: number, deal: any) => sum + deal.value, 0);

                setStats({
                    totalCustomers: customers.length,
                    totalContacts: contacts.length,
                    totalDeals: deals.length,
                    totalRevenue,
                    wonDeals: wonDeals.length,
                    openDeals: openDeals.length,
                    inProgressDeals: inProgressDeals.length
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card stat-primary">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-description">From {stats.wonDeals} won deals</div>
                    </div>
                </div>

                <div className="stat-card stat-success">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Customers</div>
                        <div className="stat-value">{stats.totalCustomers}</div>
                        <div className="stat-description">Active customers</div>
                    </div>
                </div>

                <div className="stat-card stat-info">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Contacts</div>
                        <div className="stat-value">{stats.totalContacts}</div>
                        <div className="stat-description">Business contacts</div>
                    </div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-icon">💼</div>
                    <div className="stat-content">
                        <div className="stat-label">Total Deals</div>
                        <div className="stat-value">{stats.totalDeals}</div>
                        <div className="stat-description">In pipeline</div>
                    </div>
                </div>
            </div>

            {/* Deals Pipeline */}
            <div className="pipeline-section">
                <h2>Deals Pipeline</h2>
                <div className="pipeline-grid">
                    <div className="pipeline-card pipeline-open">
                        <div className="pipeline-header">
                            <h3>Open</h3>
                            <span className="pipeline-count">{stats.openDeals}</span>
                        </div>
                        <div className="pipeline-bar">
                            <div 
                                className="pipeline-fill pipeline-fill-open" 
                                style={{ width: `${(stats.openDeals / stats.totalDeals) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="pipeline-card pipeline-progress">
                        <div className="pipeline-header">
                            <h3>In Progress</h3>
                            <span className="pipeline-count">{stats.inProgressDeals}</span>
                        </div>
                        <div className="pipeline-bar">
                            <div 
                                className="pipeline-fill pipeline-fill-progress" 
                                style={{ width: `${(stats.inProgressDeals / stats.totalDeals) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="pipeline-card pipeline-won">
                        <div className="pipeline-header">
                            <h3>Won</h3>
                            <span className="pipeline-count">{stats.wonDeals}</span>
                        </div>
                        <div className="pipeline-bar">
                            <div 
                                className="pipeline-fill pipeline-fill-won" 
                                style={{ width: `${(stats.wonDeals / stats.totalDeals) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    <Link href="/customers/new" className="action-card">
                        <div className="action-icon">➕</div>
                        <h3>Add Customer</h3>
                        <p>Create a new customer record</p>
                    </Link>

                    <Link href="/contacts/new" className="action-card">
                        <div className="action-icon">👤</div>
                        <h3>Add Contact</h3>
                        <p>Add a new business contact</p>
                    </Link>

                    <Link href="/deals/new" className="action-card">
                        <div className="action-icon">💵</div>
                        <h3>Create Deal</h3>
                        <p>Start a new deal opportunity</p>
                    </Link>

                    <Link href="/customers" className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>View Reports</h3>
                        <p>See all customers and data</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;