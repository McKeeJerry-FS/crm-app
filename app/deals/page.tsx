'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DealCard from '@/components/DealCard';
import { Deal } from '@/lib/types';

const DealsPage = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchDeals = async () => {
            const response = await fetch('/api/deals');
            const data = await response.json();
            setDeals(data);
        };

        fetchDeals();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Deals</h1>
                <Link href="/deals/new">
                    <button>+ New Deal</button>
                </Link>
            </div>
            <div className="grid">
                {deals.map(deal => (
                    <DealCard 
                        key={deal.id}
                        title={deal.title}
                        amount={deal.amount}
                        status={deal.status}
                        onClick={() => router.push(`/deals/${deal.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DealsPage;