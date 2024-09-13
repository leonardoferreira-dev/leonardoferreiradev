"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import imageBezerra from "@/images/bezerra.png";
import InputMask from "react-input-mask";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

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
  const [latestBid, setLatestBid] = useState<Bid | null>(null);
  const [highestBid, setHighestBid] = useState<Bid | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const auctionEndDate = new Date("2024-09-30T23:59:59");

  const toPrice = (val = null, minimum = null, maximum = null) => {
    const min = minimum || minimum === 0 ? minimum : 2;

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: min,
      maximumFractionDigits: maximum || minimum || 2,
    }).format(Number(val));
  };

  const handleBidSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validação dos campos
    if (!name) newErrors.name = "O nome é obrigatório.";
    if (!contact) newErrors.contact = "O contato é obrigatório.";
    if (!amount) newErrors.amount = "O valor do lance é obrigatório.";
    if (
      highestBid &&
      parseFloat(amount.replace(",", ".")) <= parseFloat(highestBid.amount)
    )
      setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Se houver erros, não envie o formulário

    const formattedAmount = amount.replace(",", ".");

    const newBid: Bid = {
      name,
      contact,
      amount: formattedAmount,
      timestamp: new Date(),
    };

    console.log("newBid", newBid);

    // Enviar dados para o servidor
    await fetch("/api/bids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBid),
    });

    // Atualizar as ofertas após o envio
    await fetchBids();
    setName("");
    setContact("");
    setAmount("");
    setErrors({});
  };

  async function fetchBids() {
    try {
      const response = await fetch("/api/bids");
      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }
      const data = await response.json();
      console.log("trazendo data", data);
      setLatestBid(data.latestBid);
      setHighestBid(data.highestBid);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    fetchBids();
  }, []);

  const isAuctionOver = new Date() > auctionEndDate;

  return (
    <div
      className="flex flex-col items-center p-8 min-h-screen "
      style={{ background: "#F2F7FA" }}
    >
      <h1 className="text-4xl text-black font-bold mb-8">Leilão de Bezerra</h1>

      <Image
        src={imageBezerra}
        alt="Bezerra"
        width={400}
        height={300}
        priority
      />

      <p className="max-w-sm text-lg mt-4 text-center text-black">
        Participe do leilão da bezerra. Faça seu lance antes que o leilão
        termine!
      </p>

      <div className="flex flex-col bg-white rounded-2xl shadow-sm mt-8 w-full max-w-sm">
        <div
          className="w-full h-12 justify-center flex items-center rounded-t-2xl shadow-sm"
          style={{ background: "#00B4B0" }}
        >
          <span className="text-base"> Preencha os campos</span>
        </div>

        {!isAuctionOver ? (
          <form onSubmit={handleBidSubmit} className="mt-6 w-full p-4">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full">
                <span className="text-black">Nome</span>
                <input
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border p-2 mb-4 w-full text-black bg-slate-200 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  required
                  maxLength={40} // Adiciona o limite de caracteres
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="flex flex-col">
                <span className="text-black">Contato</span>
                <InputMask
                  mask="(99) 99999-9999"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                >
                  {(inputProps: any) => (
                    <input
                      {...inputProps}
                      type="text"
                      placeholder=""
                      className={`border p-2 mb-4 text-black  bg-slate-200 ${
                        errors.contact ? "border-red-500" : ""
                      }`}
                      required
                    />
                  )}
                </InputMask>
                {errors.contact && (
                  <p className="text-red-500">{errors.contact}</p>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-black">Lance</span>
                <InputMask
                  mask="9999,99"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                >
                  {(inputProps: any) => (
                    <input
                      {...inputProps}
                      type="text"
                      placeholder=""
                      className={`border p-2 mb-4 bg-slate-200 text-black ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                      dir="rtl" // Adiciona a propriedade para escrita da direita para a esquerda
                      required
                    />
                  )}
                </InputMask>

                <p className="text-red-500 mb-4">
                  {" "}
                  O lance minimo é de R$ {toPrice(highestBid?.amount) || "0,00"}
                </p>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 h-11 rounded-md"
              >
                Enviar Lance
              </button>
              <p className="mt-2 text-red-500">
                Data limite:{" "}
                {format(auctionEndDate, "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </form>
        ) : (
          <p className="text-red-500 font-bold mt-6">Leilão encerrado!</p>
        )}
      </div>
      <div className="flex flex-col bg-white rounded-2xl shadow-sm mt-8 w-full max-w-sm">
        <div
          className="w-full h-12 justify-center flex items-center rounded-t-2xl shadow-sm"
          style={{ background: "#00B4B0" }}
        >
          <span className="text-base"> Último Lance</span>
        </div>
        <div className="p-2 w-full flex overflow-hidden">
          <ul className="flex max-w-lg list-disc list-inside text-black overflow-wrap-break-word">
            {latestBid ? (
              <li className="border-b py-2">
                {latestBid.name} <b>R${toPrice(latestBid.amount)}</b> -{" "}
                {format(new Date(latestBid.timestamp), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </li>
            ) : (
              <li className="text-gray-500 text-black">
                Nenhum lance até agora.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuctionPage;
