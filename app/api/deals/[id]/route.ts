import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const deal = await prisma.deal.findUnique({
        where: { id }
    });
    
    if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json(deal);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const deal = await prisma.deal.update({
            where: { id },
            data: body
        });
        return NextResponse.json(deal);
    } catch (error) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.deal.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Deal deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
}