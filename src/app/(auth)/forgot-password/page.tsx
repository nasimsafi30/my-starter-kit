"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send reset link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: ${isDark ? '#0a0a0b' : '#f8fafc'};
          --bg-card: ${isDark ? '#111827' : '#ffffff'};
          --bg-elevated: ${isDark ? '#1e293b' : '#f1f5f9'};
          --border-color: ${isDark ? '#1e293b' : '#e2e8f0'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
          --accent: #6366f1;
        }
        * { box-sizing: border-box; }
        body { background: var(--bg-primary); }
      `}</style>

      <div className="forgot-password-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
        </div>

        <div className="page-container">
          {/* Brand Header */}
          <div className="brand-header">
            <Link href="/" className="brand-link">
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="brand-text">
                Starter<span className="brand-accent">Kit</span>
              </span>
            </Link>
          </div>

          {/* Content Card */}
          <div className="content-card">
            <div className="card-glow" />

            {sent ? (
              /* Success State */
              <div className="success-state">
                <div className="success-icon-wrapper">
                  <div className="success-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="success-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <h1 className="success-title">Check your email</h1>
                
                <p className="success-description">
                  If an account exists for{" "}
                  <strong className="email-highlight">{email}</strong>
                  , we&apos;ve sent a password reset link. The link will expire in 1 hour.
                </p>

                <div className="success-actions">
                  <Link href="/login" className="btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Sign In
                  </Link>
                  
                  <button onClick={() => setSent(false)} className="btn-outline">
                    Try different email
                  </button>
                </div>

                <div className="help-text">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button onClick={() => setSent(false)} className="text-link">
                    try again
                  </button>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="card-header">
                  <div className="header-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h1 className="card-title">Forgot your password?</h1>
                  <p className="card-subtitle">
                    No worries, we&apos;ll send you reset instructions
                  </p>
                </div>

                {error && (
                  <div className="error-alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="forgot-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="form-input"
                      autoFocus
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-submit ${loading ? 'loading' : ''}`}
                  >
                    {loading ? (
                      <>
                        <span className="btn-spinner" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                <div className="card-footer">
                  <p className="footer-text">
                    Remember your password?{" "}
                    <Link href="/login" className="footer-link">
                      Back to sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Security Note */}
          <div className="security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Protected by enterprise-grade security. Your data is safe with us.
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
        }

        /* Background Decorations */
        .bg-decoration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.1;
        }

        .bg-blob-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: -150px;
          right: -150px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-blob-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          top: 40%;
          left: 50%;
          animation: float 25s ease-in-out infinite;
          opacity: 0.06;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--border-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, -50px) scale(0.95); }
          75% { transform: translate(-40px, 20px) scale(1.02); }
        }

        /* Page Container */
        .page-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Brand Header */
        .brand-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
        }

        .brand-text {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .brand-accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Content Card */
        .content-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: ${isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.08)'};
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #06b6d4, transparent);
          opacity: 0.8;
        }

        /* Card Header */
        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .card-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .card-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        /* Error Alert */
        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 14px;
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        /* Form */
        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
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

        .form-label svg {
          color: #6366f1;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          font-size: 15px;
          color: var(--text-primary);
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: var(--bg-card);
        }

        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
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
          font-family: inherit;
        }

        .btn-submit:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-submit.loading {
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Card Footer */
        .card-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .footer-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .footer-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #4f46e5;
        }

        /* Success State */
        .success-state {
          text-align: center;
        }

        .success-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .success-check {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .success-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .success-description {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 28px 0;
        }

        .email-highlight {
          color: var(--text-primary);
          background: ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)'};
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 14px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-outline {
          padding: 14px 24px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-outline:hover {
          border-color: var(--text-tertiary);
          color: var(--text-primary);
          background: var(--bg-elevated);
        }

        .help-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-tertiary);
          flex-wrap: wrap;
        }

        .help-text svg {
          flex-shrink: 0;
          color: var(--text-tertiary);
        }

        .text-link {
          background: none;
          border: none;
          color: #6366f1;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          text-decoration: underline;
          font-family: inherit;
        }

        .text-link:hover {
          color: #4f46e5;
        }

        /* Security Note */
        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-tertiary);
        }

        .security-note svg {
          color: #10b981;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .content-card {
            padding: 32px 24px;
          }

          .card-title {
            font-size: 22px;
          }

          .success-title {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}