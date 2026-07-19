"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchNotifs();
  }, [status]);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifs(data.notifications || []);
        setUnread(data.unread || 0);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications/" + id, { method: "PUT" });
      setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      setNotifs(notifs.map(n => ({ ...n, read: true })));
      setUnread(0);
      setMessage("All notifications marked as read!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); }
  };

  const deleteNotif = async (id: string) => {
    try {
      await fetch("/api/notifications/" + id, { method: "DELETE" });
      const updated = notifs.filter(n => n.id !== id);
      setNotifs(updated);
      setUnread(updated.filter(n => !n.read).length);
      setMessage("Notification deleted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); }
  };

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
      case "warning": return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
      case "error": return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
      default: return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "success": return { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981", border: "rgba(16, 185, 129, 0.2)" };
      case "warning": return { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.2)" };
      case "error": return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444", border: "rgba(239, 68, 68, 0.2)" };
      default: return { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.2)" };
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    if (hours < 24) return hours + "h ago";
    if (days < 7) return days + "d ago";
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (status === "loading" || loading) {
    return (
      <div className="notif-loading">
        <div className="loading-pulse">
          <div className="pulse-ring" />
          <div className="pulse-ring delay" />
          <div className="pulse-ring delay-2" />
        </div>
        <p>Loading notifications...</p>
        <style jsx>{`
          .notif-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 24px;
          }
          .loading-pulse {
            position: relative;
            width: 48px;
            height: 48px;
          }
          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid var(--accent);
            animation: pulse-ring 1.5s ease-out infinite;
          }
          .delay { animation-delay: 0.5s; }
          .delay-2 { animation-delay: 1s; }
          @keyframes pulse-ring {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          p {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
          }
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
          --bg-card: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          --bg-card-hover: ${isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)'};
          --bg-input: ${isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'};
          --border-color: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          --border-color-strong: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
          --accent: #6366f1;
          --shadow-lg: ${isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)'};
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div className="notifications-container">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-grid" />
        </div>

        {/* Header */}
        <div className="notifications-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h1 className="notifications-title">Notifications</h1>
                <p className="notifications-subtitle">
                  {unread > 0 
                    ? `You have ${unread} unread notification${unread !== 1 ? "s" : ""}` 
                    : "You're all caught up! 🎉"}
                </p>
              </div>
            </div>
            <div className="header-actions">
              {/* Filter Tabs */}
              <div className="filter-tabs">
                <button 
                  onClick={() => setFilter("all")} 
                  className={`filter-tab ${filter === "all" ? "active" : ""}`}
                >
                  All
                  <span className="tab-count">{notifs.length}</span>
                </button>
                <button 
                  onClick={() => setFilter("unread")} 
                  className={`filter-tab ${filter === "unread" ? "active" : ""}`}
                >
                  Unread
                  <span className="tab-count">{notifs.filter(n => !n.read).length}</span>
                </button>
                <button 
                  onClick={() => setFilter("read")} 
                  className={`filter-tab ${filter === "read" ? "active" : ""}`}
                >
                  Read
                  <span className="tab-count">{notifs.filter(n => n.read).length}</span>
                </button>
              </div>
              
              {unread > 0 && (
                <button onClick={markAllRead} className="mark-all-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div className="toast-message">
            <div className="toast-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>{message}</span>
            <button className="toast-close" onClick={() => setMessage("")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-card">
          <div className="card-glow" />
          
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
              </div>
              <h3 className="empty-title">No notifications</h3>
              <p className="empty-subtitle">
                {filter !== "all" 
                  ? `You have no ${filter} notifications.` 
                  : "You're all caught up! We'll notify you when something arrives."}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filtered.map((n: any, i: number) => {
                const color = getColor(n.type);
                return (
                  <div
                    key={n.id}
                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <div className="notification-left">
                      <div 
                        className="notification-icon" 
                        style={{ 
                          background: color.bg, 
                          color: color.text,
                          border: `1px solid ${color.border}`
                        }}
                      >
                        {getIcon(n.type)}
                      </div>
                      
                      {!n.read && (
                        <div className="unread-dot" />
                      )}
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-header">
                        <h3 className="notification-title">{n.title}</h3>
                        <span className="notification-time">{formatTime(n.createdAt)}</span>
                      </div>
                      <p className="notification-message">{n.message}</p>
                      
                      <div className="notification-footer">
                        <span className={`notification-type ${n.type}`}>
                          <span className="type-dot" style={{ background: color.text }} />
                          {n.type || "info"}
                        </span>
                        
                        {n.link && (
                          <a 
                            href={n.link} 
                            className="notification-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="notification-actions">
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                          className="action-btn mark-read-btn"
                          title="Mark as read"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                        className="action-btn delete-btn"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .notifications-container {
          min-height: 100vh;
          padding: 40px 32px;
          position: relative;
          background: var(--bg-primary);
          transition: all 0.3s ease;
        }

        /* Background Decorations */
        .bg-decoration {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
        }

        .bg-blob-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: -200px;
          right: -200px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          bottom: -150px;
          left: -150px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(var(--border-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, -80px) scale(0.9); }
          75% { transform: translate(-60px, 30px) scale(1.05); }
        }

        /* Notifications Header */
        .notifications-header {
          position: relative;
          z-index: 1;
          margin-bottom: 24px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
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
          color: var(--accent);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .notifications-title {
          font-size: 34px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }

        .notifications-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 4px;
          gap: 2px;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-tab:hover {
          color: var(--text-primary);
          background: var(--bg-input);
        }

        .filter-tab.active {
          background: var(--accent);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .tab-count {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.2);
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }

        .filter-tab:not(.active) .tab-count {
          background: var(--bg-input);
          color: var(--text-secondary);
        }

        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .mark-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        /* Toast Message */
        .toast-message {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto 20px;
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(20px);
          animation: slideIn 0.4s ease-out;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .toast-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-close {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          opacity: 0.6;
          transition: all 0.2s ease;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Notifications Card */
        .notifications-card {
          position: relative;
          z-index: 1;
          background: var(--bg-card);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3), transparent);
          opacity: 0.8;
          z-index: 1;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }

        .empty-icon-wrapper {
          margin-bottom: 24px;
        }

        .empty-icon {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .empty-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
          max-width: 400px;
        }

        /* Notifications List */
        .notifications-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          gap: 16px;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          border-bottom: 1px solid var(--border-color);
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: var(--bg-input);
        }

        .notification-item.unread {
          background: ${isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.03)'};
        }

        .notification-item.unread:hover {
          background: ${isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.05)'};
        }

        .notification-left {
          position: relative;
          flex-shrink: 0;
        }

        .notification-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .notification-item:hover .notification-icon {
          transform: scale(1.1);
        }

        .unread-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid var(--bg-card);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.1); }
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 6px;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .notification-time {
          font-size: 12px;
          color: var(--text-tertiary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .notification-message {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .notification-footer {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-type {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          color: var(--text-secondary);
        }

        .type-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .notification-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .notification-link:hover {
          color: #4f46e5;
          gap: 6px;
        }

        /* Notification Actions */
        .notification-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
          flex-shrink: 0;
        }

        .notification-item:hover .notification-actions {
          opacity: 1;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: transparent;
        }

        .mark-read-btn {
          color: #10b981;
        }

        .mark-read-btn:hover {
          background: rgba(16, 185, 129, 0.1);
        }

        .delete-btn {
          color: #ef4444;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .notifications-container {
            padding: 24px 16px;
          }

          .notifications-title {
            font-size: 28px;
          }

          .header-content {
            flex-direction: column;
          }

          .header-actions {
            align-items: stretch;
            width: 100%;
          }

          .filter-tabs {
            justify-content: center;
          }

          .notification-item {
            padding: 16px;
            gap: 12px;
          }

          .notification-actions {
            opacity: 1;
          }

          .notification-header {
            flex-direction: column;
            gap: 4px;
          }

          .notification-time {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .notifications-title {
            font-size: 24px;
          }

          .filter-tab {
            padding: 6px 12px;
            font-size: 13px;
          }

          .notification-item {
            padding: 12px;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .notification-title {
            font-size: 14px;
          }

          .notification-footer {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}