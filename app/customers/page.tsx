'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomerCard from '@/components/CustomerCard';
import { Customer } from '@/lib/types';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Customers</h1>
        <Link href="/customers/new">
          <button>+ New Customer</button>
        </Link>
      </div>
      <div className="grid">
        {customers.map(customer => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            email={customer.email}
            phone={customer.phone}
            address={customer.address}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomersPage;