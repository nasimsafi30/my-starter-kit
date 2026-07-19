"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useState, useEffect } from "react";

const errorMessages: Record<string, { title: string; message: string; suggestion: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    message: "There is a problem with the server configuration.",
    suggestion: "Please contact the site administrator or try again later.",
  },
  AccessDenied: {
    title: "Access Denied",
    message: "You do not have permission to sign in.",
    suggestion: "Please check your account permissions or contact support.",
  },
  Verification: {
    title: "Verification Failed",
    message: "The verification token has expired or has already been used.",
    suggestion: "Please request a new verification link or contact support.",
  },
  OAuthSignin: {
    title: "OAuth Sign-In Error",
    message: "There was an error in the OAuth sign-in process.",
    suggestion: "Please try signing in again or use a different method.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    message: "There was an error in the OAuth callback process.",
    suggestion: "Please try again. If the problem persists, contact support.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Failed",
    message: "Could not create OAuth account.",
    suggestion: "Please try creating an account with email instead.",
  },
  EmailCreateAccount: {
    title: "Account Creation Failed",
    message: "Could not create email account.",
    suggestion: "Please check your email address and try again.",
  },
  Callback: {
    title: "Callback Error",
    message: "There was an error in the callback handler.",
    suggestion: "Please try again or contact support if the issue persists.",
  },
  OAuthAccountNotLinked: {
    title: "Account Already Exists",
    message: "This email is already associated with another account.",
    suggestion: "Please sign in with your original authentication method.",
  },
  EmailSignin: {
    title: "Invalid Sign-In Link",
    message: "The email sign-in link is invalid or has expired.",
    suggestion: "Please request a new sign-in link to continue.",
  },
  CredentialsSignin: {
    title: "Invalid Credentials",
    message: "The email or password you entered is incorrect.",
    suggestion: "Please check your credentials and try again, or reset your password.",
  },
  SessionRequired: {
    title: "Authentication Required",
    message: "Please sign in to access this page.",
    suggestion: "You need to be signed in to view this content.",
  },
  default: {
    title: "Authentication Error",
    message: "An unexpected error occurred during authentication.",
    suggestion: "Please try again or contact support if the issue persists.",
  },
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const error = searchParams.get("error") || "default";
  const errorInfo = errorMessages[error] || errorMessages.default;
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? '#0a0a0b' : '#f8fafc' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  // Map error types to visual styles
  const getErrorStyle = (errorType: string) => {
    if (errorType === "CredentialsSignin" || errorType === "AccessDenied") {
      return {
        color: "#ef4444",
        bg: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.08)",
        border: "rgba(239, 68, 68, 0.2)",
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ),
      };
    }
    if (errorType === "Verification" || errorType === "EmailSignin") {
      return {
        color: "#f59e0b",
        bg: isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.08)",
        border: "rgba(245, 158, 11, 0.2)",
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      };
    }
    return {
      color: "#6366f1",
      bg: isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.08)",
      border: "rgba(99, 102, 241, 0.2)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    };
  };

  const style = getErrorStyle(error);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: ${isDark ? '#0a0a0b' : '#f8fafc'};
          --bg-card: ${isDark ? '#111827' : '#ffffff'};
          --border-color: ${isDark ? '#1e293b' : '#e2e8f0'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
        }
        * { box-sizing: border-box; }
        body { background: var(--bg-primary); }
      `}</style>

      <div className="error-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-grid" />
        </div>

        <div className="error-container">
          {/* Brand Header */}
          <div className="brand-header">
            <Link href="/" className="brand-link">
              <div className="brand-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="brand-text">
                Starter<span className="brand-accent">Kit</span>
              </span>
            </Link>
          </div>

          {/* Error Card */}
          <div className="error-card">
            <div className="card-glow" style={{ background: `linear-gradient(90deg, transparent, ${style.color}, transparent)` }} />
            
            {/* Error Icon */}
            <div className="error-icon-wrapper">
              <div className="error-icon" style={{ background: style.bg, color: style.color, borderColor: style.border }}>
                {style.icon}
              </div>
              <div className="error-pulse" style={{ background: style.color }} />
            </div>

            {/* Error Content */}
            <div className="error-content">
              <h1 className="error-title">{errorInfo.title}</h1>
              <p className="error-message">{errorInfo.message}</p>
              
              <div className="error-divider" />
              
              <div className="error-suggestion">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>{errorInfo.suggestion}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="error-actions">
              <Link href="/login" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </Link>
              <Link href="/" className="btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Go Home
              </Link>
            </div>

            {/* Additional Help Links */}
            <div className="help-links">
              <Link href="/help" className="help-link">Help Center</Link>
              <span className="help-divider">·</span>
              <Link href="/contact" className="help-link">Contact Support</Link>
            </div>
          </div>

          {/* Error Code */}
          <p className="error-code">
            Error code: {error !== "default" ? error : "UNKNOWN"}
          </p>
        </div>
      </div>

      <style jsx>{`
        .error-page {
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
          background: linear-gradient(135deg, #ef4444, #f59e0b);
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
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

        /* Error Container */
        .error-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
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
          gap: 10px;
          text-decoration: none;
        }

        .brand-icon-small {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .brand-text {
          font-size: 20px;
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

        /* Error Card */
        .error-card {
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
          opacity: 0.8;
        }

        /* Error Icon */
        .error-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 28px;
        }

        .error-icon {
          width: 80px;
          height: 80px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          position: relative;
          z-index: 1;
        }

        .error-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.1;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.05; }
        }

        /* Error Content */
        .error-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .error-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .error-message {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .error-divider {
          width: 40px;
          height: 2px;
          background: var(--border-color);
          margin: 20px auto;
          border-radius: 1px;
        }

        .error-suggestion {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 16px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          border-radius: 14px;
          text-align: left;
        }

        .error-suggestion svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: var(--text-tertiary);
        }

        .error-suggestion p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        /* Action Buttons */
        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-outline:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
          border-color: var(--text-tertiary);
        }

        /* Help Links */
        .help-links {
          text-align: center;
        }

        .help-link {
          font-size: 13px;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .help-link:hover {
          color: var(--text-primary);
        }

        .help-divider {
          margin: 0 8px;
          color: var(--border-color);
        }

        /* Error Code */
        .error-code {
          text-align: center;
          margin-top: 24px;
          font-size: 12px;
          color: var(--text-tertiary);
          font-family: 'Courier New', monospace;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .error-card {
            padding: 32px 24px;
          }

          .error-title {
            font-size: 20px;
          }

          .error-icon {
            width: 64px;
            height: 64px;
            border-radius: 18px;
          }

          .error-icon-wrapper {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
    </>
  );
}