'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Customer } from '@/lib/types';

const CustomerDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (id) {
            const fetchCustomer = async () => {
                const response = await fetch(`/api/customers/${id}`);
                const data = await response.json();
                setCustomer(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address
                });
                setLoading(false);
            };

            fetchCustomer();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const response = await fetch(`/api/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const updatedCustomer = await response.json();
            setCustomer(updatedCustomer);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this customer?')) {
            const response = await fetch(`/api/customers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.push('/customers');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!customer) {
        return <div className="error">Customer not found</div>;
    }

    if (isEditing) {
        return (
            <div>
                <h1>Edit Customer</h1>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address:</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
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
                <h1>{customer.name}</h1>
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
                    <strong>Email:</strong> {customer.email}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Phone:</strong> {customer.phone}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Address:</strong> {customer.address}
                </div>
            </div>
            
            <button className="secondary" onClick={() => router.back()} style={{ marginTop: '2rem' }}>
                ← Back to Customers
            </button>
        </div>
    );
};

export default CustomerDetail;