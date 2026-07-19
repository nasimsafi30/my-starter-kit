"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [emailNotif, setEmailNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [status, session]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
    return strength;
  };

  const toggleEmail = () => {
    const newVal = !emailNotif;
    setEmailNotif(newVal);
    saveSettings({ emailNotifications: newVal, twoFactorEnabled: twoFactor, darkMode: theme === "dark" });
  };

  const toggleTwoFactor = () => {
    const newVal = !twoFactor;
    setTwoFactor(newVal);
    saveSettings({ emailNotifications: emailNotif, twoFactorEnabled: newVal, darkMode: theme === "dark" });
  };

  const saveSettings = async (data: any) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    calculatePasswordStrength(value);
  };

  if (status === "loading") {
    return (
      <div className="settings-loading">
        <div className="loading-spinner" />
        <p>Loading settings...</p>
        <style jsx>{`
          .settings-loading {
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
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: var(--text-secondary);
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }
  if (!session?.user) return null;

  const isDark = theme === "dark";
  const strengthColor = 
    passwordStrength <= 25 ? '#ef4444' :
    passwordStrength <= 50 ? '#f59e0b' :
    passwordStrength <= 75 ? '#3b82f6' : '#10b981';
  
  const strengthLabel = 
    passwordStrength <= 25 ? 'Weak' :
    passwordStrength <= 50 ? 'Fair' :
    passwordStrength <= 75 ? 'Good' : 'Strong';

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

      <div className="settings-container">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-grid" />
        </div>

        {/* Settings Header */}
        <div className="settings-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="toast-message">
            <div className="toast-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>Settings saved successfully!</span>
            <button className="toast-close" onClick={() => setSaved(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="settings-grid">
          {/* Profile Settings Card */}
          <div className="settings-card">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-header-icon" style={{ background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)', color: '#6366f1' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="card-title">Profile Settings</h2>
                <p className="card-subtitle">Update your personal information</p>
              </div>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your display name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={session.user.email || ""}
                    disabled
                    className="form-input disabled"
                  />
                  <span className="verified-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
              
              <button onClick={handleSaveProfile} className="save-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Profile
              </button>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="settings-card">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-header-icon" style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h2 className="card-title">Change Password</h2>
                <p className="card-subtitle">Update your security credentials</p>
              </div>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="form-input"
                />
                {newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ width: `${passwordStrength}%`, background: strengthColor }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="form-input"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </div>
              
              <button className="save-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Update Password
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="settings-card preferences-card">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-header-icon" style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <h2 className="card-title">Preferences</h2>
                <p className="card-subtitle">Customize your experience</p>
              </div>
            </div>
            
            <div className="preferences-list">
              {/* Dark Mode */}
              <div className="preference-item" onClick={toggleTheme}>
                <div className="preference-left">
                  <div className="preference-icon" style={{ background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)' }}>
                    {isDark ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
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
                  <div className="preference-text">
                    <span className="preference-label">Dark Mode</span>
                    <span className="preference-description">Toggle dark mode theme</span>
                  </div>
                </div>
                <div className={`toggle-switch ${isDark ? 'active' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Email Notifications */}
              <div className="preference-item" onClick={toggleEmail}>
                <div className="preference-left">
                  <div className="preference-icon" style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="preference-text">
                    <span className="preference-label">Email Notifications</span>
                    <span className="preference-description">Receive email updates and alerts</span>
                  </div>
                </div>
                <div className={`toggle-switch ${emailNotif ? 'active' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="preference-item" onClick={toggleTwoFactor}>
                <div className="preference-left">
                  <div className="preference-icon" style={{ background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="preference-text">
                    <span className="preference-label">Two-Factor Authentication</span>
                    <span className="preference-description">Add an extra layer of security</span>
                  </div>
                </div>
                <div className={`toggle-switch ${twoFactor ? 'active' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-container {
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

        /* Settings Header */
        .settings-header {
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

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .settings-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }

        .settings-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Toast Message */
        .toast-message {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto 24px;
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

        /* Settings Grid */
        .settings-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .settings-card {
          background: var(--bg-card);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .settings-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .settings-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .preferences-card {
          grid-column: 1 / -1;
        }

        .settings-card:hover {
          box-shadow: ${isDark ? '0 20px 60px rgba(99, 102, 241, 0.15)' : '0 20px 60px rgba(99, 102, 241, 0.08)'};
          border-color: var(--border-color-strong);
          transform: translateY(-2px);
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

        .settings-card:hover .card-glow {
          opacity: 1;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .card-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .card-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Form Content */
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border-color-strong);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-primary);
          background: var(--bg-input);
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: var(--bg-card);
        }

        .form-input.disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: ${isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)'};
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon .form-input {
          padding-left: 44px;
          padding-right: 90px;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .verified-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-label {
          font-size: 12px;
          font-weight: 600;
          min-width: 50px;
          text-align: right;
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
          font-weight: 500;
        }

        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          margin-top: 4px;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .save-btn:active {
          transform: translateY(0);
        }

        /* Preferences List */
        .preferences-list {
          display: flex;
          flex-direction: column;
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .preference-item:hover {
          background: var(--bg-input);
          border-color: var(--border-color);
        }

        .preference-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .preference-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .preference-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preference-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .preference-description {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Toggle Switch */
        .toggle-switch {
          width: 52px;
          height: 28px;
          border-radius: 14px;
          background: #6b7280;
          position: relative;
          cursor: pointer;
          transition: background 0.3s ease;
          flex-shrink: 0;
        }

        .toggle-switch.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .toggle-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-thumb {
          left: 26px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .settings-container {
            padding: 24px 16px;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-title {
            font-size: 28px;
          }

          .settings-card {
            padding: 24px;
          }

          .preference-item {
            padding: 16px;
          }

          .header-content {
            gap: 12px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
          }

          .header-icon svg {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 480px) {
          .settings-title {
            font-size: 24px;
          }

          .verified-badge {
            position: static;
            transform: none;
            margin-top: 8px;
            width: fit-content;
          }

          .input-with-icon .form-input {
            padding-right: 16px;
          }

          .preference-left {
            gap: 12px;
          }

          .preference-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }
        }
      `}</style>
    </>
  );
}