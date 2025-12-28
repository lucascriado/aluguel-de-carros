import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL não definido");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "string" ? data : (data?.error || data?.message || "Erro");
    throw new Error(message);
  }

  return data as T;
}
