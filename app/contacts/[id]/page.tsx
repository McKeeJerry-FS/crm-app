'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Contact } from '@/lib/types';

const ContactDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    useEffect(() => {
        if (id) {
            const fetchContact = async () => {
                const response = await fetch(`/api/contacts/${id}`);
                const data = await response.json();
                setContact(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    company: data.company
                });
                setLoading(false);
            };
            fetchContact();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const updatedContact = await response.json();
            setContact(updatedContact);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this contact?')) {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.push('/contacts');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!contact) {
        return <div className="error">Contact not found</div>;
    }

    if (isEditing) {
        return (
            <div>
                <h1>Edit Contact</h1>
                <form onSubmit={handleUpdate} style={{ maxWidth: '500px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone:</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Company:</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <button type="submit">Save Changes</button>
                    <button type="button" className="secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: '1rem' }}>
                        Cancel
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{contact.name}</h1>
                <div>
                    <button onClick={() => setIsEditing(true)} style={{ marginRight: '1rem' }}>
                        ✏️ Edit
                    </button>
                    <button className="danger" onClick={handleDelete}>
                        🗑️ Delete
                    </button>
                </div>
            </div>
            
            <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Email:</strong> {contact.email}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Phone:</strong> {contact.phone}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Company:</strong> {contact.company}
                </div>
            </div>
            
            <button className="secondary" onClick={() => router.back()} style={{ marginTop: '2rem' }}>
                ← Back to Contacts
            </button>
        </div>
    );
};

export default ContactDetail;