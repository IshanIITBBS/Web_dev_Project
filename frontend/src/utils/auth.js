// src/utils/auth.js
export async function checkAuthStatus() {
  try {
    const res = await fetch("http://localhost:5000/auth/status", {
      credentials: "include", // 👈 important for cookies/session
    });

    if (!res.ok) throw new Error("Failed to fetch auth status");

    const data = await res.json();
    return data; // { isLoggedIn: true/false, user: {...}? }
  } catch (err) {
    console.error("Auth check failed:", err);
    return { isLoggedIn: false };
  }
}

// src/utils/csrf.js

export async function fetchCsrfToken() {
  try {
    const res = await fetch("http://localhost:5000/get-csrf-token", {
      credentials: "include", // important for cookies/session
    });

    if (!res.ok) throw new Error("Failed to fetch CSRF token");

    const data = await res.json();
    return data.csrfToken;
  } catch (err) {
    console.error("Error fetching CSRF:", err);
    return null;
  }
}

