"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function EditDocumentPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && params.id) {
      fetch("/api/documents/" + params.id).then(r => r.json()).then(d => {
        if (d.document) {
          setName(d.document.name || "");
          setType(d.document.type || "");
          setSize(d.document.size || "");
          setUrl(d.document.url || "");
        }
      });
    }
  }, [status, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await fetch("/api/documents/" + params.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, size, url }),
      });
      const data = await res.json();
      if (res.ok) { setMessage("Updated! Redirecting..."); setTimeout(() => router.push("/dashboard/documents"), 1000); }
      else { setError(data.error || "Failed"); }
    } catch (err) { setError("Network error"); }
    setLoading(false);
  };

  if (status === "loading") return <p style={{ textAlign: "center", padding: "48px" }}>Loading...</p>;
  if (!session?.user) return null;

  const isDark = theme === "dark";
  const bg = isDark ? "#1f2937" : "white";
  const border = isDark ? "#374151" : "#e5e7eb";
  const text = isDark ? "#f9fafb" : "#111827";
  const sub = isDark ? "#9ca3af" : "#6b7280";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: text, marginBottom: "24px" }}>Edit Document</h1>
      {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>❌ {error}</div>}
      {message && <div style={{ padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px", marginBottom: "16px" }}>{message}</div>}
      <form onSubmit={handleSubmit} style={{ background: bg, borderRadius: "12px", border: "1px solid " + border, padding: "32px" }}>
        <div style={{ marginBottom: "16px" }}><label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Name *</label><input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: isDark ? "#374151" : "white", color: text, fontSize: "14px", boxSizing: "border-box" }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div><label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Type</label><input value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: isDark ? "#374151" : "white", color: text, fontSize: "14px", boxSizing: "border-box" }} /></div>
          <div><label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Size</label><input value={size} onChange={e => setSize(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: isDark ? "#374151" : "white", color: text, fontSize: "14px", boxSizing: "border-box" }} /></div>
        </div>
        <div style={{ marginBottom: "24px" }}><label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>URL</label><input value={url} onChange={e => setUrl(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: isDark ? "#374151" : "white", color: text, fontSize: "14px", boxSizing: "border-box" }} /></div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", background: loading ? "#6b7280" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Saving..." : "Save Changes"}</button>
          <button type="button" onClick={() => router.back()} style={{ padding: "12px 24px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "8px", background: "transparent", color: text, fontSize: "16px", cursor: "pointer" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}