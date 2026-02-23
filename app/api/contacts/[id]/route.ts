import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    const contact = await prisma.contact.findUnique({
        where: { id }
    });
    
    if (!contact) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json(contact);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    
    try {
        const contact = await prisma.contact.update({
            where: { id },
            data: body
        });
        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    
    try {
        await prisma.contact.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Contact deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
}