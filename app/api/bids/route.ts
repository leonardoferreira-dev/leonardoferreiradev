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

export async function GET() {
  try {
    // Obter o último lance (mais recente)
    const latestBid = await prisma.bid.findFirst({
      orderBy: {
        timestamp: "desc", // Ordenar pelos mais recentes primeiro
      },
    });

    // Obter o lance com o valor mais alto
    const highestBid = await prisma.bid.findFirst({
      orderBy: {
        amount: "desc", // Ordenar pelos valores mais altos primeiro
      },
    });

    return NextResponse.json(
      {
        latestBid,
        highestBid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { message: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
