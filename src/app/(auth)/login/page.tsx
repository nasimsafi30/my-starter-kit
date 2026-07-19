"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { LoginForm } from "@/components/forms/login-form";
import { useState, useEffect } from "react";

export default function LoginPage() {
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

      <div className="login-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
        </div>

        {/* Login Container */}
        <div className="login-container">
          {/* Brand Header */}
          <div className="brand-header">
            <Link href="/" className="brand-link">
              <div className="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="brand-text">
                Starter<span className="brand-accent">Kit</span>
              </span>
            </Link>
          </div>

          {/* Login Card */}
          <div className="login-card">
            <div className="card-glow" />
            
            {/* Card Header */}
            <div className="card-header">
              <div className="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h1 className="card-title">Welcome back</h1>
              <p className="card-subtitle">Sign in to your account to continue</p>
            </div>

            {/* Social Login Buttons */}
            <div className="social-buttons">
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">or continue with email</span>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <Link href="/forgot-password" className="forgot-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="card-footer">
            <p className="footer-text">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="footer-link">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
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

        .bg-blob-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
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

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, -80px) scale(0.9); }
          75% { transform: translate(-60px, 30px) scale(1.05); }
        }

        /* Login Container */
        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
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

        /* Login Card */
        .login-card {
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
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .card-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .card-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Social Buttons */
        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px 20px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .social-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
          border-color: var(--text-tertiary);
          transform: translateY(-1px);
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin-bottom: 24px;
        }

        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: var(--border-color);
        }

        .divider-text {
          position: relative;
          display: inline-block;
          padding: 0 16px;
          background: var(--bg-card);
          color: var(--text-tertiary);
          font-size: 13px;
          font-weight: 500;
        }

        /* Forgot Password */
        .forgot-password {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .forgot-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-tertiary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #6366f1;
        }

        /* Footer */
        .card-footer {
          margin-top: 24px;
          text-align: center;
        }

        .footer-text {
          font-size: 15px;
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

        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }

          .card-title {
            font-size: 22px;
          }

          .social-buttons {
            gap: 8px;
          }

          .social-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}