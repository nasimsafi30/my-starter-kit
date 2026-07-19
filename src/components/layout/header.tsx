"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export function Header() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.image) {
            setProfileImage(data.user.image);
            setImgError(false);
          }
        })
        .catch(() => {});
    }
  }, [status]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ redirect: true, redirectTo: "/login" });
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return "/" + url;
  };

  const initials = (session?.user?.name || session?.user?.email || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarImage = getImageUrl(profileImage);
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = (session?.user as any)?.role || "user";

  return (
    <>
      <style jsx global>{`
        :root {
          --header-bg: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          --header-border: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          --header-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.04)'};
          --header-text: ${isDark ? '#f1f5f9' : '#0f172a'};
          --header-text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --header-hover: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)'};
          --header-accent: #6366f1;
        }
      `}</style>

      <header className="app-header">
        <div className="header-inner">
          {/* Logo Section */}
          <Link href="/dashboard" className="logo-link">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="logo-text">
              Starter<span className="logo-accent">Kit</span>
            </span>
          </Link>

          {/* Right Section */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                  {isDark ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="icon-button"
              title="Notifications"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-dot" />
            </button>

            {/* Help Button */}
            <button
              onClick={() => router.push("/dashboard/help")}
              className="icon-button"
              title="Help Center"
              aria-label="Help"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>

            {/* Divider */}
            <div className="header-divider" />

            {/* Profile Dropdown */}
            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="profile-trigger"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  {avatarImage && !imgError ? (
                    <img
                      src={avatarImage}
                      alt={userName}
                      className="avatar-image"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="avatar-initials">{initials}</span>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{userName}</span>
                  <span className="user-email">{userEmail}</span>
                </div>
                <svg 
                  className={`dropdown-chevron ${showDropdown ? 'open' : ''}`}
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="dropdown-menu">
                  {/* User Info Header */}
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {avatarImage && !imgError ? (
                        <img
                          src={avatarImage}
                          alt={userName}
                          className="avatar-image"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <span className="avatar-initials-large">{initials}</span>
                      )}
                    </div>
                    <div>
                      <p className="dropdown-name">{userName}</p>
                      <p className="dropdown-email">{userEmail}</p>
                      <span className="dropdown-role">{userRole}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  {/* Menu Items */}
                  <button
                    onClick={() => { router.push("/dashboard/profile"); setShowDropdown(false); }}
                    className="dropdown-item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                  </button>

                  <button
                    onClick={() => { router.push("/dashboard/settings"); setShowDropdown(false); }}
                    className="dropdown-item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </button>

                  <button
                    onClick={() => { router.push("/dashboard/help"); setShowDropdown(false); }}
                    className="dropdown-item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Help Center
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    onClick={() => { setShowDropdown(false); handleSignOut(); }}
                    className="dropdown-item logout"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--header-bg);
          border-bottom: 1px solid var(--header-border);
          box-shadow: var(--header-shadow);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          height: 64px;
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--header-text);
          transition: opacity 0.2s;
        }

        .logo-link:hover {
          opacity: 0.8;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .logo-accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Theme Toggle */
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          padding: 2px;
          transition: all 0.3s ease;
          position: relative;
        }

        .toggle-track.light {
          background: #e2e8f0;
        }

        .toggle-track.dark {
          background: #334155;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-track.light .toggle-thumb {
          transform: translateX(0);
          color: #f59e0b;
        }

        .toggle-track.dark .toggle-thumb {
          transform: translateX(20px);
          color: #6366f1;
        }

        /* Icon Buttons */
        .icon-button {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: var(--header-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: var(--header-hover);
          color: var(--header-text);
        }

        .notification-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid ${isDark ? '#111827' : 'white'};
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        /* Divider */
        .header-divider {
          width: 1px;
          height: 24px;
          background: var(--header-border);
          margin: 0 8px;
        }

        /* Profile Dropdown */
        .profile-dropdown {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-trigger:hover {
          background: var(--header-hover);
          border-color: var(--header-border);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--header-text);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          font-size: 11px;
          color: var(--header-text-secondary);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-chevron {
          color: var(--header-text-secondary);
          transition: transform 0.2s;
        }

        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: ${isDark ? '#1e293b' : 'white'};
          border: 1px solid var(--header-border);
          border-radius: 16px;
          box-shadow: ${isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.1)'};
          padding: 8px;
          animation: dropdownIn 0.2s ease-out;
          z-index: 100;
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
        }

        .dropdown-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-initials-large {
          font-size: 16px;
          font-weight: 700;
          color: white;
        }

        .dropdown-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--header-text);
          margin: 0 0 2px 0;
        }

        .dropdown-email {
          font-size: 12px;
          color: var(--header-text-secondary);
          margin: 0 0 6px 0;
        }

        .dropdown-role {
          display: inline-block;
          padding: 2px 10px;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--header-border);
          margin: 4px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: var(--header-text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          font-family: inherit;
        }

        .dropdown-item:hover {
          background: var(--header-hover);
        }

        .dropdown-item svg {
          color: var(--header-text-secondary);
          flex-shrink: 0;
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout svg {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .user-info {
            display: none;
          }
          
          .logo-text {
            font-size: 18px;
          }
          
          .header-inner {
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .header-divider {
            display: none;
          }
          
          .icon-button:last-of-type {
            display: none;
          }
        }
      `}</style>
    </>
  );
}