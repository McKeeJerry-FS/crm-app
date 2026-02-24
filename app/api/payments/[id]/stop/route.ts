import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { reason } = await request.json();

    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: "Stopped",
        isStopped: true,
        stoppedAt: new Date(),
        stopReason: reason || "Payment stopped",
      },
      include: {
        invoice: true,
        customer: true,
        history: true,
      },
    });

    // Create payment history separately
    await prisma.paymentHistory.create({
      data: {
        paymentId: params.id,
        action: "Payment Stopped",
        description: reason || "Payment was stopped",
        performedBy: "System", // Or pass the user ID if available
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error stopping payment:", error);
    return NextResponse.json(
      { error: "Failed to stop payment" },
      { status: 500 },
    );
  }
}
