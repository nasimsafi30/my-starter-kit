"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/providers/theme-provider";

interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  unreadNotifications: number;
  activeSessions: number;
}

interface ActivityItem {
  id: string;
  action: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalDocuments: 0, unreadNotifications: 0, activeSessions: 0 });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || { totalUsers: 0, totalDocuments: 0, unreadNotifications: 0, activeSessions: 0 });
        setRecentActivity(data.recentActivity || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
      return;
    }
    if (status === "authenticated") {
      fetchDashboard();
      setGreeting(getGreeting());
    }
  }, [status, fetchDashboard, getGreeting]);

  const formatTime = (date: string): string => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    if (hours < 24) return hours + "h ago";
    return d.toLocaleDateString();
  };

  if (status === "loading" || loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-pulse">
          <div className="pulse-ring" />
          <div className="pulse-ring delay" />
          <div className="pulse-ring delay-2" />
        </div>
        <p>Loading your dashboard...</p>
        <style jsx>{`
          .dashboard-loading {
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

  const statCards = [
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "#6366f1",
      bgColor: isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.08)",
      href: "/dashboard/users",
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Documents", 
      value: stats.totalDocuments, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      color: "#10b981",
      bgColor: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)",
      href: "/dashboard/documents",
      trend: "+8%",
      trendUp: true
    },
    { 
      label: "Notifications", 
      value: stats.unreadNotifications, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      color: "#8b5cf6",
      bgColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.08)",
      href: "/dashboard/notifications",
      trend: "3 new",
      trendUp: true
    },
    { 
      label: "Active Now", 
      value: stats.activeSessions, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "#f59e0b",
      bgColor: isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.08)",
      href: "/dashboard/activity",
      trend: "Live",
      trendUp: true
    },
  ];

  const quickActions = [
    { 
      label: "Create Document", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      href: "/dashboard/documents/new",
      color: "#6366f1"
    },
    { 
      label: "Add User", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      href: "/dashboard/users/new",
      admin: true,
      color: "#10b981"
    },
    { 
      label: "View Activity", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      href: "/dashboard/activity",
      color: "#8b5cf6"
    },
    { 
      label: "Settings", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      href: "/dashboard/settings",
      color: "#f59e0b"
    },
  ];

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

      <div className="dashboard-container">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-grid" />
        </div>

        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-content">
            <div className="welcome-text">
              <div className="greeting-row">
                <h1 className="greeting-title">
                  {greeting}, {session.user.name?.split(" ")[0] || "User"}!
                </h1>
                <span className="wave-emoji">👋</span>
              </div>
              <p className="greeting-subtitle">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>
            <div className="date-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat) => (
            <div 
              key={stat.label} 
              className="stat-card"
              onClick={() => router.push(stat.href)}
            >
              <div className="card-glow" />
              <div className="stat-header">
                <div className="stat-icon-wrapper" style={{ background: stat.bgColor, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={`stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {stat.trend}
                </div>
              </div>
              <div className="stat-body">
                <span className="stat-value">{stat.value.toLocaleString()}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-footer">
                <span className="view-details">View details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Activity */}
          <div className="activity-card">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-header-left">
                <div className="header-icon" style={{ background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)', color: '#6366f1' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h2 className="card-title">Recent Activity</h2>
              </div>
              <button 
                onClick={() => router.push("/dashboard/activity")}
                className="view-all-btn"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p>No recent activity</p>
                <span>Your recent actions will appear here</span>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.slice(0, 5).map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot" />
                    <div className="activity-content">
                      <p className="activity-text">{activity.action}</p>
                      <span className="activity-time">{formatTime(activity.createdAt)}</span>
                    </div>
                    {i === 0 && <span className="new-badge">New</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="actions-card">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-header-left">
                <div className="header-icon" style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h2 className="card-title">Quick Actions</h2>
              </div>
            </div>
            
            <div className="actions-grid">
              {quickActions.map((action) => {
                if (action.admin && session.user.role !== "admin") return null;
                return (
                  <button 
                    key={action.label} 
                    onClick={() => router.push(action.href)}
                    className="action-btn"
                  >
                    <div className="action-icon" style={{ background: isDark ? `${action.color}1a` : `${action.color}14`, color: action.color }}>
                      {action.icon}
                    </div>
                    <span className="action-label">{action.label}</span>
                    <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
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
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
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

        /* Welcome Header */
        .welcome-header {
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
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

        .welcome-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }

        .greeting-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .greeting-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .wave-emoji {
          font-size: 36px;
          animation: wave 2s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }

        .greeting-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 400;
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .date-badge svg {
          color: var(--accent);
        }

        /* Stats Grid */
        .stats-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .stat-card {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(20px);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: ${isDark ? '0 20px 40px rgba(99, 102, 241, 0.15)' : '0 20px 40px rgba(99, 102, 241, 0.08)'};
          border-color: var(--border-color-strong);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover .card-glow,
        .activity-card:hover .card-glow,
        .actions-card:hover .card-glow {
          opacity: 1;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.1);
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .trend-up {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .trend-down {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .stat-body {
          margin-bottom: 20px;
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .view-details {
          font-size: 13px;
          color: var(--accent);
          font-weight: 600;
        }

        .stat-footer svg {
          color: var(--accent);
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-footer svg {
          transform: translateX(4px);
        }

        /* Content Grid */
        .content-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        /* Activity & Actions Cards */
        .activity-card,
        .actions-card {
          background: var(--bg-card);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .activity-card:hover,
        .actions-card:hover {
          box-shadow: ${isDark ? '0 20px 40px rgba(99, 102, 241, 0.15)' : '0 20px 40px rgba(99, 102, 241, 0.08)'};
          border-color: var(--border-color-strong);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid var(--border-color-strong);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover {
          background: var(--bg-input);
          color: var(--text-primary);
          border-color: var(--text-tertiary);
        }

        .view-all-btn svg {
          transition: transform 0.2s ease;
        }

        .view-all-btn:hover svg {
          transform: translateX(3px);
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          margin-bottom: 16px;
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .empty-state span {
          font-size: 14px;
          color: var(--text-tertiary);
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
        }

        .activity-item:hover {
          background: var(--bg-input);
        }

        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-text {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          margin: 0 0 2px 0;
        }

        .activity-time {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .new-badge {
          padding: 3px 10px;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Quick Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-btn:hover {
          background: var(--bg-input);
          border-color: var(--border-color-strong);
          transform: translateX(4px);
        }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action-btn:hover .action-icon {
          transform: scale(1.1);
        }

        .action-label {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .action-arrow {
          color: var(--text-tertiary);
          flex-shrink: 0;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateX(-8px);
        }

        .action-btn:hover .action-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .dashboard-container {
            padding: 24px 16px;
          }

          .greeting-title {
            font-size: 28px;
          }

          .wave-emoji {
            font-size: 28px;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .welcome-content {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .greeting-title {
            font-size: 22px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}