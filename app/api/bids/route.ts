import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, contact, amount, timestamp } = data;

    // Salvar lance no banco de dados
    await prisma.bid.create({
      data: {
        name,
        contact,
        amount: parseFloat(amount),
        timestamp: new Date(timestamp),
      },
    });

    return NextResponse.json(
      { message: "Bid saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving bid:", error);
    return NextResponse.json(
      { message: "Failed to save bid" },
      { status: 500 }
    );
  }
}
