import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
            customer: true,
            invoice: {
                include: {
                    items: true,
                }
            },
            refunds: true,
            paymentHistory: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    
    if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    return NextResponse.json(payment);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const payment = await prisma.payment.update({
            where: { id },
            data: body,
            include: {
                customer: true,
                invoice: true,
            }
        });
        
        // Add to payment history
        await prisma.paymentHistory.create({
            data: {
                paymentId: id,
                action: 'Updated',
                description: 'Payment details updated',
                performedBy: body.processedBy || 'System',
            }
        });
        
        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.payment.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Payment deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
}