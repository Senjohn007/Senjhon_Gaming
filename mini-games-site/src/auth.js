// src/auth.js
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("authUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("authUser");
}
