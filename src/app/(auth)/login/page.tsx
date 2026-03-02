"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("oscar@example.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    setError(null);
  
    console.log("SUBMIT", { email, password });
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        redirect: "follow",
      });
      
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
  
      console.log("LOGIN RES STATUS", res.status);
  
      const data = await res.json().catch(() => ({}));
      console.log("LOGIN RES DATA", data);
  
      if (!res.ok) {
        setError(data?.error ?? "Login failed");
        setLoading(false);
        return;
      }
  
      router.replace("/dashboard");
    } catch (e) {
      console.log("FETCH ERROR", e);
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 12, maxWidth: 420 }}>
      <h1 style={{ margin: 0 }}>Login</h1>

      <label style={{ display: "grid", gap: 6 }}>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 10 }} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />
      </label>

      <button
        type="button"
        onClick={() => {
          console.log("CLICK SIGN IN");
          onSubmit();
        }}
        disabled={loading}
        style={{ padding: 10 }}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p style={{ margin: 0, opacity: 0.7 }}>
        ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
      </p>
      {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}

      <p style={{ margin: 0, opacity: 0.7 }}>
        Demo: oscar@example.com / Password123!
      </p>
    </main>
  );
}