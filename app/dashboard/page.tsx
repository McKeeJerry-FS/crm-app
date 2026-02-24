"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface DashboardStats {
  totalCustomers: number;
  totalContacts: number;
  totalDeals: number;
  totalRevenue: number;
  wonDeals: number;
  openDeals: number;
  inProgressDeals: number;
  totalInvoices: number;
  totalPayments: number;
  totalRefunds: number;
  paidInvoices: number;
  unpaidInvoices: number;
  completedPayments: number;
  stoppedPayments: number;
  pendingRefunds: number;
  approvedRefunds: number;
  completedRefunds: number;
  totalInvoiceAmount: number;
  totalPaidAmount: number;
  totalRefundAmount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalContacts: 0,
    totalDeals: 0,
    totalRevenue: 0,
    wonDeals: 0,
    openDeals: 0,
    inProgressDeals: 0,
    totalInvoices: 0,
    totalPayments: 0,
    totalRefunds: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    completedPayments: 0,
    stoppedPayments: 0,
    pendingRefunds: 0,
    approvedRefunds: 0,
    completedRefunds: 0,
    totalInvoiceAmount: 0,
    totalPaidAmount: 0,
    totalRefundAmount: 0,
  });

  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          customersRes,
          contactsRes,
          dealsRes,
          invoicesRes,
          paymentsRes,
          refundsRes,
        ] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/contacts"),
          fetch("/api/deals"),
          fetch("/api/invoices"),
          fetch("/api/payments"),
          fetch("/api/refunds"),
        ]);

        const customers = await customersRes.json();
        const contacts = await contactsRes.json();
        const deals = await dealsRes.json();
        const invoicesData = await invoicesRes.json();
        const paymentsData = await paymentsRes.json();
        const refundsData = await refundsRes.json();

        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setRefunds(Array.isArray(refundsData) ? refundsData : []);

        const wonDeals = Array.isArray(deals)
          ? deals.filter((d: any) => d.status === "Won")
          : [];
        const openDeals = Array.isArray(deals)
          ? deals.filter((d: any) => d.status === "Open")
          : [];
        const inProgressDeals = Array.isArray(deals)
          ? deals.filter((d: any) => d.status === "In Progress")
          : [];
        const totalRevenue = wonDeals.reduce(
          (sum: number, deal: any) => sum + (deal.value || 0),
          0,
        );

        const paidInvoices = Array.isArray(invoicesData)
          ? invoicesData.filter((i: any) => i.status === "Paid")
          : [];
        const unpaidInvoices = Array.isArray(invoicesData)
          ? invoicesData.filter((i: any) => i.status !== "Paid")
          : [];
        const totalInvoiceAmount = Array.isArray(invoicesData)
          ? invoicesData.reduce(
              (sum: number, inv: any) => sum + (inv.totalAmount || 0),
              0,
            )
          : 0;
        const totalPaidAmount = Array.isArray(paymentsData)
          ? paymentsData
              .filter((p: any) => p.status === "Completed")
              .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
          : 0;

        const completedPayments = Array.isArray(paymentsData)
          ? paymentsData.filter((p: any) => p.status === "Completed")
          : [];
        const stoppedPayments = Array.isArray(paymentsData)
          ? paymentsData.filter((p: any) => p.status === "Stopped")
          : [];

        const pendingRefunds = Array.isArray(refundsData)
          ? refundsData.filter((r: any) => r.status === "Pending")
          : [];
        const approvedRefunds = Array.isArray(refundsData)
          ? refundsData.filter((r: any) => r.status === "Approved")
          : [];
        const completedRefunds = Array.isArray(refundsData)
          ? refundsData.filter((r: any) => r.status === "Completed")
          : [];
        const totalRefundAmount = completedRefunds.reduce(
          (sum: number, r: any) => sum + (r.amount || 0),
          0,
        );

        setStats({
          totalCustomers: Array.isArray(customers) ? customers.length : 0,
          totalContacts: Array.isArray(contacts) ? contacts.length : 0,
          totalDeals: Array.isArray(deals) ? deals.length : 0,
          totalRevenue,
          wonDeals: wonDeals.length,
          openDeals: openDeals.length,
          inProgressDeals: inProgressDeals.length,
          totalInvoices: Array.isArray(invoicesData) ? invoicesData.length : 0,
          totalPayments: Array.isArray(paymentsData) ? paymentsData.length : 0,
          totalRefunds: Array.isArray(refundsData) ? refundsData.length : 0,
          paidInvoices: paidInvoices.length,
          unpaidInvoices: unpaidInvoices.length,
          completedPayments: completedPayments.length,
          stoppedPayments: stoppedPayments.length,
          pendingRefunds: pendingRefunds.length,
          approvedRefunds: approvedRefunds.length,
          completedRefunds: completedRefunds.length,
          totalInvoiceAmount,
          totalPaidAmount,
          totalRefundAmount,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Payment Status Chart Data
  const paymentStatusData = {
    labels: ["Completed", "Pending", "Stopped", "Failed"],
    datasets: [
      {
        label: "Payment Count",
        data: [
          payments.filter((p) => p.status === "Completed").length,
          payments.filter((p) => p.status === "Pending").length,
          payments.filter((p) => p.status === "Stopped").length,
          payments.filter((p) => p.status === "Failed").length,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(220, 38, 38, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Refund Status Chart Data
  const refundStatusData = {
    labels: ["Completed", "Approved", "Pending", "Rejected", "Failed"],
    datasets: [
      {
        label: "Refund Count",
        data: [
          refunds.filter((r) => r.status === "Completed").length,
          refunds.filter((r) => r.status === "Approved").length,
          refunds.filter((r) => r.status === "Pending").length,
          refunds.filter((r) => r.status === "Rejected").length,
          refunds.filter((r) => r.status === "Failed").length,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(220, 38, 38, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(220, 38, 38, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Financial Overview Chart
  const financialData = {
    labels: ["Invoiced", "Paid", "Refunded", "Outstanding"],
    datasets: [
      {
        label: "Amount ($)",
        data: [
          stats.totalInvoiceAmount,
          stats.totalPaidAmount,
          stats.totalRefundAmount,
          stats.totalInvoiceAmount - stats.totalPaidAmount,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Payment Methods Distribution
  const paymentMethods = payments.reduce((acc: any, p: any) => {
    const method = p.paymentMethod || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const paymentMethodsData = {
    labels: Object.keys(paymentMethods),
    datasets: [
      {
        label: "Payment Methods",
        data: Object.values(paymentMethods),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Invoice Status Pie Chart
  const invoiceStatusData = {
    labels: ["Paid", "Sent", "Overdue", "Draft", "Cancelled"],
    datasets: [
      {
        data: [
          invoices.filter((i) => i.status === "Paid").length,
          invoices.filter((i) => i.status === "Sent").length,
          invoices.filter((i) => i.status === "Overdue").length,
          invoices.filter((i) => i.status === "Draft").length,
          invoices.filter((i) => i.status === "Cancelled").length,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
          "rgba(156, 163, 175, 0.8)",
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Comprehensive overview of your CRM and financial data
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="stat-description">
              From {stats.wonDeals} won deals
            </div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <div className="stat-label">Total Paid</div>
            <div className="stat-value">
              ${stats.totalPaidAmount.toLocaleString()}
            </div>
            <div className="stat-description">
              {stats.completedPayments} completed payments
            </div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Outstanding</div>
            <div className="stat-value">
              $
              {(
                stats.totalInvoiceAmount - stats.totalPaidAmount
              ).toLocaleString()}
            </div>
            <div className="stat-description">
              {stats.unpaidInvoices} unpaid invoices
            </div>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-label">Total Refunded</div>
            <div className="stat-value">
              ${stats.totalRefundAmount.toLocaleString()}
            </div>
            <div className="stat-description">
              {stats.completedRefunds} completed refunds
            </div>
          </div>
        </div>
      </div>

      {/* Payment Alerts Section */}
      <div className="alerts-section">
        <h2>⚠️ Attention Required</h2>
        <div className="alerts-grid">
          {stats.stoppedPayments > 0 && (
            <div className="alert-card alert-danger">
              <div className="alert-icon">🛑</div>
              <div className="alert-content">
                <div className="alert-title">Stopped Payments</div>
                <div className="alert-value">{stats.stoppedPayments}</div>
                <div className="alert-description">
                  Payments have been stopped
                </div>
                <Link href="/payments?status=Stopped" className="alert-link">
                  View Details →
                </Link>
              </div>
            </div>
          )}

          {stats.pendingRefunds > 0 && (
            <div className="alert-card alert-warning">
              <div className="alert-icon">⏳</div>
              <div className="alert-content">
                <div className="alert-title">Pending Refunds</div>
                <div className="alert-value">{stats.pendingRefunds}</div>
                <div className="alert-description">Awaiting approval</div>
                <Link href="/refunds?status=Pending" className="alert-link">
                  Review Now →
                </Link>
              </div>
            </div>
          )}

          {stats.unpaidInvoices > 0 && (
            <div className="alert-card alert-info">
              <div className="alert-icon">📄</div>
              <div className="alert-content">
                <div className="alert-title">Unpaid Invoices</div>
                <div className="alert-value">{stats.unpaidInvoices}</div>
                <div className="alert-description">Require follow-up</div>
                <Link href="/invoices?status=Sent" className="alert-link">
                  View All →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h2>📊 Financial Analytics</h2>

        {/* Row 1: Financial Overview */}
        <div className="chart-row">
          <div className="chart-card chart-card-large">
            <h3>Financial Overview</h3>
            <div style={{ height: "300px" }}>
              <Bar data={financialData} options={barChartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Invoice Status</h3>
            <div style={{ height: "300px" }}>
              <Pie data={invoiceStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Row 2: Payments & Refunds */}
        <div className="chart-row">
          <div className="chart-card">
            <h3>Payment Status Distribution</h3>
            <div style={{ height: "300px" }}>
              <Doughnut data={paymentStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Refund Status Distribution</h3>
            <div style={{ height: "300px" }}>
              <Doughnut data={refundStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Payment Methods</h3>
            <div style={{ height: "300px" }}>
              <Pie data={paymentMethodsData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Deals Pipeline */}
      <div className="pipeline-section">
        <h2>💼 Deals Pipeline</h2>
        <div className="pipeline-grid">
          <div className="pipeline-card pipeline-open">
            <div className="pipeline-header">
              <h3>Open</h3>
              <span className="pipeline-count">{stats.openDeals}</span>
            </div>
            <div className="pipeline-bar">
              <div
                className="pipeline-fill pipeline-fill-open"
                style={{
                  width: `${stats.totalDeals > 0 ? (stats.openDeals / stats.totalDeals) * 100 : 0}%`,
                }}
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
                style={{
                  width: `${stats.totalDeals > 0 ? (stats.inProgressDeals / stats.totalDeals) * 100 : 0}%`,
                }}
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
                style={{
                  width: `${stats.totalDeals > 0 ? (stats.wonDeals / stats.totalDeals) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link href="/customers/new" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add Customer</h3>
            <p>Create a new customer record</p>
          </Link>

          <Link href="/invoices/new" className="action-card">
            <div className="action-icon">💰</div>
            <h3>Create Invoice</h3>
            <p>Generate a new invoice</p>
          </Link>

          <Link href="/payments/new" className="action-card">
            <div className="action-icon">💳</div>
            <h3>Record Payment</h3>
            <p>Log a new payment</p>
          </Link>

          <Link href="/refunds" className="action-card">
            <div className="action-icon">🔄</div>
            <h3>Manage Refunds</h3>
            <p>Review refund requests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
