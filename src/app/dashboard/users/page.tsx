"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchUsers();
  }, [status]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/users/" + id, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setMessage("User deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) { console.error(error); }
    setShowDelete(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      if (search) {
        const s = search.toLowerCase();
        if (!(u.name || "").toLowerCase().includes(s) && !(u.email || "").toLowerCase().includes(s)) {
          return false;
        }
      }
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const getImgUrl = (img: string | null) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return "/" + img;
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return name[0].toUpperCase();
    }
    if (email) return email[0].toUpperCase();
    return "U";
  };

  const avatarColors = [
    { bg: "#e0e7ff", text: "#4338ca" },
    { bg: "#fce7f3", text: "#be185d" },
    { bg: "#d1fae5", text: "#065f46" },
    { bg: "#fef3c7", text: "#92400e" },
    { bg: "#f3e8ff", text: "#6b21a8" },
    { bg: "#cffafe", text: "#155e75" },
    { bg: "#ffe4e6", text: "#9f1239" },
    { bg: "#e0f2fe", text: "#075985" },
  ];

  const getAvatarColor = (name: string, isDark: boolean) => {
    let hash = 0;
    for (let i = 0; i < (name || "U").length; i++) {
      hash = (hash * 31 + (name || "U").charCodeAt(i)) & 0xFFFFFFFF;
    }
    const colorIndex = Math.abs(hash) % avatarColors.length;
    const color = avatarColors[colorIndex];
    return isDark 
      ? { bg: `${color.text}20`, text: color.text }
      : color;
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const admins = users.filter(u => u.role === "admin").length;
    const inactive = total - active;
    return { total, active, admins, inactive };
  }, [users]);

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading users...</p>
        <style jsx>{`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 16px;
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
          p { color: var(--text-secondary); font-size: 14px; }
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
          --accent: #6366f1;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        * { box-sizing: border-box; }
      `}</style>

      <div className="users-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="page-title">Users</h1>
              <p className="page-subtitle">Manage user accounts and permissions</p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={fetchUsers} className="btn-secondary" title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh
            </button>
            {session.user.role === "admin" && (
              <button onClick={() => router.push("/dashboard/users/new")} className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Toast */}
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
            { label: "Total Users", value: stats.total, icon: "👥", color: "#6366f1" },
            { label: "Active", value: stats.active, icon: "🟢", color: "#10b981" },
            { label: "Admins", value: stats.admins, icon: "🛡️", color: "#f59e0b" },
            { label: "Inactive", value: stats.inactive, icon: "⏸️", color: "#ef4444" },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15` }}>{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
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
              placeholder="Search by name or email..."
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
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="filter-select">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Users Content */}
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>{search || roleFilter !== "all" || statusFilter !== "all" ? "Try adjusting your filters." : "No users in the system yet."}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="users-grid">
            {filteredUsers.map(user => {
              const imgUrl = getImgUrl(user.image);
              const initials = getInitials(user.name, user.email);
              const avatarColor = getAvatarColor(user.name || user.email || "U", isDark);
              
              return (
                <div key={user.id} className="user-card" onClick={() => router.push("/dashboard/users/" + user.id)}>
                  <div className="user-card-header">
                    <div className="user-avatar" style={{ background: avatarColor.bg, color: avatarColor.text }}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={user.name} onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) parent.textContent = initials;
                        }} />
                      ) : initials}
                    </div>
                    <div className="user-status-dot" style={{ background: user.isActive ? "#10b981" : "#ef4444" }} title={user.isActive ? "Active" : "Inactive"} />
                  </div>
                  <h4 className="user-name">{user.name || "Unnamed User"}</h4>
                  <p className="user-email">{user.email || "No email"}</p>
                  <div className="user-badges">
                    <span className={`badge badge-role ${user.role}`}>{user.role}</span>
                    <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {user.createdAt && (
                    <p className="user-date">Joined {formatDate(user.createdAt)}</p>
                  )}
                  {session.user.role === "admin" && (
                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push("/dashboard/users/" + user.id)} className="action-btn">Edit</button>
                      <button onClick={() => setShowDelete(user.id)} className="action-btn danger">Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="users-list">
            {filteredUsers.map((user, i) => {
              const imgUrl = getImgUrl(user.image);
              const initials = getInitials(user.name, user.email);
              const avatarColor = getAvatarColor(user.name || user.email || "U", isDark);
              
              return (
                <div key={user.id} className="list-item" onClick={() => router.push("/dashboard/users/" + user.id)}>
                  <div className="user-avatar" style={{ background: avatarColor.bg, color: avatarColor.text }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={user.name} onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) parent.textContent = initials;
                      }} />
                    ) : initials}
                  </div>
                  <div className="item-info">
                    <div className="item-name-row">
                      <h4>{user.name || "Unnamed User"}</h4>
                      <span className={`badge badge-role ${user.role}`}>{user.role}</span>
                      <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="item-email">{user.email || "No email"}</p>
                  </div>
                  {session.user.role === "admin" && (
                    <div className="item-actions" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push("/dashboard/users/" + user.id)}>Edit</button>
                      <button onClick={() => setShowDelete(user.id)} className="danger">Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Modal */}
        {showDelete && (
          <div className="modal-overlay" onClick={() => setShowDelete(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-icon">⚠️</div>
              <h3>Delete User?</h3>
              <p>Are you sure you want to delete <strong>{users.find(u => u.id === showDelete)?.name || users.find(u => u.id === showDelete)?.email}</strong>? This action cannot be undone.</p>
              <div className="modal-actions">
                <button onClick={() => handleDelete(showDelete)} className="btn-danger">Delete User</button>
                <button onClick={() => setShowDelete(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .users-page {
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
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 4px 0;
        }

        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
          background: var(--bg-elevated);
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
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
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
          border-radius: 12px;
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
          font-size: 24px;
          font-weight: 800;
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

        .search-box > svg {
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
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
        }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
          gap: 12px;
          align-items: center;
        }

        .filter-select {
          padding: 10px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
          outline: none;
        }

        .view-toggle {
          display: flex;
          background: var(--bg-elevated);
          border-radius: 8px;
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
          color: #6366f1;
          box-shadow: var(--shadow-sm);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
        }

        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
        .empty-state p { color: var(--text-secondary); margin: 0; }

        /* Grid View */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .user-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .user-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .user-card-header {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          position: relative;
        }

        .user-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          overflow: hidden;
          border: 3px solid var(--border-color);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-status-dot {
          position: absolute;
          bottom: 4px;
          right: calc(50% - 40px);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid var(--bg-card);
        }

        .user-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 16px 0;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-badges {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 12px;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .badge-role.admin { background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2); }
        .badge-role.moderator { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .badge-role.user { background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border-color); }
        .badge-active { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .badge-inactive { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        .user-date {
          text-align: center;
          font-size: 12px;
          color: var(--text-tertiary);
          margin: 0 0 12px 0;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .user-card:hover .card-actions { opacity: 1; }

        .action-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .action-btn.danger {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .action-btn.danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* List View */
        .users-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
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

        .list-item .user-avatar {
          width: 44px;
          height: 44px;
          font-size: 16px;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .item-name-row h4 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-email {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .item-actions button {
          padding: 6px 14px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
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
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .item-actions button.danger:hover {
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
          border-radius: 20px;
          padding: 40px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .modal-icon { font-size: 56px; margin-bottom: 16px; }
        .modal-card h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
        .modal-card p { color: var(--text-secondary); margin: 0 0 24px 0; line-height: 1.5; }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-danger {
          padding: 12px 24px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-danger:hover { filter: brightness(1.1); }

        /* Responsive */
        @media (max-width: 768px) {
          .users-page { padding: 24px 16px; }
          .page-title { font-size: 24px; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .users-grid { grid-template-columns: 1fr; }
          .header-icon { width: 48px; height: 48px; border-radius: 12px; }
        }
      `}</style>
    </>
  );
}