"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  { 
    label: "Profile", 
    href: "/dashboard/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  { 
    label: "Documents", 
    href: "/dashboard/documents",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  { 
    label: "Users", 
    href: "/dashboard/users",
    admin: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  { 
    label: "Notifications", 
    href: "/dashboard/notifications",
    badge: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  { 
    label: "Activity", 
    href: "/dashboard/activity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  { 
    label: "Settings", 
    href: "/dashboard/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  { 
    label: "Help", 
    href: "/dashboard/help",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { data: session } = useSession();
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const initials = (session?.user?.name || session?.user?.email || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  if (!mounted) {
    return (
      <button className="hamburger-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --mobile-sidebar-bg: ${isDark ? '#0f172a' : '#ffffff'};
          --mobile-sidebar-border: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
          --mobile-sidebar-hover: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'};
          --mobile-sidebar-active: ${isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)'};
          --mobile-text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --mobile-text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
        }
      `}</style>

      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`hamburger-btn ${open ? 'open' : ''}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <div className="hamburger-lines">
          <span className="line line-1" />
          <span className="line line-2" />
          <span className="line line-3" />
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside className={`mobile-sidebar ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-brand" onClick={() => setOpen(false)}>
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="brand-text">
              Starter<span className="brand-accent">Kit</span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="close-btn"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="user-section">
          <div className="user-avatar">
            {initials}
          </div>
          <div className="user-info">
            <p className="user-name">{session?.user?.name || "User"}</p>
            <p className="user-email">{session?.user?.email || ""}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-label">Main Menu</p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {active && <span className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <button
            onClick={() => {
              setOpen(false);
              signOut({ redirect: true, redirectTo: "/login" });
            }}
            className="signout-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
          
          <div className="app-info">
            <div className="app-info-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span>StarterKit v1.0.0</span>
          </div>
        </div>
      </aside>

      <style jsx>{`
        /* Hamburger Button */
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid var(--mobile-sidebar-border);
          border-radius: 12px;
          background: var(--mobile-sidebar-bg);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          z-index: 50;
        }

        .hamburger-btn:hover {
          background: var(--mobile-sidebar-hover);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .hamburger-lines {
          width: 20px;
          height: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .line {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--mobile-text-primary);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger-btn.open .line-1 {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger-btn.open .line-2 {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger-btn.open .line-3 {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Sidebar Panel */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100vh;
          height: 100dvh;
          background: var(--mobile-sidebar-bg);
          border-right: 1px solid var(--mobile-sidebar-border);
          z-index: 95;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
        }

        .mobile-sidebar.open {
          transform: translateX(0);
        }

        /* Header */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--mobile-sidebar-border);
          flex-shrink: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .brand-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--mobile-text-primary);
          letter-spacing: -0.5px;
        }

        .brand-accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--mobile-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--mobile-sidebar-hover);
          border-color: var(--mobile-sidebar-border);
          color: var(--mobile-text-primary);
        }

        /* User Section */
        .user-section {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          border-bottom: 1px solid var(--mobile-sidebar-border);
          flex-shrink: 0;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--mobile-text-primary);
          margin: 0 0 2px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          font-size: 12px;
          color: var(--mobile-text-secondary);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .nav-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--mobile-text-secondary);
          padding: 0 12px 12px;
          margin: 0;
          opacity: 0.6;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--mobile-text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          margin-bottom: 2px;
        }

        .nav-item:hover {
          background: var(--mobile-sidebar-hover);
          color: var(--mobile-text-primary);
        }

        .nav-item.active {
          background: var(--mobile-sidebar-active);
          color: #6366f1;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-text {
          flex: 1;
        }

        .nav-badge {
          padding: 2px 8px;
          background: #6366f1;
          color: white;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.4;
          min-width: 20px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }

        .active-indicator {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          border-radius: 2px;
          background: #6366f1;
        }

        /* Footer */
        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid var(--mobile-sidebar-border);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .signout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .app-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: var(--mobile-text-secondary);
        }

        .app-info-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        /* Scrollbar */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: var(--mobile-sidebar-border);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}