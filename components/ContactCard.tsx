import React from 'react';
import Link from 'next/link';

interface ContactCardProps {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const ContactCard = ({ id, name, email, phone }: ContactCardProps) => {
    return (
        <Link href={`/contacts/${id}`} className="card">
            <h2>{name}</h2>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
        </Link>
    );
};

export default ContactCard;