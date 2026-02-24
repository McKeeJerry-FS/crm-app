import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
        customer: true,
        refunds: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payment = await prisma.payment.create({
      data: body,
      include: {
        customer: true,
        invoice: true,
      },
    });

    // Add to payment history
    await prisma.paymentHistory.create({
      data: {
        paymentId: payment.id,
        action: "Created",
        description: "Payment created",
        performedBy: body.processedBy || "System",
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
