import React from 'react';
import Link from 'next/link';

interface CustomerCardProps {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const CustomerCard = ({ id, name, email, phone, address }: CustomerCardProps) => {
    return (
        <Link href={`/customers/${id}`} className="card">
            <h2>{name}</h2>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Address:</strong> {address}</p>
        </Link>
    );
};

export default CustomerCard;