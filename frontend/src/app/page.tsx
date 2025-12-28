import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-brand-secondary">Painel</h1>
      <p className="text-slate-600">
        Login, cadastro e listagem de usuários consumindo a API do backend.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/usuarios" className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
          <div className="font-medium text-brand-secondary">Usuários</div>
          <div className="text-sm text-slate-600">Listar (rota protegida)</div>
        </Link>
      </div>
    </div>
  );
}
