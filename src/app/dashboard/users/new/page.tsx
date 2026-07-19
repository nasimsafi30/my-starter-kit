"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function NewUserPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

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
        setMessage("Photo uploaded! Fill the form and submit.");
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (error) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setTimeout(() => { setMessage(""); setError(""); }, 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, image, bio }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User created successfully! Redirecting...");
        setTimeout(() => router.push("/dashboard/users"), 1000);
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return "/" + url;
  };

  if (status === "loading") {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading...</p>
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

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="access-denied">
        <div className="denied-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Access Denied</h2>
        <p>Only administrators can create new users.</p>
        <button onClick={() => router.push("/dashboard/users")} className="btn-secondary">
          Back to Users
        </button>
        <style jsx>{`
          .access-denied {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            gap: 16px;
          }
          .denied-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ef4444;
          }
          h2 { color: var(--text-primary); margin: 0; font-size: 24px; }
          p { color: var(--text-secondary); margin: 0; }
        `}</style>
      </div>
    );
  }

  const isDark = theme === "dark";
  const displayImage = getImageUrl(image);
  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  
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
          --bg-card: ${isDark ? '#111827' : '#ffffff'};
          --bg-elevated: ${isDark ? '#1e293b' : '#f1f5f9'};
          --border-color: ${isDark ? '#1e293b' : '#e2e8f0'};
          --border-hover: ${isDark ? '#334155' : '#cbd5e1'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
          --accent: #6366f1;
          --success: #10b981;
          --danger: #ef4444;
        }
        * { box-sizing: border-box; }
      `}</style>

      <div className="new-user-page">
        {/* Back Navigation */}
        <button onClick={() => router.back()} className="back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Users
        </button>

        {/* Header */}
        <div className="page-header">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Add New User</h1>
            <p className="page-subtitle">Create a new user account with profile details</p>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="notification error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}
        {message && (
          <div className="notification success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="card-glow" />
          
          {/* Avatar Section */}
          <div className="avatar-section">
            <label className="section-label">Profile Photo</label>
            <div className="avatar-wrapper">
              {displayImage && !imgError ? (
                <img
                  src={displayImage}
                  alt="Preview"
                  className="avatar-image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>{initials}</span>
                </div>
              )}
              <div className={`avatar-status ${uploading ? 'uploading' : ''}`} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`avatar-upload-btn ${uploading ? 'disabled' : ''}`}
                disabled={uploading}
                title="Upload photo"
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
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="file-input-hidden" />
            </div>
            <p className="avatar-hint">Click the camera icon to upload a photo</p>
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); calculatePasswordStrength(e.target.value); }}
                required
                placeholder="Min 8 characters"
                className="form-input"
              />
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${passwordStrength}%`, background: strengthColor }} />
                  </div>
                  <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Role <span className="required">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Photo URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => { setImage(e.target.value); setImgError(false); }}
                placeholder="https://example.com/photo.jpg"
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Short description about the user..."
                className="form-textarea"
              />
              <div className="input-footer">
                <span className="char-hint">Brief description for the user profile</span>
                <span className="char-count">{bio.length}/500</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Creating User...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Create User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .new-user-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        /* Back Button */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 24px;
        }

        .back-btn:hover {
          background: var(--bg-card);
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        /* Header */
        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
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
          font-size: 15px;
        }

        /* Notifications */
        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 14px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .notification.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .notification.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        /* Form Card */
        .form-card {
          background: var(--bg-card);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent);
          opacity: 0.8;
        }

        /* Avatar Section */
        .avatar-section {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .avatar-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 12px;
        }

        .avatar-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--border-color);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
          border: 3px solid var(--border-color);
        }

        .avatar-status {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid var(--bg-card);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        .avatar-status.uploading {
          background: #f59e0b;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #111827;
          border: 3px solid var(--bg-card);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .avatar-upload-btn:hover:not(.disabled) {
          transform: scale(1.1);
          background: #1f2937;
        }

        .avatar-upload-btn.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .file-input-hidden { display: none; }

        .avatar-hint {
          font-size: 12px;
          color: var(--text-tertiary);
          margin: 0;
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-label svg {
          color: #6366f1;
          flex-shrink: 0;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b7280' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 10px;
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
          transition: all 0.3s;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 600;
          min-width: 44px;
          text-align: right;
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-hint {
          font-size: 12px;
          color: var(--text-tertiary);
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
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .btn-primary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-primary.loading {
          opacity: 0.7;
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

        .btn-cancel {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          background: var(--bg-elevated);
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .new-user-page { padding: 24px 16px; }
          .page-title { font-size: 24px; }
          .form-card { padding: 24px; }
          .form-grid { grid-template-columns: 1fr; }
          .form-actions { flex-direction: column; }
          .header-icon { width: 48px; height: 48px; border-radius: 12px; }
        }
      `}</style>
    </>
  );
}