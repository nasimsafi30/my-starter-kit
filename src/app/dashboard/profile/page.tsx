"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && !loaded) {
      fetch("/api/profile")
        .then(r => r.json())
        .then(d => {
          if (d.user) {
            setName(d.user.name || "");
            setEmail(d.user.email || "");
            setBio(d.user.bio || "");
            setImage(d.user.image || "");
            setImgError(false);
            setLoaded(true);
          }
        })
        .catch(() => setLoaded(true));
    }
  }, [status, loaded]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        setImage(data.url);
        setImgError(false);
        setMessage("✅ Photo uploaded! Click Save to update profile.");
      } else {
        setMessage("❌ " + (data.error || "Upload failed"));
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image, bio }),
      });

      const data = await res.json();

      if (res.ok) {
        await update({ name, email, image });
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ " + (data.error || "Failed to update"));
      }
    } catch (error) {
      setMessage("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (status === "loading" || !loaded) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <p>Loading your profile...</p>
        <style jsx>{`
          .profile-loading {
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
  const initials = (name || email || "U")[0].toUpperCase();

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return "/" + url;
  };

  const displayImage = getImageUrl(image);

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
          --accent-hover: #4f46e5;
          --accent-light: rgba(99, 102, 241, 0.1);
          --accent-light-hover: rgba(99, 102, 241, 0.15);
          --success: #10b981;
          --error: #ef4444;
          --shadow-sm: ${isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'};
          --shadow-md: ${isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)'};
          --shadow-lg: ${isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)'};
          --shadow-glow: ${isDark ? '0 0 40px rgba(99, 102, 241, 0.15)' : '0 0 40px rgba(99, 102, 241, 0.1)'};
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div className="profile-container">
        {/* Background decorative elements */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
        </div>

        {/* Settings Header Card */}
        <div className="settings-header-card">
          <div className="card-glow-header" />
          <div className="header-icon-wrapper">
            <div className="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
          <div className="header-text">
            <h1 className="settings-title">Profile Settings</h1>
            <p className="settings-subtitle">Manage your account information and preferences</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {session.user.role || 'User'}
              </div>
              <span className="stat-label">Account Type</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secured
              </div>
              <span className="stat-label">Status</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Active
              </div>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div className={`toast-message ${message.includes("✅") ? "toast-success" : "toast-error"}`}>
            <div className="toast-icon-wrapper">
              {message.includes("✅") ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
            <span>{message.replace(/[✅❌]/g, '').trim()}</span>
            <button className="toast-close" onClick={() => setMessage("")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="card-glow" />
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar-ring" />
                {displayImage && !imgError ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="avatar-image"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-initials">{initials}</span>
                  </div>
                )}
                <div className={`avatar-status ${uploading ? 'uploading' : ''}`} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`avatar-upload-btn ${uploading ? 'btn-disabled' : ''}`}
                  disabled={uploading}
                  title="Upload profile photo"
                >
                  {uploading ? (
                    <span className="upload-spinner" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input-hidden"
                />
              </div>
              
              <div className="user-info">
                <h2 className="user-name">{name || "Anonymous User"}</h2>
                <p className="user-email">{email}</p>
                <span className="role-badge">
                  <span className="role-dot" />
                  {session.user.role}
                </span>
              </div>
            </div>

            <div className="info-section">
              <div className="info-item">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{email}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Account Role</span>
                  <span className="info-value capitalize">{session.user.role}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">Active Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="form-card">
            <div className="card-glow" />
            <div className="form-header">
              <div className="form-header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <h2 className="form-title">Edit Profile</h2>
                <p className="form-subtitle">Update your personal information and preferences</p>
              </div>
            </div>

            <div className="form-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </span>
                  Profile Photo URL
                </label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => { setImage(e.target.value); setImgError(false); }}
                    placeholder="https://example.com/photo.jpg"
                    className="form-input"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="input-action-btn"
                    title="Upload image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </button>
                </div>
                <span className="input-hint">
                  Paste an image URL or use the upload button
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="Write a short bio about yourself..."
                  className="form-textarea"
                />
                <div className="input-footer">
                  <span className="input-hint">
                    Brief description for your profile.
                  </span>
                  <span className="char-count">
                    {bio.length}/500
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`save-btn ${saving ? 'saving' : ''}`}
                >
                  {saving ? (
                    <>
                      <span className="btn-spinner" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
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
          opacity: 0.15;
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

        .bg-blob-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          top: 50%;
          left: 50%;
          animation: float 25s ease-in-out infinite;
          opacity: 0.08;
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

        /* Settings Header Card */
        .settings-header-card {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto 32px;
          background: var(--bg-card);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out;
        }

        .settings-header-card:hover {
          box-shadow: ${isDark ? '0 20px 60px rgba(99, 102, 241, 0.15)' : '0 20px 60px rgba(99, 102, 241, 0.08)'};
          border-color: var(--border-color-strong);
          transform: translateY(-2px);
        }

        .card-glow-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #06b6d4, transparent);
          opacity: 0.8;
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

        .header-icon-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
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
          position: relative;
        }

        .header-icon::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .settings-header-card:hover .header-icon::after {
          opacity: 0.1;
        }

        .header-text {
          flex: 1;
        }

        .settings-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .settings-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 400;
          line-height: 1.4;
        }

        .header-stats {
          display: flex;
          align-items: center;
          gap: 0;
          margin-top: 28px;
          padding-top: 28px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-input);
          border-radius: 16px;
          padding: 24px;
        }

        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 20px;
        }

        .stat-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .stat-value svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color-strong);
          flex-shrink: 0;
        }

        /* Toast Message */
        .toast-message {
          position: relative;
          z-index: 2;
          max-width: 1100px;
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
          border: 1px solid;
        }

        .toast-success {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .toast-error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .toast-icon-wrapper {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-success .toast-icon-wrapper {
          background: rgba(16, 185, 129, 0.2);
        }

        .toast-error .toast-icon-wrapper {
          background: rgba(239, 68, 68, 0.2);
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

        /* Profile Grid */
        .profile-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Profile Card */
        .profile-card {
          background: var(--bg-card);
          border-radius: 24px;
          padding: 40px 32px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          height: fit-content;
        }

        .profile-card:hover {
          box-shadow: ${isDark ? '0 20px 60px rgba(99, 102, 241, 0.15)' : '0 20px 60px rgba(99, 102, 241, 0.08)'};
          border-color: var(--border-color-strong);
          transform: translateY(-2px);
        }

        /* Form Card */
        .form-card {
          background: var(--bg-card);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .form-card:hover {
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

        .profile-card:hover .card-glow,
        .form-card:hover .card-glow {
          opacity: 1;
        }

        /* Avatar Section */
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }

        .avatar-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          opacity: 0;
          transition: opacity 0.3s ease;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .avatar-wrapper:hover .avatar-ring {
          opacity: 0.3;
        }

        .avatar-image {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }

        .avatar-image:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
        }

        .avatar-placeholder {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
        }

        .avatar-initials {
          font-size: 48px;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .avatar-status {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid var(--bg-card);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
          z-index: 2;
        }

        .avatar-status.uploading {
          background: #f59e0b;
          animation: pulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: 3px solid var(--bg-card);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          z-index: 3;
        }

        .avatar-upload-btn:hover:not(.btn-disabled) {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .btn-disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .file-input-hidden {
          display: none;
        }

        /* User Info */
        .user-info {
          text-align: center;
        }

        .user-name {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .user-email {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 16px 0;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        /* Info Section */
        .info-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 32px;
          border-top: 1px solid var(--border-color);
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          transition: all 0.2s ease;
          background: var(--bg-input);
        }

        .info-item:hover {
          background: var(--bg-card-hover);
          transform: translateX(4px);
        }

        .info-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
          min-width: 0;
        }

        .info-label {
          display: block;
          font-size: 11px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
          font-weight: 600;
        }

        .info-value {
          display: block;
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          word-break: break-all;
          text-transform: capitalize;
        }

        .capitalize {
          text-transform: capitalize;
        }

        /* Form Header */
        .form-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 32px;
        }

        .form-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
          border: 1px solid rgba(99, 102, 241, 0.15);
        }

        .form-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .form-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Form Content */
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .label-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--accent-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .form-input,
        .form-textarea {
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

        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-light);
          background: var(--bg-card);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .input-with-button {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-button .form-input {
          padding-right: 50px;
        }

        .input-action-btn {
          position: absolute;
          right: 8px;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--accent-light);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--accent);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .input-action-btn:hover {
          background: var(--accent-light-hover);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-hint {
          font-size: 12px;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .char-count {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .save-btn {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          position: relative;
          overflow: hidden;
        }

        .save-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .save-btn:hover:not(.saving)::before {
          left: 100%;
        }

        .save-btn:hover:not(.saving) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .save-btn:active:not(.saving) {
          transform: translateY(0);
        }

        .save-btn.saving {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .cancel-btn {
          padding: 14px 24px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color-strong);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: var(--bg-input);
          color: var(--text-primary);
          border-color: var(--text-tertiary);
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .profile-container {
            padding: 24px 16px;
          }

          .settings-header-card {
            padding: 24px;
          }

          .settings-title {
            font-size: 24px;
          }

          .header-stats {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }

          .stat-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0;
          }

          .stat-divider {
            width: 100%;
            height: 1px;
          }

          .profile-card,
          .form-card {
            padding: 32px 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .header-icon-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .profile-container {
            padding: 16px 12px;
          }

          .settings-header-card {
            padding: 20px;
            border-radius: 20px;
          }

          .settings-title {
            font-size: 20px;
          }

          .header-stats {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}