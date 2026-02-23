import { NextRequest, NextResponse } from 'next/server';

let contacts = [
    { id: '1', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', company: 'ABC Corp' },
];

export async function GET() {
    return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newContact = {
        id: Date.now().toString(),
        ...body
    };
    contacts.push(newContact);
    return NextResponse.json(newContact, { status: 201 });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await request.json();
    const index = contacts.findIndex(c => c.id === params.id);
    
    if (index === -1) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    contacts[index] = { ...contacts[index], ...body };
    return NextResponse.json(contacts[index]);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const index = contacts.findIndex(c => c.id === params.id);
    
    if (index === -1) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    contacts.splice(index, 1);
    return NextResponse.json({ message: 'Contact deleted' });
}