import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const contact = await prisma.contact.create({
        data: body
    });
    return NextResponse.json(contact, { status: 201 });
}