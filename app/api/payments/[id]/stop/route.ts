import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { reason, stoppedBy } = await request.json();
    
    try {
        const payment = await prisma.payment.update({
            where: { id },
            data: {
                status: 'Stopped',
                isStopped: true,
                stoppedAt: new Date(),
                stoppedBy,
                stopReason: reason,
            },
            include: {
                customer: true,
                invoice: true,
            }
        });
        
        // Add to payment history
        await prisma.paymentHistory.create({
            data: {
                paymentId: id,
                action: 'Stopped',
                description: `Payment stopped: ${reason}`,
                performedBy: stoppedBy,
            }
        });
        
        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
}