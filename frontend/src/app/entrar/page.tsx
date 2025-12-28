"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { LoginResponse } from "@/lib/types";

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 9);
  const p4 = digits.slice(9, 11);

  if (digits.length <= 3) return p1;
  if (digits.length <= 6) return `${p1}.${p2}`;
  if (digits.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Envia o CPF já formatado (000.000.000-00), como você pediu
      const data = await apiFetch<LoginResponse>("/usuarios/entrar", {
        method: "POST",
        body: JSON.stringify({ cpf, senha }),
      });

      setToken(data.token);
      window.dispatchEvent(new Event("auth-change"));
      router.push("/usuarios");
    } catch (err: any) {
      setError(err.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-brand-secondary">Entrar</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 p-6">
        <Input
          label="CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
        />

        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <Button type="submit" className="bg-gray-200">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
