"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useState, useEffect } from "react";

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught:", error);
    }
  }, [error]);

  const handleReset = () => {
    setIsRetrying(true);
    // Small delay to show the loading state
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? '#0a0a0b' : '#f8fafc' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

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
        }
        * { box-sizing: border-box; }
        body { background: var(--bg-primary); }
      `}</style>

      <div className="error-boundary-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
        </div>

        <div className="error-container">
          {/* Error Icon */}
          <div className="error-icon-wrapper">
            <div className="error-icon-outer">
              <div className="error-icon-inner">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <div className="error-pulse-1" />
            <div className="error-pulse-2" />
          </div>

          {/* Error Content */}
          <div className="error-content">
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-description">
              An unexpected error occurred. Our team has been notified and we&apos;re working on a fix.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && error.message && (
              <div className="error-details">
                <div className="error-details-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                  <span>Error Details</span>
                </div>
                <pre className="error-message">
                  <code>{error.message}</code>
                </pre>
                {error.digest && (
                  <p className="error-digest">
                    Digest: {error.digest}
                  </p>
                )}
                {error.stack && (
                  <details className="error-stack">
                    <summary>Stack Trace</summary>
                    <pre><code>{error.stack}</code></pre>
                  </details>
                )}
              </div>
            )}

            {/* Suggestions */}
            <div className="error-suggestions">
              <div className="suggestion-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>Try refreshing the page</span>
              </div>
              <div className="suggestion-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Wait a few minutes and try again</span>
              </div>
              <div className="suggestion-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>If the problem persists, contact support</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="error-actions">
            <button 
              onClick={handleReset} 
              className="btn-primary"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <span className="btn-spinner" />
                  Retrying...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Try Again
                </>
              )}
            </button>
            
            <button 
              onClick={() => window.location.reload()} 
              className="btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Reload Page
            </button>
            
            <a href="/" className="btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </a>
          </div>

          {/* Footer */}
          <p className="error-footer">
            Need help? <a href="/help" className="footer-link">Visit Help Center</a>
            {" "}or{" "}
            <a href="/contact" className="footer-link">Contact Support</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .error-boundary-page {
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
          background: linear-gradient(135deg, #ef4444, #f59e0b);
          top: -150px;
          right: -150px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-blob-3 {
          width: 350px;
          height: 350px;
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

        /* Error Container */
        .error-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 520px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Error Icon */
        .error-icon-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 32px;
        }

        .error-icon-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)'};
          border: 2px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .error-icon-inner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.12)'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
        }

        .error-pulse-1 {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.1);
          animation: pulse-1 2s ease-in-out infinite;
          z-index: 1;
        }

        .error-pulse-2 {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border: 1px solid rgba(239, 68, 68, 0.05);
          animation: pulse-2 2s ease-in-out 0.5s infinite;
          z-index: 1;
        }

        @keyframes pulse-1 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.1; }
        }

        @keyframes pulse-2 {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.05; }
        }

        /* Error Content */
        .error-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .error-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }

        .error-description {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 auto 24px;
          max-width: 400px;
        }

        /* Error Details (Dev Only) */
        .error-details {
          margin: 0 auto 24px;
          max-width: 400px;
          background: ${isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.03)'};
          border: 1px solid ${isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'};
          border-radius: 12px;
          padding: 16px;
          text-align: left;
        }

        .error-details-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .error-message {
          margin: 0 0 8px 0;
          padding: 10px 12px;
          background: ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)'};
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
          overflow-x: auto;
          color: var(--text-secondary);
        }

        .error-message code {
          font-family: 'Courier New', monospace;
        }

        .error-digest {
          font-size: 11px;
          color: var(--text-tertiary);
          margin: 0 0 8px 0;
          font-family: 'Courier New', monospace;
        }

        .error-stack {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .error-stack summary {
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .error-stack pre {
          margin: 0;
          padding: 10px 12px;
          background: ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)'};
          border-radius: 8px;
          overflow-x: auto;
          font-size: 11px;
          line-height: 1.5;
          max-height: 200px;
          overflow-y: auto;
        }

        /* Suggestions */
        .error-suggestions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          margin: 0 auto;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .suggestion-item svg {
          flex-shrink: 0;
          color: var(--text-tertiary);
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
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          font-family: inherit;
          width: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:disabled {
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

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          width: 100%;
        }

        .btn-secondary:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          border-color: var(--text-tertiary);
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
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
          width: 100%;
        }

        .btn-outline:hover {
          border-color: var(--text-tertiary);
          color: var(--text-primary);
        }

        /* Footer */
        .error-footer {
          text-align: center;
          font-size: 14px;
          color: var(--text-tertiary);
          margin: 0;
        }

        .footer-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #4f46e5;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .error-title {
            font-size: 22px;
          }

          .error-description {
            font-size: 14px;
          }

          .error-icon-wrapper {
            width: 100px;
            height: 100px;
          }

          .error-icon-inner {
            width: 64px;
            height: 64px;
          }

          .error-icon-inner svg {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
}