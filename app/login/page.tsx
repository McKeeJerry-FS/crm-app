'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const demoAccounts = [
        { email: 'admin@crm.com', password: 'admin123', role: 'Admin' },
        { email: 'manager@crm.com', password: 'manager123', role: 'Manager' },
        { email: 'user@crm.com', password: 'user123', role: 'User' },
    ];

    const fillDemo = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                maxWidth: '900px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                overflow: 'hidden'
            }}>
                {/* Left Side - Login Form */}
                <div style={{ padding: '3rem' }}>
                    <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome Back! 👋</h1>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        Sign in to access your CRM dashboard
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="you@example.com"
                                required
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                                style={{ width: '100%' }}
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: '#fee2e2',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                color: '#dc2626'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                            Don't have an account? <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Contact admin</a>
                        </div>
                    </form>
                </div>

                {/* Right Side - Demo Accounts */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '3rem',
                    color: 'white'
                }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🎭 Demo Accounts</h2>
                    <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
                        Quick access to test accounts with different permission levels
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {demoAccounts.map((account) => (
                            <div
                                key={account.email}
                                onClick={() => fillDemo(account.email, account.password)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <strong style={{ fontSize: '1.125rem' }}>{account.role}</strong>
                                    <span style={{
                                        background: 'rgba(255, 255, 255, 0.3)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem'
                                    }}>
                                        Click to use
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                    <div>📧 {account.email}</div>
                                    <div>🔑 {account.password}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                    }}>
                        ℹ️ <strong>Tip:</strong> Click on any demo account to auto-fill the login credentials
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;