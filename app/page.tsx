"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import imageBezerra from "@/images/bezerra.png";

// Define a interface para os lances
interface Bid {
  name: string;
  contact: string;
  amount: string;
  timestamp: Date;
}

function AuctionPage() {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [bids, setBids] = useState<Bid[]>([]);
  const auctionEndDate = new Date("2024-09-30T23:59:59");

  const handleBidSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && contact && amount) {
      const newBid: Bid = {
        name,
        contact,
        amount,
        timestamp: new Date(),
      };

      // Enviar dados para o servidor
      await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBid),
      });

      setBids([...bids, newBid]);
      setName("");
      setContact("");
      setAmount("");
    }
  };

  useEffect(() => {
    async function fetchBids() {
      try {
        const response = await fetch("/api/bids");
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }
        const data = await response.json();
        setBids(data);
      } catch (error) {}
    }

    fetchBids();
  }, []);

  const isAuctionOver = new Date() > auctionEndDate;

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Leilão de Bezerra</h1>

      <Image
        src={imageBezerra}
        alt="Bezerra"
        width={400}
        height={300}
        priority
      />

      <p className="text-lg mt-4 text-center">
        Participe do leilão da bezerra. Faça seu lance antes que o leilão
        termine!
      </p>
      <p className="mt-2 text-red-500">
        Data limite: {auctionEndDate.toLocaleString()}
      </p>

      {!isAuctionOver ? (
        <form onSubmit={handleBidSubmit} className="mt-6">
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md mb-2"
            required
          />
          <input
            type="text"
            placeholder="Seu Contato"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border p-2 rounded-md mb-2"
            required
          />
          <input
            type="number"
            placeholder="Insira seu lance"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded-md mb-2"
            required
            min="1"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Enviar Lance
          </button>
        </form>
      ) : (
        <p className="text-red-500 font-bold mt-6">Leilão encerrado!</p>
      )}

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Lances</h2>
        <ul className="list-disc list-inside">
          {bids.length > 0 ? (
            bids.map((bid, index) => (
              <li key={index} className="border-b py-2">
                {bid.name} ({bid.contact}) - Lance de R${bid.amount} -{" "}
                {bid.timestamp.toLocaleString()}
              </li>
            ))
          ) : (
            <li className="text-gray-500">Nenhum lance até agora.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AuctionPage;
