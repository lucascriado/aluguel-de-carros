"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";
import type { Usuario } from "@/lib/types";

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

type Cargo = "VENDEDOR" | "ADMIN" | "USUARIO";

export default function RegisterPage() {
  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState<Cargo | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await apiFetch<Usuario>("/usuarios/cadastrar", {
        method: "POST",
        body: JSON.stringify({ cpf, nome, email, senha, cargo }),
      });

      setSuccess("Usuário cadastrado com sucesso.");
      router.push("/usuarios/lista");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-brand-secondary">Cadastrar usuário</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 p-6"
      >
        <Input
          label="CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
        />

        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: João Silva"
        />

        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ex: joao@email.com"
        />

        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Crie uma senha"
        />

        {/* Cargo como SELECT com opções fixas */}
          <label className="text-sm font-medium text-brand-secondary">Cargo</label>
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value as Cargo)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="" disabled>
              Selecione um cargo...
            </option>
            <option value="VENDEDOR">Vendedor</option>
            <option value="ADMIN">Admin</option>
            <option value="USUARIO">Usuário</option>
          </select>

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Botão bem visível */}
        <Button type="submit" className="rounded-xl bg-gray-200 p-3 text-sm">
          {loading ? "Salvando..." : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
}
