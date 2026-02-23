'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDeal() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        value: '',
        status: 'Open'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const response = await fetch('/api/deals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                value: parseFloat(formData.value),
                amount: parseFloat(formData.value) // Both value and amount for compatibility
            })
        });

        if (response.ok) {
            router.push('/deals');
        }
    };

    return (
        <div>
            <h1>New Deal</h1>
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
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
                
                <button type="submit">Create Deal</button>
                <button type="button" className="secondary" onClick={() => router.back()} style={{ marginLeft: '1rem' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}