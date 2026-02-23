'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    
    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    if (pathname === '/login') {
        return null;
    }

    if (!session) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-brand">
                    🏢 CRM Pro
                </Link>
                
                <div className="navbar-links">
                    <Link 
                        href="/dashboard" 
                        className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        📊 Dashboard
                    </Link>
                    <Link 
                        href="/customers" 
                        className={`navbar-link ${isActive('/customers') ? 'active' : ''}`}
                    >
                        📋 Customers
                    </Link>
                    <Link 
                        href="/contacts" 
                        className={`navbar-link ${isActive('/contacts') ? 'active' : ''}`}
                    >
                        👥 Contacts
                    </Link>
                    <Link 
                        href="/deals" 
                        className={`navbar-link ${isActive('/deals') ? 'active' : ''}`}
                    >
                        💼 Deals
                    </Link>
                    <Link 
                        href="/invoices" 
                        className={`navbar-link ${isActive('/invoices') ? 'active' : ''}`}
                    >
                        💰 Invoices
                    </Link>
                    <Link 
                        href="/payments" 
                        className={`navbar-link ${isActive('/payments') ? 'active' : ''}`}
                    >
                        💳 Payments
                    </Link>
                    <Link 
                        href="/refunds" 
                        className={`navbar-link ${isActive('/refunds') ? 'active' : ''}`}
                    >
                        🔄 Refunds
                    </Link>
                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">{session.user?.name}</span>
                        <span className="user-role">{(session.user as any)?.role}</span>
                    </div>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="logout-button"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;