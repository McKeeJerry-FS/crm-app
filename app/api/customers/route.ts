import { NextRequest, NextResponse } from 'next/server';

let customers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
];

export async function GET() {
    return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newCustomer = {
        id: Date.now().toString(),
        ...body
    };
    customers.push(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
}