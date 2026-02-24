import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
        customer: true,
        refunds: true,
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const body = await request.json();

  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: body,
      include: {
        customer: true,
        invoice: true,
      },
    });

    // Add to payment history
    await prisma.paymentHistory.create({
      data: {
        paymentId: id,
        action: "Updated",
        description: "Payment details updated",
        performedBy: body.processedBy || "System",
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    await prisma.payment.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Payment deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }
}
