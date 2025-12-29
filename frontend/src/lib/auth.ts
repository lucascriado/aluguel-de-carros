export const TOKEN_KEY = "token";
export const NAME_KEY = "userName"

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setName(name: string) {
  localStorage.setItem(NAME_KEY, name);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
