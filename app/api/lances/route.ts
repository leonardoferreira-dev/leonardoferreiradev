// app/api/lances/list.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Obter todos os lances ordenados por data mais recente
    const bids = await prisma.bid.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({
      data: bids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { message: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
