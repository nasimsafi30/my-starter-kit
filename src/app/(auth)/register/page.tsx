"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { RegisterForm } from "@/components/forms/register-form";
import { useState, useEffect } from "react";

export default function RegisterPage() {
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

  const benefits = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      text: "Free account, no credit card required",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      text: "Enterprise-grade security",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      text: "Set up in under 2 minutes",
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
          --accent: #6366f1;
        }
        * { box-sizing: border-box; }
        body { background: var(--bg-primary); }
      `}</style>

      <div className="register-page">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
          <div className="bg-grid" />
        </div>

        <div className="register-layout">
          {/* Left Side - Info Panel */}
          <div className="info-panel">
            <div className="info-content">
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

              <h1 className="info-title">
                Build something <span className="info-gradient">amazing</span>
              </h1>
              
              <p className="info-description">
                Join thousands of developers and teams using StarterKit to build 
                modern, scalable web applications faster than ever.
              </p>

              <div className="benefits-list">
                {benefits.map((benefit, i) => (
                  <div key={i} className="benefit-item">
                    <div className="benefit-icon">
                      {benefit.icon}
                    </div>
                    <span className="benefit-text">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="testimonial">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">
                  "StarterKit saved us weeks of development time. The authentication 
                  system alone is worth it."
                </p>
                <p className="testimonial-author">— Sarah Chen, Lead Developer</p>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="form-panel">
            <div className="form-container">
              {/* Mobile Brand (visible only on mobile) */}
              <div className="mobile-brand">
                <Link href="/" className="brand-link">
                  <div className="brand-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <span className="brand-text">
                    Starter<span className="brand-accent">Kit</span>
                  </span>
                </Link>
              </div>

              <div className="register-card">
                <div className="card-glow" />
                
                <div className="card-header">
                  <div className="header-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>
                  <h2 className="card-title">Create your account</h2>
                  <p className="card-subtitle">Start building in minutes</p>
                </div>

                {/* Social Sign Up Buttons */}
                <div className="social-buttons">
                  <button className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                  </button>
                  
                  <button className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Sign up with GitHub
                  </button>
                </div>

                <div className="divider">
                  <span className="divider-text">or continue with email</span>
                </div>

                <RegisterForm />
              </div>

              <div className="card-footer">
                <p className="footer-text">
                  Already have an account?{" "}
                  <Link href="/login" className="footer-link">
                    Sign in instead
                  </Link>
                </p>
                <p className="terms-text">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="terms-link">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
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
          left: -200px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          bottom: -150px;
          right: -150px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-blob-3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #f59e0b, #8b5cf6);
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

        /* Layout */
        .register-layout {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 100vh;
        }

        /* Info Panel */
        .info-panel {
          flex: 1;
          background: ${isDark ? 'linear-gradient(135deg, #111827, #0f172a)' : 'linear-gradient(135deg, #1e293b, #0f172a)'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
        }

        .info-panel::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          animation: pulse-glow 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .info-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          margin-bottom: 48px;
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
          color: white;
          letter-spacing: -0.5px;
        }

        .brand-accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .info-title {
          font-size: 42px;
          font-weight: 900;
          color: white;
          margin: 0 0 20px 0;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .info-gradient {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .info-description {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin: 0 0 40px 0;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 48px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .benefit-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          flex-shrink: 0;
        }

        .benefit-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .testimonial {
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .testimonial-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
          line-height: 1.6;
          margin: 0 0 8px 0;
        }

        .testimonial-author {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-weight: 500;
        }

        /* Form Panel */
        .form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: var(--bg-primary);
        }

        .form-container {
          width: 100%;
          max-width: 440px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .mobile-brand {
          display: none;
          text-align: center;
          margin-bottom: 32px;
        }

        .register-card {
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

        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
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

        .card-footer {
          margin-top: 24px;
          text-align: center;
        }

        .footer-text {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
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

        .terms-text {
          font-size: 12px;
          color: var(--text-tertiary);
          margin: 0;
          line-height: 1.5;
        }

        .terms-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .terms-link:hover {
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .info-panel {
            display: none;
          }

          .mobile-brand {
            display: block;
          }

          .form-panel {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .register-card {
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