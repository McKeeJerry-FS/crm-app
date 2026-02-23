'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    
    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

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
            </div>
        </nav>
    );
};

export default Navbar;