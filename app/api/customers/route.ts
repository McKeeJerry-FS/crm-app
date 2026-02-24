import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        contacts: true,
        deals: true,
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
