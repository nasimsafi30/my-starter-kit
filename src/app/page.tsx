"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Authentication",
      description: "Secure auth with NextAuth.js, OAuth providers, and role-based access control",
      color: "#6366f1",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      title: "Database",
      description: "PostgreSQL with Drizzle ORM, migrations, and type-safe queries",
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
      ),
      title: "UI Components",
      description: "Beautiful, responsive components with dark mode and animations",
      color: "#f59e0b",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      title: "TypeScript",
      description: "Full type safety with TypeScript, strict mode, and great DX",
      color: "#3b82f6",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: "Deployment",
      description: "Easy deployment to Vercel, Docker support, and CI/CD ready",
      color: "#ec4899",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "Developer Experience",
      description: "ESLint, Prettier, Husky, and best practices built-in",
      color: "#8b5cf6",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const techStack = [
    "Next.js 14", "TypeScript", "NextAuth.js", "PostgreSQL", 
    "Drizzle ORM", "Tailwind CSS", "React Hook Form", "Zod",
  ];

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: ${isDark ? '#0a0a0b' : '#ffffff'};
          --bg-secondary: ${isDark ? '#111827' : '#f8fafc'};
          --bg-card: ${isDark ? '#1e293b' : '#ffffff'};
          --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
          --text-tertiary: ${isDark ? '#64748b' : '#94a3b8'};
          --border-color: ${isDark ? '#1e293b' : '#e2e8f0'};
          --border-hover: ${isDark ? '#334155' : '#cbd5e1'};
          --accent: #6366f1;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          background: var(--bg-primary); 
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="landing-page">
        {/* Navigation */}
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="brand-text">Starter<span className="brand-accent">Kit</span></span>
            </div>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#tech-stack" className="nav-link">Tech Stack</a>
              <Link href="/login" className="btn-outline">Sign In</Link>
              <Link href="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          {/* Background Decorations */}
          <div className="bg-decoration">
            <div className="bg-blob bg-blob-1" />
            <div className="bg-blob bg-blob-2" />
            <div className="bg-blob bg-blob-3" />
            <div className="bg-grid" />
          </div>

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              Production-Ready Starter Kit
            </div>
            
            <h1 className="hero-title">
              Build Faster with
              <span className="hero-gradient"> Next.js</span>
            </h1>
            
            <p className="hero-description">
              A complete, production-ready starter kit with authentication, database, 
              file uploads, and a modern component library. Everything you need to ship fast.
            </p>

            <div className="hero-actions">
              <Link href="/register" className="btn-primary-large">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Get Started Free
              </Link>
              <Link href="/login" className="btn-outline-large">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">6+</span>
                <span className="stat-label">Core Features</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-value">8</span>
                <span className="stat-label">Tech Stack</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">TypeScript</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="code-filename">app/page.tsx</span>
              </div>
              <div className="code-content">
                <pre>
                  <code>
                    <span className="code-keyword">export default</span>{" "}
                    <span className="code-function">function</span>{" "}
                    <span className="code-component">HomePage</span>() {"{"}
                    {"\n"}  <span className="code-keyword">return</span> (
                    {"\n"}    {"<"}<span className="code-component">div</span>{">"}
                    {"\n"}      {"<"}<span className="code-component">h1</span>{">"}
                    <span className="code-string">"Hello World"</span>
                    {"</"}{<span className="code-component">h1</span>}{">"}
                    {"\n"}    {"</"}{<span className="code-component">div</span>}{">"}
                    {"\n"}  );
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">
              Everything You <span className="hero-gradient">Need</span>
            </h2>
            <p className="section-subtitle">
              A comprehensive toolkit to build modern web applications
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="tech-section">
          <div className="tech-card">
            <div className="card-glow" />
            <div className="section-header">
              <h2 className="section-title">
                Modern <span className="hero-gradient">Tech Stack</span>
              </h2>
              <p className="section-subtitle">
                Built with the latest and greatest technologies
              </p>
            </div>

            <div className="tech-grid">
              {techStack.map((tech, i) => (
                <div key={i} className="tech-item">
                  <span className="tech-dot" />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="card-glow" />
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of developers building with StarterKit. Start your next project in minutes.
            </p>
            <div className="cta-actions">
              <Link href="/register" className="btn-primary-large">
                Create Free Account
              </Link>
              <Link href="/login" className="btn-outline-large">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="brand-text">Starter<span className="brand-accent">Kit</span></span>
            </div>
            <p className="footer-text">
              Built with ❤️ using Next.js and TypeScript
            </p>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#tech-stack">Tech Stack</a>
              <Link href="/login">Sign In</Link>
              <Link href="/register">Get Started</Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.3s;
          padding: 16px 0;
        }

        .navbar.scrolled {
          background: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 12px 0;
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
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
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          padding: 8px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
        }

        .btn-outline {
          padding: 8px 18px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-outline:hover {
          border-color: var(--border-hover);
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
        }

        .btn-primary {
          padding: 8px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          position: relative;
          overflow: hidden;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .bg-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
        }

        .bg-blob-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: -100px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          bottom: -100px;
          left: -100px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-blob-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          top: 50%;
          left: 50%;
          animation: float 25s ease-in-out infinite;
          opacity: 0.08;
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

        .hero-content {
          flex: 1;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: ${isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)'};
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-title {
          font-size: 56px;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.1;
          margin: 0 0 20px 0;
          letter-spacing: -1.5px;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 32px 0;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 48px;
        }

        .btn-primary-large {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 14px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
        }

        .btn-primary-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
        }

        .btn-outline-large {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border: 2px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-outline-large:hover {
          border-color: var(--border-hover);
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Hero Visual */
        .hero-visual {
          flex: 1;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .code-preview {
          background: ${isDark ? '#1e293b' : '#1e293b'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .code-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .code-filename {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'Courier New', monospace;
        }

        .code-content {
          padding: 24px;
        }

        .code-content pre {
          margin: 0;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.8;
          color: #e2e8f0;
        }

        .code-keyword { color: #c084fc; }
        .code-function { color: #60a5fa; }
        .code-component { color: #f472b6; }
        .code-string { color: #34d399; }

        /* Features Section */
        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 40px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 12px 0;
          letter-spacing: -1px;
        }

        .section-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .feature-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Tech Section */
        .tech-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }

        .tech-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 64px 48px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
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

        .tech-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
        }

        .tech-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          transition: all 0.2s;
        }

        .tech-item:hover {
          border-color: var(--border-hover);
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
        }

        .tech-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        /* CTA Section */
        .cta-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }

        .cta-card {
          background: ${isDark ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #1e293b, #0f172a)'};
          border-radius: 24px;
          padding: 80px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-title {
          font-size: 40px;
          font-weight: 800;
          color: white;
          margin: 0 0 16px 0;
        }

        .cta-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 40px 0;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cta-card .btn-primary-large {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .cta-card .btn-outline-large {
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .cta-card .btn-outline-large:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border-color);
          padding: 32px 24px;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-text {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            text-align: center;
            padding: 100px 24px 60px;
          }

          .hero-description {
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-actions,
          .hero-stats {
            justify-content: center;
          }

          .hero-title {
            font-size: 40px;
          }

          .hero-visual {
            width: 100%;
            max-width: 500px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .section-title {
            font-size: 28px;
          }

          .cta-title {
            font-size: 28px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .tech-card,
          .cta-card {
            padding: 40px 24px;
          }

          .nav-links {
            gap: 4px;
          }

          .nav-link {
            display: none;
          }
        }
      `}</style>
    </>
  );
}