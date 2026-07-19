"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function NewDocumentPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Document");
  const [size, setSize] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) setName(selectedFile.name);
      const sizeInKB = Math.round(selectedFile.size / 1024);
      setSize(sizeInKB > 1024 ? (sizeInKB / 1024).toFixed(1) + " MB" : sizeInKB + " KB");
      const ext = selectedFile.name.split(".").pop()?.toUpperCase() || "Document";
      setType(ext);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let fileUrl = "";
      
      // Upload file if selected
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          fileUrl = uploadData.url;
        }
        setUploading(false);
      }

      // Create document record
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || (file ? file.name : "Untitled"), size, type, url: fileUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Document created! Redirecting...");
        setTimeout(() => router.push("/dashboard/documents"), 1000);
      } else {
        setError(data.error || "Failed to create document");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  if (status === "loading") return <p style={{ textAlign: "center", padding: "48px" }}>Loading...</p>;
  if (!session?.user) return null;

  const isDark = theme === "dark";
  const bg = isDark ? "#1f2937" : "white";
  const border = isDark ? "#374151" : "#e5e7eb";
  const text = isDark ? "#f9fafb" : "#111827";
  const sub = isDark ? "#9ca3af" : "#6b7280";
  const inputBg = isDark ? "#374151" : "white";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: text, marginBottom: "8px" }}>Add Document</h1>
      <p style={{ color: sub, marginBottom: "24px" }}>Upload a new document or create a record.</p>

      {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>❌ {error}</div>}
      {message && <div style={{ padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px", marginBottom: "16px" }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ background: bg, borderRadius: "12px", border: "1px solid " + border, padding: "32px" }}>
        {/* File Upload */}
        <div style={{ textAlign: "center", marginBottom: "24px", padding: "32px", border: "2px dashed " + border, borderRadius: "8px", cursor: "pointer" }} onClick={() => fileInputRef.current?.click()}>
          <p style={{ fontSize: "48px", marginBottom: "8px" }}>📁</p>
          <p style={{ fontWeight: "600", color: text, marginBottom: "4px" }}>{file ? file.name : "Click to upload a file"}</p>
          <p style={{ fontSize: "14px", color: sub }}>{file ? formatSize(size) : "or enter details manually below"}</p>
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} style={{ display: "none" }} />
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Document Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Enter document name" style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: inputBg, color: text, fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: inputBg, color: text, fontSize: "14px", boxSizing: "border-box" }}>
                <option>Document</option><option>PDF</option><option>Word</option><option>Excel</option><option>PowerPoint</option><option>Image</option><option>Video</option><option>Archive</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: text, marginBottom: "4px" }}>Size</label>
              <input value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. 2.4 MB" style={{ width: "100%", padding: "10px 12px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "6px", background: inputBg, color: text, fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button type="submit" disabled={loading || uploading} style={{ flex: 1, padding: "12px", background: (loading || uploading) ? "#6b7280" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: (loading || uploading) ? "not-allowed" : "pointer" }}>
            {uploading ? "Uploading..." : loading ? "Creating..." : "Create Document"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ padding: "12px 24px", border: "1px solid " + (isDark ? "#4b5563" : "#d1d5db"), borderRadius: "8px", background: "transparent", color: text, fontSize: "16px", cursor: "pointer" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function formatSize(size: string) {
  if (!size) return "";
  const num = parseInt(size);
  if (isNaN(num)) return size;
  if (num > 1024 * 1024) return (num / (1024 * 1024)).toFixed(1) + " MB";
  if (num > 1024) return (num / 1024).toFixed(1) + " KB";
  return num + " B";
}