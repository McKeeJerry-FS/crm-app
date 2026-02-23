'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Deal } from '@/lib/types';

const DealDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        value: '',
        status: 'Open'
    });

    useEffect(() => {
        if (id) {
            const fetchDeal = async () => {
                const response = await fetch(`/api/deals/${id}`);
                const data = await response.json();
                setDeal(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    value: data.value.toString(),
                    status: data.status
                });
                setLoading(false);
            };

            fetchDeal();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const response = await fetch(`/api/deals/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                value: parseFloat(formData.value),
                amount: parseFloat(formData.value)
            })
        });

        if (response.ok) {
            const updatedDeal = await response.json();
            setDeal(updatedDeal);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this deal?')) {
            const response = await fetch(`/api/deals/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.push('/deals');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!deal) {
        return <div className="error">Deal not found</div>;
    }

    if (isEditing) {
        return (
            <div>
                <h1>Edit Deal</h1>
                <form onSubmit={handleUpdate} style={{ maxWidth: '500px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title:</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            rows={4}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Value ($):</label>
                        <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => setFormData({...formData, value: e.target.value})}
                            required
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status:</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                        </select>
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
                <h1>{deal.title}</h1>
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
                    <strong>Description:</strong> {deal.description}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Value:</strong> ${deal.value.toLocaleString()}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <strong>Status:</strong> <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        backgroundColor: deal.status === 'Won' ? '#dcfce7' : deal.status === 'Lost' ? '#fee2e2' : '#dbeafe',
                        color: deal.status === 'Won' ? '#166534' : deal.status === 'Lost' ? '#991b1b' : '#1e40af'
                    }}>{deal.status}</span>
                </div>
            </div>
            
            <button className="secondary" onClick={() => router.back()} style={{ marginTop: '2rem' }}>
                ← Back to Deals
            </button>
        </div>
    );
};

export default DealDetail;