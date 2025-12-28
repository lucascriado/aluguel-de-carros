"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Usuario } from "@/lib/types";

export default function UsersPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/entrar");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<Usuario[]>("/usuarios/lista", { auth: true });
        setUsuarios(data);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar usuários");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-brand-secondary">Usuários</h1>

      {loading && <div className="text-slate-600">Carregando...</div>}
      {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-brand-secondary">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">CPF</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="px-4 py-3">{u.nome}</td>
                  <td className="px-4 py-3">{u.cpf}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.cargo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
