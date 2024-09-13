import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const data = req.body;
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

      res.status(200).json({ message: "Bid saved successfully" });
    } catch (error) {
      console.error("Error saving bid:", error);
      res.status(500).json({ message: "Failed to save bid" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
