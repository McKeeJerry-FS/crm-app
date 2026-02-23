import { NextRequest, NextResponse } from 'next/server';

let deals = [
    { id: '1', title: 'Big Deal', description: 'A large contract', value: 50000, amount: 50000, status: 'In Progress' },
];

export async function GET() {
    return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newDeal = {
        id: Date.now().toString(),
        ...body
    };
    deals.push(newDeal);
    return NextResponse.json(newDeal, { status: 201 });
}