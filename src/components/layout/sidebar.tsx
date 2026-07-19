"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { useState } from "react";

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

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const isDark = theme === "dark";
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const initials = (session?.user?.name || session?.user?.email || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <style jsx global>{`
        :root {
          --sidebar-bg: ${isDark ? '#0f172a' : '#ffffff'};
          --sidebar-border: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
          --sidebar-hover: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'};
          --sidebar-active-bg: ${isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)'};
          --sidebar-active-border: ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'};
          --sidebar-text: ${isDark ? '#94a3b8' : '#64748b'};
          --sidebar-text-active: ${isDark ? '#e2e8f0' : '#6366f1'};
          --sidebar-divider: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
        }
      `}</style>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="collapse-btn"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={`collapse-icon ${collapsed ? 'rotated' : ''}`}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">Main Menu</p>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-label-text">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                      {active && <span className="active-indicator" />}
                    </>
                  )}
                  {collapsed && active && <span className="active-dot" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          {/* User Info */}
          <Link 
            href="/dashboard/profile" 
            className={`user-info ${collapsed ? 'collapsed' : ''}`}
          >
            <div className="user-avatar">
              {initials}
            </div>
            {!collapsed && (
              <div className="user-details">
                <p className="user-name">
                  {session?.user?.name || "User"}
                </p>
                <p className="user-email">
                  {session?.user?.email || ""}
                </p>
              </div>
            )}
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ redirect: true, redirectTo: "/login" })}
            className={`signout-btn ${collapsed ? 'collapsed' : ''}`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <style jsx>{`
        .sidebar {
          width: ${collapsed ? '72px' : '260px'};
          min-height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          padding: 16px 12px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        /* Collapse Button */
        .collapse-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--sidebar-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: all 0.2s;
          align-self: ${collapsed ? 'center' : 'flex-end'};
        }

        .collapse-btn:hover {
          background: var(--sidebar-hover);
          border-color: var(--sidebar-border);
          color: var(--sidebar-text-active);
        }

        .collapse-icon {
          transition: transform 0.3s;
        }

        .collapse-icon.rotated {
          transform: rotate(180deg);
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sidebar-text);
          padding: 8px 12px 4px;
          margin: 0;
          opacity: ${collapsed ? '0' : '0.6'};
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        /* Nav Items */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? '12px' : '10px 14px'};
          border-radius: 12px;
          text-decoration: none;
          color: var(--sidebar-text);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }

        .nav-item:hover {
          background: var(--sidebar-hover);
          color: ${isDark ? '#e2e8f0' : '#334155'};
        }

        .nav-item.active {
          background: var(--sidebar-active-bg);
          color: var(--sidebar-text-active);
          font-weight: 600;
          border: 1px solid var(--sidebar-active-border);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .nav-item:hover .nav-icon {
          transform: ${collapsed ? 'scale(1.1)' : 'translateX(2px)'};
        }

        .nav-item.active .nav-icon {
          color: #6366f1;
        }

        .nav-label-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Badge */
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

        /* Active Indicator (Expanded) */
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

        /* Active Dot (Collapsed) */
        .active-dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6366f1;
        }

        /* Bottom Section */
        .sidebar-bottom {
          border-top: 1px solid var(--sidebar-divider);
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* User Info */
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .user-info:hover {
          background: var(--sidebar-hover);
        }

        .user-info.collapsed {
          justify-content: center;
          padding: 8px 4px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--sidebar-text-active);
          margin: 0 0 1px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 11px;
          color: var(--sidebar-text);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Sign Out Button */
        .signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px;
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

        .signout-btn.collapsed {
          padding: 10px 0;
          border-radius: 12px;
        }

        .signout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.5);
        }

        /* Scrollbar */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: var(--sidebar-border);
          border-radius: 2px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: ${collapsed ? '64px' : '240px'};
          }
        }
      `}</style>
    </>
  );
}