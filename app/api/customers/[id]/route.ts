import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const customer = await prisma.customer.findUnique({
        where: { id }
    });
    
    if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json(customer);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const customer = await prisma.customer.update({
            where: { id },
            data: body
        });
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.customer.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Customer deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
}