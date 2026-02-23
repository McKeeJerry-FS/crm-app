'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const invoiceSchema = z.object({
    customerId: z.string().min(1, 'Customer is required'),
    dealId: z.string().optional(),
    issueDate: z.string().min(1, 'Issue date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']),
    taxRate: z.number().min(0).max(1),
    discountAmount: z.number().min(0),
    notes: z.string().optional(),
    termsConditions: z.string().optional(),
    items: z.array(
        z.object({
            description: z.string().min(1, 'Description is required'),
            quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
            unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
        })
    ).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const NewInvoice = () => {
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            status: 'Draft',
            taxRate: 0.08,
            discountAmount: 0,
            items: [{ description: '', quantity: 1, unitPrice: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const watchItems = watch('items');
    const watchTaxRate = watch('taxRate');
    const watchDiscountAmount = watch('discountAmount');

    const subtotal = watchItems?.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
        0
    ) || 0;

    const taxAmount = subtotal * (watchTaxRate || 0);
    const totalAmount = subtotal + taxAmount - (watchDiscountAmount || 0);
    const amountDue = totalAmount;

    useEffect(() => {
        const fetchData = async () => {
            const [customersRes, dealsRes] = await Promise.all([
                fetch('/api/customers'),
                fetch('/api/deals'),
            ]);
            setCustomers(await customersRes.json());
            setDeals(await dealsRes.json());
        };
        fetchData();
    }, []);

    const onSubmit = async (data: InvoiceFormData) => {
        setLoading(true);
        try {
            const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

            const items = data.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
            }));

            const invoiceData = {
                invoiceNumber,
                customerId: data.customerId,
                dealId: data.dealId || null,
                issueDate: new Date(data.issueDate),
                dueDate: new Date(data.dueDate),
                subtotal,
                taxRate: data.taxRate,
                taxAmount,
                discountAmount: data.discountAmount,
                totalAmount,
                amountPaid: 0,
                amountDue,
                status: data.status,
                notes: data.notes || null,
                termsConditions: data.termsConditions || null,
                items,
            };

            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });

            if (response.ok) {
                const invoice = await response.json();
                router.push(`/invoices/${invoice.id}`);
            } else {
                alert('Failed to create invoice');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <button className="secondary" onClick={() => router.back()}>
                    ← Back
                </button>
            </div>

            <h1 style={{ marginBottom: '2rem' }}>Create New Invoice</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Invoice Information</h2>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="customerId">
                                Customer <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select id="customerId" {...register('customerId')} className="form-input">
                                <option value="">Select a customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                            {errors.customerId && (
                                <span className="error-message">{errors.customerId.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dealId">Related Deal (Optional)</label>
                            <select id="dealId" {...register('dealId')} className="form-input">
                                <option value="">Select a deal</option>
                                {deals.map((deal) => (
                                    <option key={deal.id} value={deal.id}>
                                        {deal.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="issueDate">
                                Issue Date <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="issueDate"
                                {...register('issueDate')}
                                className="form-input"
                            />
                            {errors.issueDate && (
                                <span className="error-message">{errors.issueDate.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate">
                                Due Date <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                {...register('dueDate')}
                                className="form-input"
                            />
                            {errors.dueDate && (
                                <span className="error-message">{errors.dueDate.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">
                                Status <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select id="status" {...register('status')} className="form-input">
                                <option value="Draft">Draft</option>
                                <option value="Sent">Sent</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="taxRate">Tax Rate (%)</label>
                            <input
                                type="number"
                                id="taxRate"
                                step="0.01"
                                {...register('taxRate', { valueAsNumber: true })}
                                className="form-input"
                            />
                            <small style={{ color: '#6b7280' }}>Enter as decimal (e.g., 0.08 for 8%)</small>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Line Items</h2>
                        <button
                            type="button"
                            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                            className="secondary"
                        >
                            + Add Item
                        </button>
                    </div>

                    {errors.items && typeof errors.items.message === 'string' && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                            {errors.items.message}
                        </div>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className="item-row" style={{ marginBottom: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                            <div className="form-grid">
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label htmlFor={`items.${index}.description`}>
                                        Description <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register(`items.${index}.description`)}
                                        className="form-input"
                                        placeholder="Item description"
                                    />
                                    {errors.items?.[index]?.description && (
                                        <span className="error-message">
                                            {errors.items[index]?.description?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`items.${index}.quantity`}>
                                        Quantity <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                        className="form-input"
                                    />
                                    {errors.items?.[index]?.quantity && (
                                        <span className="error-message">
                                            {errors.items[index]?.quantity?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`items.${index}.unitPrice`}>
                                        Unit Price <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                        className="form-input"
                                        placeholder="0.00"
                                    />
                                    {errors.items?.[index]?.unitPrice && (
                                        <span className="error-message">
                                            {errors.items[index]?.unitPrice?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Amount</label>
                                        <div style={{ padding: '0.75rem', background: '#e5e7eb', borderRadius: '8px', fontWeight: 'bold' }}>
                                            ${((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {fields.length > 1 && (
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="danger"
                                            style={{ width: '100%' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invoice Totals */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Invoice Summary</h2>
                    
                    <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1rem' }}>
                        <label htmlFor="discountAmount">Discount Amount</label>
                        <input
                            type="number"
                            id="discountAmount"
                            step="0.01"
                            {...register('discountAmount', { valueAsNumber: true })}
                            className="form-input"
                            placeholder="0.00"
                        />
                    </div>

                    <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal:</span>
                            <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Tax ({((watchTaxRate || 0) * 100).toFixed(1)}%):</span>
                            <strong>${taxAmount.toFixed(2)}</strong>
                        </div>
                        {watchDiscountAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                                <span>Discount:</span>
                                <strong>-${(watchDiscountAmount || 0).toFixed(2)}</strong>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb', fontSize: '1.25rem' }}>
                            <strong>Total:</strong>
                            <strong style={{ color: '#2563eb' }}>${totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Additional Information</h2>
                    
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            {...register('notes')}
                            className="form-input"
                            rows={4}
                            placeholder="Any additional notes for this invoice..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="termsConditions">Terms & Conditions</label>
                        <textarea
                            id="termsConditions"
                            {...register('termsConditions')}
                            className="form-input"
                            rows={4}
                            placeholder="Payment terms and conditions..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewInvoice;