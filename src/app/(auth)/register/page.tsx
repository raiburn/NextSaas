"use client";

import { useMemo, useState } from "react";
import { z } from "zod";

const RegisterSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos 1 mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos 1 minúscula")
      .regex(/[0-9]/, "Debe incluir al menos 1 número")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos 1 símbolo"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FieldErrors = Partial<Record<"email" | "password" | "confirmPassword", string>>;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0 && !loading;
  }, [email, password, confirmPassword, loading]);

  function validate(): boolean {
    const parsed = RegisterSchema.safeParse({ email, password, confirmPassword });

    if (parsed.success) {
      setFieldErrors({});
      setFormError(null);
      return true;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors | undefined;
      if (key && !nextErrors[key]) nextErrors[key] = issue.message;
    }

    setFieldErrors(nextErrors);
    setFormError(null);
    return false;
  }

  async function onSubmit() {
    if (!validate()) return;

    setLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Manejo de errores conocidos del backend
        if (res.status === 409) {
          setFieldErrors((prev) => ({ ...prev, email: "Ese email ya está en uso" }));
        } else {
          setFormError(data?.error ?? "No se pudo crear la cuenta");
        }
        setLoading(false);
        return;
      }

      // Cookie httpOnly ya quedó, entra directo
      window.location.href = "/dashboard";
    } catch (e) {
      setFormError("Error de red. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    width: "100%",
  };

  const errorStyle: React.CSSProperties = { margin: 0, color: "crimson", fontSize: 13 };

  return (
    <main style={{ padding: 24, display: "grid", gap: 12, maxWidth: 440 }}>
      <h1 style={{ margin: 0 }}>Create account</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>
        Crea tu cuenta y entra al dashboard.
      </p>

      <label style={{ display: "grid", gap: 6 }}>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validate}
          placeholder="you@company.com"
          style={inputStyle}
        />
        {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validate}
          placeholder="Strong password"
          style={inputStyle}
        />
        {fieldErrors.password && <p style={errorStyle}>{fieldErrors.password}</p>}
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Confirm password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={validate}
          placeholder="Repeat password"
          style={inputStyle}
        />
        {fieldErrors.confirmPassword && <p style={errorStyle}>{fieldErrors.confirmPassword}</p>}
      </label>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      {formError && <p style={errorStyle}>{formError}</p>}

      <p style={{ margin: 0, opacity: 0.7 }}>
        ¿Ya tienes cuenta? <a href="/login">Login</a>
      </p>
    </main>
  );
}