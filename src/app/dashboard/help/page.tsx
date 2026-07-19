"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

export default function HelpPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  if (status === "loading") {
    return (
      <div className="help-loading">
        <div className="loading-pulse">
          <div className="pulse-ring" />
          <div className="pulse-ring delay" />
          <div className="pulse-ring delay-2" />
        </div>
        <p>Loading help center...</p>
        <style jsx>{`
          .help-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 24px;
          }
          .loading-pulse {
            position: relative;
            width: 48px;
            height: 48px;
          }
          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid var(--accent);
            animation: pulse-ring 1.5s ease-out infinite;
          }
          .delay { animation-delay: 0.5s; }
          .delay-2 { animation-delay: 1s; }
          @keyframes pulse-ring {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          p {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }
  if (!session?.user) return null;

  const isDark = theme === "dark";

  const faqs = [
    {
      q: "How do I get started?",
      a: "After logging in, you'll be taken to your dashboard. From there, you can navigate using the sidebar to access different sections like Profile, Documents, Users, and Settings. Start by completing your profile and exploring the features.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "#6366f1",
    },
    {
      q: "How do I upload a profile photo?",
      a: "Go to your Profile page and click the camera icon on your avatar. You can upload a photo from your device (JPEG, PNG, GIF, or WebP, max 5MB) or paste an image URL directly.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      color: "#8b5cf6",
    },
    {
      q: "How do I change my password?",
      a: "Navigate to Settings and scroll to the Password section. Enter your current password and your new password, then click 'Update Password'. Make sure your new password is at least 8 characters long.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      color: "#10b981",
    },
    {
      q: "How do I manage users?",
      a: "If you have admin privileges, go to the Users page. You can view all users, search for specific users, add new users, edit user details (name, email, role, status), and delete users when needed.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "#f59e0b",
    },
    {
      q: "How do I upload documents?",
      a: "Go to the Documents page and click 'Add Document'. You can upload a file or manually enter document details like name, type, and size. Documents are stored securely in the system.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      color: "#ef4444",
    },
    {
      q: "How do notifications work?",
      a: "Notifications appear in the Notifications page. You'll receive notifications for important events like welcome messages, security alerts, and profile updates. Click a notification to mark it as read.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      color: "#06b6d4",
    },
    {
      q: "How do I enable dark mode?",
      a: "Click the sun/moon toggle in the top header bar to switch between light and dark mode. Your preference is saved automatically and will persist across sessions.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      color: "#6366f1",
    },
    {
      q: "What roles are available?",
      a: "There are three roles: Admin (full access), Moderator (can manage content and users), and User (basic access). Admins can change user roles from the Users page.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      color: "#8b5cf6",
    },
    {
      q: "How do I contact support?",
      a: "You can reach our support team through the contact options below. We offer live chat during business hours and email support 24/7. We typically respond within 24 hours.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: "#10b981",
    },
    {
      q: "Is my data secure?",
      a: "Yes! We use industry-standard encryption for all data. Passwords are hashed using bcrypt, all connections use SSL. You can enable two-factor authentication in Settings for extra security.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      ),
      color: "#f59e0b",
    },
  ];

  const guides = [
    { title: "Getting Started Guide", desc: "Learn the basics of navigating the platform", steps: ["Create your account", "Complete your profile", "Explore the dashboard", "Upload your first document"], color: "#6366f1" },
    { title: "Profile Management", desc: "How to manage your personal information", steps: ["Update your name and email", "Upload a profile photo", "Write a bio", "Save your changes"], color: "#8b5cf6" },
    { title: "Security Best Practices", desc: "Keep your account safe and secure", steps: ["Use a strong password", "Enable two-factor authentication", "Review active sessions", "Log out from shared devices"], color: "#10b981" },
    { title: "Document Management", desc: "Upload, organize, and manage your files", steps: ["Click Add Document", "Choose a file or enter details", "Set document type and size", "Access documents anytime"], color: "#f59e0b" },
    { title: "User Administration", desc: "Manage users and permissions (Admin only)", steps: ["View all users", "Add new users", "Edit user roles", "Manage user status"], color: "#ef4444" },
    { title: "Settings & Preferences", desc: "Customize your experience", steps: ["Toggle dark mode", "Manage notifications", "Change password", "Update preferences"], color: "#06b6d4" },
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGuides = guides.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.desc.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="help-container">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-grid" />
        </div>

        {/* Header */}
        <div className="help-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="help-title">Help Center</h1>
              <p className="help-subtitle">Find answers, guides, and support</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-card">
          <div className="card-glow" />
          <div className="search-icon-large">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="search-title">How can we help you?</h2>
          <p className="search-subtitle">Search our help articles, FAQs, and guides</p>
          <div className="search-wrapper">
            <div className="search-input-group">
              <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help..."
                className="search-input"
              />
              {search && (
                <button onClick={() => setSearch("")} className="search-clear-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            onClick={() => setActiveTab("faq")}
            className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            FAQs
          </button>
          <button
            onClick={() => setActiveTab("guides")}
            className={`tab-btn ${activeTab === "guides" ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Guides
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact
          </button>
        </div>

        {/* FAQs Tab */}
        {activeTab === "faq" && (
          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 className="empty-title">No FAQs found</h3>
                <p className="empty-subtitle">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <div key={i} className={`faq-item ${expandedFaq === i ? 'expanded' : ''}`}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="faq-question"
                  >
                    <div className="faq-icon" style={{ background: `${faq.color}15`, color: faq.color }}>
                      {faq.icon}
                    </div>
                    <span className="faq-text">{faq.q}</span>
                    <svg 
                      className={`faq-chevron ${expandedFaq === i ? 'rotated' : ''}`}
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {expandedFaq === i && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === "guides" && (
          <div className="guides-grid">
            {filteredGuides.length === 0 ? (
              <div className="empty-state full-width">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h3 className="empty-title">No guides found</h3>
                <p className="empty-subtitle">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredGuides.map((guide, i) => (
                <div key={i} className="guide-card">
                  <div className="guide-header" style={{ borderLeftColor: guide.color }}>
                    <div className="guide-icon" style={{ background: `${guide.color}15`, color: guide.color }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="guide-title">{guide.title}</h3>
                      <p className="guide-desc">{guide.desc}</p>
                    </div>
                  </div>
                  <ol className="guide-steps">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="guide-step">
                        <span className="step-number" style={{ color: guide.color }}>{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="contact-grid">
            {[
              { 
                title: "Live Chat", 
                desc: "Chat with our support team in real-time", 
                action: "Start Chat", 
                color: "#6366f1", 
                available: "Available 9am-5pm EST",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )
              },
              { 
                title: "Email Support", 
                desc: "Send us an email and we'll respond within 24 hours", 
                action: "Send Email", 
                color: "#10b981", 
                available: "24/7 Support",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                )
              },
              { 
                title: "Documentation", 
                desc: "Browse our comprehensive documentation", 
                action: "View Docs", 
                color: "#8b5cf6", 
                available: "Always Available",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )
              },
              { 
                title: "Report a Bug", 
                desc: "Found an issue? Let us know and we'll fix it", 
                action: "Report Bug", 
                color: "#f59e0b", 
                available: "Response within 48 hours",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )
              },
              { 
                title: "Feature Request", 
                desc: "Suggest a new feature or improvement", 
                action: "Suggest Feature", 
                color: "#ef4444", 
                available: "Reviewed weekly",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )
              },
              { 
                title: "Community Forum", 
                desc: "Join discussions with other users", 
                action: "Visit Forum", 
                color: "#06b6d4", 
                available: "Always Open",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )
              },
            ].map((card, i) => (
              <div key={i} className="contact-card">
                <div className="contact-icon" style={{ background: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <h3 className="contact-title">{card.title}</h3>
                <p className="contact-desc">{card.desc}</p>
                <span className="contact-available" style={{ color: card.color }}>
                  <span className="available-dot" style={{ background: card.color }} />
                  {card.available}
                </span>
                <button className="contact-btn" style={{ background: card.color }}>
                  {card.action}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .help-container {
          min-height: 100vh;
          padding: 40px 32px;
          position: relative;
          background: var(--bg-primary);
          transition: all 0.3s ease;
          max-width: 1200px;
          margin: 0 auto;
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

        /* Header */
        .help-header {
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
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

        .help-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }

        .help-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Search Card */
        .search-card {
          position: relative;
          z-index: 1;
          background: var(--bg-card);
          border-radius: 24px;
          padding: 48px 32px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          text-align: center;
          margin-bottom: 32px;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out 0.1s both;
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

        .search-icon-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--accent);
        }

        .search-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .search-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0 0 24px 0;
        }

        .search-wrapper {
          max-width: 550px;
          margin: 0 auto;
        }

        .search-input-group {
          position: relative;
        }

        .search-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 16px 48px 16px 52px;
          border: 2px solid var(--border-color-strong);
          border-radius: 16px;
          font-size: 16px;
          color: var(--text-primary);
          background: var(--bg-input);
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          background: var(--bg-card);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--bg-input);
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          transition: all 0.2s ease;
        }

        .search-clear-btn:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        /* Tab Navigation */
        .tab-nav {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 6px;
          margin-bottom: 24px;
          width: fit-content;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-input);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        /* FAQ List */
        .faq-list {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .faq-item {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: var(--border-color-strong);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .faq-item.expanded {
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.1);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s ease;
        }

        .faq-question:hover {
          background: var(--bg-input);
        }

        .faq-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .faq-text {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .faq-chevron {
          color: var(--text-tertiary);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .faq-chevron.rotated {
          transform: rotate(180deg);
          color: var(--accent);
        }

        .faq-answer {
          padding: 0 24px 24px 84px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .faq-answer p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.8;
          margin: 0;
        }

        /* Guides Grid */
        .guides-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .guide-card {
          background: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          padding: 24px;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .guide-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
          border-color: var(--border-color-strong);
        }

        .guide-header {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .guide-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .guide-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .guide-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .guide-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .guide-step {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--text-secondary);
          padding: 10px 14px;
          background: var(--bg-input);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .guide-step:hover {
          background: var(--bg-card-hover);
          transform: translateX(4px);
        }

        .step-number {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 64px 24px;
          background: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--text-tertiary);
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .empty-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Contact Grid */
        .contact-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .contact-card {
          background: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contact-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
          border-color: var(--border-color-strong);
        }

        .contact-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .contact-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .contact-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .contact-available {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .available-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .contact-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          filter: brightness(1.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .help-container {
            padding: 24px 16px;
          }

          .help-title {
            font-size: 28px;
          }

          .search-card {
            padding: 32px 20px;
          }

          .search-title {
            font-size: 20px;
          }

          .tab-nav {
            width: 100%;
          }

          .tab-btn {
            flex: 1;
            justify-content: center;
            padding: 10px 16px;
            font-size: 14px;
          }

          .guides-grid {
            grid-template-columns: 1fr;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .faq-question {
            padding: 16px;
          }

          .faq-answer {
            padding: 0 16px 16px 68px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
          }
        }

        @media (max-width: 480px) {
          .help-title {
            font-size: 24px;
          }

          .tab-btn {
            padding: 8px 12px;
            font-size: 13px;
            gap: 4px;
          }

          .faq-icon {
            width: 36px;
            height: 36px;
          }

          .faq-answer {
            padding: 0 12px 12px 52px;
          }
        }
      `}</style>
    </>
  );
}