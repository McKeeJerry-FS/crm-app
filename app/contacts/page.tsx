'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ContactCard from '@/components/ContactCard';
import { Contact } from '@/lib/types';

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const response = await fetch('/api/contacts');
            const data = await response.json();
            setContacts(data);
        };

        fetchContacts();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Contacts</h1>
                <Link href="/contacts/new">
                    <button>+ New Contact</button>
                </Link>
            </div>
            <div className="grid">
                {contacts.map(contact => (
                    <ContactCard 
                        key={contact.id}
                        id={contact.id}
                        name={contact.name}
                        email={contact.email}
                        phone={contact.phone}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContactsPage;