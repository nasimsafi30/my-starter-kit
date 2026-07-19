"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useState, useEffect } from "react";

export default function NotFound() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  const suggestions = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      text: "Go to Homepage",
      href: "/",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      text: "Search Content",
      href: "/search",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      text: "Help Center",
      href: "/help",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      ),
      text: "Sign In",
      href: "/login",
    },
  ];

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

      <div className="not-found-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
          
          {/* Floating Elements */}
          <div className="floating-element floating-1">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="floating-element floating-2">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="floating-element floating-3">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <div className="not-found-container">
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

          {/* Main Content */}
          <div className="content-card">
            <div className="card-glow" />
            
            {/* 404 Number */}
            <div className="error-number">
              <span className="number-digit">4</span>
              <div className="number-zero">
                <div className="zero-outer">
                  <div className="zero-inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="number-digit">4</span>
            </div>

            {/* Content */}
            <div className="error-content">
              <h1 className="error-title">Page not found</h1>
              <p className="error-description">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back on track.
              </p>

              {/* Quick Links */}
              <div className="quick-links">
                {suggestions.map((suggestion, i) => (
                  <Link key={i} href={suggestion.href} className="quick-link">
                    <span className="quick-link-icon">
                      {suggestion.icon}
                    </span>
                    <span className="quick-link-text">{suggestion.text}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-link-arrow">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Primary Action */}
            <div className="primary-action">
              <Link href="/" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Back to Homepage
              </Link>
              <button onClick={() => window.history.back()} className="btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Go Back
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="footer-text">
            Need assistance?{" "}
            <Link href="/contact" className="footer-link">Contact Support</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
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
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          bottom: -150px;
          left: -150px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-blob-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          top: 50%;
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

        /* Floating Elements */
        .floating-element {
          position: absolute;
          animation: float-element 6s ease-in-out infinite;
        }

        .floating-1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-2 {
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-3 {
          bottom: 25%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, -80px) scale(0.9); }
          75% { transform: translate(-60px, 30px) scale(1.05); }
        }

        @keyframes float-element {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-5deg); }
        }

        /* Container */
        .not-found-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          animation: fadeInUp 0.8s ease-out;
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
          padding: 48px 40px;
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

        /* 404 Number */
        .error-number {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .number-digit {
          font-size: 100px;
          font-weight: 900;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .number-zero {
          position: relative;
          width: 90px;
          height: 90px;
        }

        .zero-outer {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          border: 3px solid rgba(99, 102, 241, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-zero 2s ease-in-out infinite;
        }

        .zero-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        @keyframes pulse-zero {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Error Content */
        .error-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .error-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }

        .error-description {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 28px 0;
        }

        /* Quick Links */
        .quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .quick-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .quick-link:hover {
          border-color: var(--text-tertiary);
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
          transform: translateX(2px);
        }

        .quick-link-icon {
          flex-shrink: 0;
          color: var(--text-tertiary);
        }

        .quick-link-text {
          flex: 1;
        }

        .quick-link-arrow {
          flex-shrink: 0;
          color: var(--text-tertiary);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
        }

        .quick-link:hover .quick-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Primary Action */
        .primary-action {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-outline:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
          border-color: var(--text-tertiary);
        }

        /* Footer */
        .footer-text {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: var(--text-tertiary);
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
        @media (max-width: 640px) {
          .content-card {
            padding: 40px 24px;
          }

          .number-digit {
            font-size: 72px;
          }

          .number-zero {
            width: 70px;
            height: 70px;
          }

          .zero-outer {
            width: 70px;
            height: 70px;
          }

          .zero-inner {
            width: 46px;
            height: 46px;
          }

          .zero-inner svg {
            width: 24px;
            height: 24px;
          }

          .quick-links {
            grid-template-columns: 1fr;
          }

          .error-title {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}