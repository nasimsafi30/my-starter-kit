"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchDocs();
  }, [status]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/documents/" + id, { method: "DELETE" });
      if (res.ok) {
        setDocs(docs.filter(d => d.id !== id));
        setMessage("Document deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) { console.error(err); }
    setShowDelete(null);
  };

  const getFileDetails = (type: string) => {
    if (!type) return { icon: "📄", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)", label: "File" };
    const t = type.toLowerCase();
    if (t.includes("pdf")) return { icon: "📕", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", label: "PDF" };
    if (t.includes("word") || t.includes("doc")) return { icon: "📝", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", label: "Document" };
    if (t.includes("excel") || t.includes("sheet") || t.includes("xls")) return { icon: "📊", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", label: "Spreadsheet" };
    if (t.includes("power") || t.includes("present") || t.includes("ppt")) return { icon: "📽️", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", label: "Presentation" };
    if (t.includes("image") || t.includes("jpg") || t.includes("png") || t.includes("gif")) return { icon: "🖼️", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)", label: "Image" };
    if (t.includes("video") || t.includes("mp4") || t.includes("mov")) return { icon: "🎬", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)", label: "Video" };
    if (t.includes("zip") || t.includes("rar") || t.includes("tar")) return { icon: "📦", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)", label: "Archive" };
    return { icon: "📄", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)", label: "File" };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatSize = (size: string) => {
    if (!size) return "Unknown";
    const num = parseInt(size);
    if (isNaN(num)) return size;
    if (num > 1024 * 1024) return (num / (1024 * 1024)).toFixed(1) + " MB";
    if (num > 1024) return (num / 1024).toFixed(1) + " KB";
    return num + " B";
  };

  // Filter and sort logic
  const filteredDocs = useMemo(() => {
    return docs
      .filter(doc => !search || doc.name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "size") return (parseInt(b.size) || 0) - (parseInt(a.size) || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [docs, search, sortBy]);

  const stats = useMemo(() => {
    const totalSize = docs.reduce((acc, doc) => acc + (parseInt(doc.size) || 0), 0);
    const types = new Set(docs.map(d => d.type).filter(Boolean));
    const recent = docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return {
      count: docs.length,
      size: formatSize(totalSize.toString()),
      types: types.size,
      recent: recent ? formatDate(recent.createdAt) : "N/A",
    };
  }, [docs]);

  if (status === "loading" || loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading documents...</p>
        <style jsx>{`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 16px;
            color: var(--text-secondary);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }
  if (!session?.user) return null;

  const isDark = theme === "dark";

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: ${isDark ? '#0a0a0b' : '#f8fafc'};
          --bg-card: ${isDark ? '#111827' : '#ffffff'};
          --bg-elevated: ${isDark ? '#1e293b' : '#f1f5f9'};
          --border-color: ${isDark ? '#1e293b' : '#e2e8f0'};
          --border-hover: ${isDark ? '#334155' : '#cbd5e1'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
          --accent: #3b82f6;
          --accent-light: rgba(59, 130, 246, 0.1);
          --accent-border: rgba(59, 130, 246, 0.2);
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 24px;
        }
        * { box-sizing: border-box; }
        body { background: var(--bg-primary); }
      `}</style>

      <div className="documents-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="page-title">Documents</h1>
              <p className="page-subtitle">Manage and organize your files</p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => router.push("/dashboard/documents/new")} className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Document
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {message && (
          <div className="toast">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {message}
          </div>
        )}

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { label: "Documents", value: stats.count, icon: "📄", color: "#3b82f6" },
            { label: "Total Size", value: stats.size, icon: "💾", color: "#8b5cf6" },
            { label: "File Types", value: stats.types, icon: "🏷️", color: "#10b981" },
            { label: "Last Upload", value: stats.recent, icon: "📅", color: "#f59e0b" },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="search-input"
            />
            {search && (
              <button onClick={() => setSearch("")} className="search-clear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="toolbar-controls">
            <div className="sort-select">
              <label>Sort by:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredDocs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No documents found</h3>
            <p>{search ? "Try adjusting your search." : "Upload your first document to get started."}</p>
            {!search && (
              <button onClick={() => router.push("/dashboard/documents/new")} className="btn-primary">Upload Document</button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="documents-grid">
            {filteredDocs.map(doc => {
              const file = getFileDetails(doc.type);
              return (
                <div key={doc.id} className="doc-card" onClick={() => router.push("/dashboard/documents/" + doc.id)}>
                  <div className="doc-card-header">
                    <div className="file-icon" style={{ background: file.bg, color: file.color }}>{file.icon}</div>
                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push("/dashboard/documents/" + doc.id)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => setShowDelete(doc.id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h4 className="doc-name">{doc.name || "Untitled"}</h4>
                  <div className="doc-meta">
                    <span className="file-type-badge" style={{ background: file.bg, color: file.color }}>{file.label}</span>
                    {doc.size && <span>{formatSize(doc.size)}</span>}
                  </div>
                  <div className="doc-footer">
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="documents-list">
            {filteredDocs.map((doc, i) => {
              const file = getFileDetails(doc.type);
              return (
                <div key={doc.id} className="list-item" onClick={() => router.push("/dashboard/documents/" + doc.id)}>
                  <div className="file-icon" style={{ background: file.bg, color: file.color }}>{file.icon}</div>
                  <div className="item-info">
                    <h4>{doc.name || "Untitled"}</h4>
                    <div className="item-meta">
                      <span className="file-type-badge" style={{ background: file.bg, color: file.color }}>{file.label}</span>
                      {doc.size && <span>{formatSize(doc.size)}</span>}
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                  </div>
                  <div className="item-actions" onClick={e => e.stopPropagation()}>
                    <button onClick={() => router.push("/dashboard/documents/" + doc.id)}>Edit</button>
                    <button onClick={() => setShowDelete(doc.id)} className="danger">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Modal */}
        {showDelete && (
          <div className="modal-overlay" onClick={() => setShowDelete(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-icon">🗑️</div>
              <h3>Delete Document?</h3>
              <p>Are you sure you want to delete &ldquo;{docs.find(d => d.id === showDelete)?.name}&rdquo;? This cannot be undone.</p>
              <div className="modal-actions">
                <button onClick={() => handleDelete(showDelete)} className="btn-danger">Delete</button>
                <button onClick={() => setShowDelete(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .documents-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        /* Toast */
        .toast {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          font-weight: 500;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-box svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 44px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .search-clear:hover { color: var(--text-primary); }

        .toolbar-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .sort-select {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-select label {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .sort-select select {
          padding: 8px 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
          padding: 3px;
        }

        .view-btn {
          padding: 8px;
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: var(--bg-card);
          color: var(--accent);
          box-shadow: var(--shadow-sm);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 24px 0;
        }

        /* Grid View */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .doc-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .doc-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .doc-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .file-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .card-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .doc-card:hover .card-actions { opacity: 1; }

        .card-actions button {
          padding: 6px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .card-actions button:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
        }

        .doc-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 12px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .doc-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .file-type-badge {
          padding: 2px 8px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
        }

        .doc-footer {
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          font-size: 12px;
          color: var(--text-tertiary);
        }

        /* List View */
        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .list-item:hover {
          background: var(--bg-elevated);
        }

        .list-item .file-icon {
          width: 40px;
          height: 40px;
          font-size: 18px;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-info h4 {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .item-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .item-actions button {
          padding: 6px 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .item-actions button:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .item-actions button.danger {
          color: var(--danger);
          border-color: var(--danger);
          opacity: 0.6;
        }

        .item-actions button.danger:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-card {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 40px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .modal-icon { font-size: 56px; margin-bottom: 16px; }

        .modal-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .modal-card p {
          color: var(--text-secondary);
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-danger {
          padding: 12px 24px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-danger:hover {
          filter: brightness(1.1);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: var(--bg-elevated);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .documents-page { padding: 24px 16px; }
          .page-title { font-size: 24px; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .documents-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}