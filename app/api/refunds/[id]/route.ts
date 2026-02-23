import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const refund = await prisma.refund.findUnique({
        where: { id },
        include: {
            payment: {
                include: {
                    customer: true,
                }
            },
            invoice: {
                include: {
                    items: true,
                }
            },
        }
    });
    
    if (!refund) {
        return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
    }
    
    return NextResponse.json(refund);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const refund = await prisma.refund.update({
            where: { id },
            data: body,
            include: {
                payment: true,
                invoice: true,
            }
        });
        return NextResponse.json(refund);
    } catch (error) {
        return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.refund.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Refund deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Refund not found' }, { status: 404 });
    }
}