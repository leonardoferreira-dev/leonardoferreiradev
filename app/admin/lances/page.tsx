// app/admin/lances.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Bid {
  id: number;
  name: string;
  contact: string;
  amount: number;
  timestamp: string;
}

export default function LancesPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const isLoggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isLoggedInStatus);

    if (!isLoggedInStatus) {
      // Redireciona para a página de administração se não estiver autenticado
      router.push("/admin");
      return;
    }

    // Fetch dos lances se estiver autenticado
    fetch(`/api/lances`)
      .then((response) => response.json())
      .then((data) => {
        setBids(data.data);
      })
      .catch((error) => {
        console.error("Error fetching bids:", error);
      });
  }, [router]);

  function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const phoneNumber = phone.replace(/\D/g, "");
    // Format the number for WhatsApp
    return `https://wa.me/${phoneNumber}`;
  }

  if (isLoggedIn === null) {
    // Render a loading state or a placeholder while checking authentication status
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col items-center p-8 min-h-screen text-black"
      style={{ background: "#F2F7FA" }}
    >
      {isLoggedIn && (
        <div className="flex flex-col bg-white rounded-2xl shadow-sm mt-8 w-full max-w-sm">
          <div
            className="w-full h-12 justify-center flex items-center rounded-t-2xl shadow-sm"
            style={{ background: "#00B4B0" }}
          >
            <span className="text-base text-white">Listagem de Lances</span>
          </div>
          <div className="p-4">
            {bids && bids?.length > 0 ? (
              <table className="table-auto">
                <thead>
                  <tr className="text-left text-sm uppercase">
                    <th className="px-2">Nome</th>
                    <th className="px-2">Contato</th>
                    <th className="px-2">Valor</th>
                    <th className="px-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr
                      key={bid.id}
                      className="text-sm text-left odd:bg-white even:bg-slate-100 hover:bg-gray hover:bg-gray border-t border-solid border-gray-others"
                    >
                      <td className="px-2">{bid.name}</td>
                      <td className="px-2">
                        {" "}
                        <a
                          href={formatPhoneNumber(bid.contact)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {bid.contact}
                        </a>
                      </td>
                      <td className="px-2 font-bold">
                        {bid.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-2">
                        {new Date(bid.timestamp).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span>Não foram encontrads lances.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
