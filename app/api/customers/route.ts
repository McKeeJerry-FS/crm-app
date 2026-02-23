import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const customer = await prisma.customer.create({
        data: body
    });
    return NextResponse.json(customer, { status: 201 });
}