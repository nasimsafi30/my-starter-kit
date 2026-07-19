"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Email</label>
        <input name="email" type="email" required placeholder="name@example.com" style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Password</label>
        <input name="password" type="password" required placeholder="Enter your password" style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", background: loading ? "#9ca3af" : "#111827", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
