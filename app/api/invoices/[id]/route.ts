import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: true,
            deal: true,
            items: true,
            payments: true,
            refunds: true,
        }
    });
    
    if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    return NextResponse.json(invoice);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const invoice = await prisma.invoice.update({
            where: { id },
            data: body,
            include: {
                customer: true,
                items: true,
            }
        });
        return NextResponse.json(invoice);
    } catch (error) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.invoice.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Invoice deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
}