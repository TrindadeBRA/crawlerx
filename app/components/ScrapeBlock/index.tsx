"use client";

import { useState } from "react";

export default function ScrapeBlock() {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const buscarDados = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scraping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: "tecmundo.com.br",
          searchTerm: "O que é Laravel? Conheça o framework de PHP mais utilizado",
          limit: 1
        })
      });
      const dados = await res.json();
      console.log('Resposta da requisição:', dados);
      setData(dados.body);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="prose max-w-none">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Conteúdo do Site</h1>
        <button 
          onClick={buscarDados}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Buscando..." : "Buscar Dados"}
        </button>
      </div>
      <code 
        className="mt-4 block"
        dangerouslySetInnerHTML={{ __html: data || "Nenhum dado carregado"}} 
      />
    </article>
  );
}
