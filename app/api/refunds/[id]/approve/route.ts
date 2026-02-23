import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { approvedBy } = await request.json();
    
    try {
        const refund = await prisma.refund.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
            },
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