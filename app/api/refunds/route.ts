import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const refunds = await prisma.refund.findMany({
        include: {
            payment: {
                include: {
                    customer: true,
                }
            },
            invoice: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(refunds);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    const refund = await prisma.refund.create({
        data: body,
        include: {
            payment: {
                include: {
                    customer: true,
                }
            },
            invoice: true,
        }
    });
    
    return NextResponse.json(refund, { status: 201 });
}