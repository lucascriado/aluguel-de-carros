"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, isLoggedIn } from "@/lib/auth";
import { Car, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logged, setLogged] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const loggedIn = isLoggedIn();
      setLogged(loggedIn);

      if (loggedIn) {
        setUserName(localStorage.getItem("userName"));
      } else {
        setUserName(null);
      }
    };

    syncAuth();
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  const handleAuthClick = () => {
    if (logged) {
      clearToken();
      window.dispatchEvent(new Event("auth-change"));
    }
    router.push("/entrar");
  };

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-brand-secondary"
        >
          <Car className="h-5 w-5 rounded-md bg-brand-primary/20 p-0.5" />
          <span>Aluguel de Carros</span>
        </Link>

        <nav className="flex items-center gap-3">
          {logged && userName && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-brand-secondary">
              <User className="h-4 w-4 opacity-70" />
              <span>{userName}</span>
            </div>
          )}

          {logged === null ? null : logged ? (
            <button
              onClick={handleAuthClick}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-secondary hover:bg-slate-100"
            >
              Sair
            </button>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-secondary hover:bg-slate-100"
              >
                Entrar
              </Link>

              <Link
                href="/cadastrar"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-secondary hover:bg-slate-100"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );

}
