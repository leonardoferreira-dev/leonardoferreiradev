// app/admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica usuário e senha
    if (username === "ipbn" && password === "@Ipbn2024#") {
      // Armazena flag no localStorage para manter sessão
      localStorage.setItem("isLoggedIn", "true");

      // Redireciona para a página de lances
      router.push("/admin/lances");
    } else {
      setError("Usuário ou senha inválidos!");
    }
  };

  return (
    <div
      className="flex flex-col items-center p-8 min-h-screen text-black"
      style={{ background: "#F2F7FA" }}
    >
      <div className="flex flex-col bg-white rounded-2xl shadow-sm mt-8 w-full max-w-sm">
        <div
          className="w-full h-12 justify-center flex items-center rounded-t-2xl shadow-sm"
          style={{ background: "#00B4B0" }}
        >
          <span className="text-base text-white">Listagem de Lances</span>
        </div>
        <div className="p-4">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col w-full">
              <span className="text-black">Nome</span>
              <input
                type="text"
                className={`border p-2 mb-4 w-full text-black bg-slate-200 `}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="text-black">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`border p-2 mb-4 w-full text-black bg-slate-200 `}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 h-12 flex items-center justify-center rounded-lg"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
