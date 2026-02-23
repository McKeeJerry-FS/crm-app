import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const invoices = await prisma.invoice.findMany({
        include: {
            customer: true,
            deal: true,
            items: true,
            payments: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    const { items, ...invoiceData } = body;
    
    const invoice = await prisma.invoice.create({
        data: {
            ...invoiceData,
            items: {
                create: items || []
            }
        },
        include: {
            customer: true,
            items: true,
        }
    });
    
    return NextResponse.json(invoice, { status: 201 });
}