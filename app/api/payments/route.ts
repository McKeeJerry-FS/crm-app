import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const payments = await prisma.payment.findMany({
        include: {
            customer: true,
            invoice: true,
            refunds: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    const payment = await prisma.payment.create({
        data: {
            ...body,
            paymentHistory: {
                create: {
                    action: 'Created',
                    description: `Payment created via ${body.paymentMethod}`,
                    performedBy: body.processedBy || 'System',
                }
            }
        },
        include: {
            customer: true,
            invoice: true,
        }
    });
    
    return NextResponse.json(payment, { status: 201 });
}