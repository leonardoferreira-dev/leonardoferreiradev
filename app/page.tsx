/* eslint-disable */

"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import InputMask from "react-input-mask";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import Slider from "react-slick";

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

  const toPrice = (
    val: string | number | null = null,
    minimum: number | null = null,
    maximum: number | null = null
  ) => {
    if (val === null || val === undefined || isNaN(Number(val))) {
      return "0,00"; // Retorne um valor padrão caso `val` não seja válido
    }

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
      newErrors.amount = `O lance deve ser maior que R$ ${toPrice(
        highestBid.amount
      )}`;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const formattedAmount = amount.replace(",", ".");

    const newBid: Bid = {
      name,
      contact,
      amount: formattedAmount,
      timestamp: new Date(),
    };

    await fetch("/api/bids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBid),
    });

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // Ajusta a altura do slider com base no slide atual
  };

  return (
    <div
      className="flex flex-col items-center p-8 min-h-screen"
      style={{ background: "#F2F7FA" }}
    >
      <h1 className="text-4xl text-black font-bold mb-8">Leilão de Bezerra</h1>

      {/* Carrossel de imagens e vídeo */}
      <div className="w-full max-w-lg mb-8 min-h-[300px]">
        <Slider {...sliderSettings}>
          <div>
            <Image
              src="https://leonardoferreiradev.s3.sa-east-1.amazonaws.com/bezerro1.jpeg"
              alt="Bezerro 1"
              width={500} // Ajusta largura
              height={350} // Ajusta altura
              layout="responsive"
            />
          </div>
          <div>
            <Image
              src="https://leonardoferreiradev.s3.sa-east-1.amazonaws.com/bezerro2.jpeg"
              alt="Bezerro 2"
              width={500}
              height={350}
              layout="responsive"
            />
          </div>
          <div>
            <Image
              src="https://leonardoferreiradev.s3.sa-east-1.amazonaws.com/bezerro3.jpeg"
              alt="Bezerro 3"
              width={500}
              height={350}
              layout="responsive"
            />
          </div>
          <div>
            <video controls width="500" height="300" className="w-full h-full">
              <source
                src="https://leonardoferreiradev.s3.sa-east-1.amazonaws.com/bezerra.mp4"
                type="video/mp4"
              />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </Slider>
      </div>

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
                  maxLength={40}
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
                  {(inputProps: any) => {
                    return (
                      <input
                        {...inputProps}
                        type="text"
                        placeholder=""
                        className={`border p-2 mb-4 text-black  bg-slate-200 ${
                          errors.contact ? "border-red-500" : ""
                        }`}
                        required
                      />
                    );
                  }}
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
                  {(inputProps: any) => {
                    return (
                      <input
                        {...inputProps}
                        type="text"
                        placeholder=""
                        className={`border p-2 mb-4 bg-slate-200 text-black ${
                          errors.amount ? "border-red-500" : ""
                        }`}
                        dir="rtl"
                        required
                      />
                    );
                  }}
                </InputMask>

                <p className="text-red-500 mb-4">
                  O lance mínimo é de R$ {toPrice(highestBid?.amount) || "0,00"}
                </p>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 h-12 flex items-center justify-center rounded-lg"
              >
                Enviar Lance
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center">
            <p className="text-lg font-bold">O leilão terminou!</p>
          </div>
        )}
      </div>

      {latestBid && (
        <div className="bg-white rounded-2xl shadow-sm mt-8 max-w-sm w-full">
          <div
            className="w-full h-12 justify-center flex items-center rounded-t-2xl shadow-sm"
            style={{ background: "#00B4B0" }}
          >
            <span className="text-base">Último lance</span>
          </div>
          <div className="p-4">
            <p className="text-gray-800">
              <strong>Nome:</strong> {latestBid.name}
            </p>
            <p className="text-gray-800">
              <strong>Valor:</strong> R$ {toPrice(latestBid.amount)}
            </p>
            <p className="text-gray-800">
              <strong>Data:</strong>{" "}
              {format(
                new Date(latestBid.timestamp),
                "dd 'de' MMMM 'às' HH:mm",
                {
                  locale: ptBR,
                }
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionPage;
