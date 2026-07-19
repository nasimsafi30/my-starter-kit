"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "minimal" | "pill";
}

export function Breadcrumb({ items, className, variant = "default" }: BreadcrumbProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style jsx global>{`
        :root {
          --breadcrumb-bg: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          --breadcrumb-border: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          --breadcrumb-hover: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)'};
          --breadcrumb-text: ${isDark ? '#94a3b8' : '#64748b'};
          --breadcrumb-text-hover: ${isDark ? '#e2e8f0' : '#334155'};
          --breadcrumb-active: ${isDark ? '#e2e8f0' : '#0f172a'};
          --breadcrumb-separator: ${isDark ? '#475569' : '#cbd5e1'};
          --breadcrumb-accent: #6366f1;
        }
      `}</style>

      <nav 
        className={cn("breadcrumb", `breadcrumb-${variant}`, className)}
        aria-label="Breadcrumb"
      >
        <ol className="breadcrumb-list">
          {/* Home Link */}
          <li className="breadcrumb-item">
            <Link 
              href="/dashboard" 
              className="breadcrumb-link breadcrumb-home"
              title="Dashboard"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="breadcrumb-label">Home</span>
            </Link>
          </li>

          {/* Breadcrumb Items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="breadcrumb-item">
                {/* Separator */}
                <div className="breadcrumb-separator">
                  {variant === "pill" ? (
                    <div className="separator-dot" />
                  ) : (
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="separator-icon"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>

                {/* Link or Text */}
                {isLast ? (
                  <span className="breadcrumb-current">
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    <span className="breadcrumb-label">{item.label}</span>
                  </span>
                ) : item.href ? (
                  <Link href={item.href} className="breadcrumb-link">
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    <span className="breadcrumb-label">{item.label}</span>
                  </Link>
                ) : (
                  <span className="breadcrumb-text">
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    <span className="breadcrumb-label">{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* Dropdown for collapsed breadcrumbs (optional future feature) */}
        {items.length > 3 && (
          <div className="breadcrumb-dropdown">
            <button className="breadcrumb-more" title="Show more">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>
        )}
      </nav>

      <style jsx>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
          gap: 0;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0;
        }

        /* Default Variant */
        .breadcrumb-default .breadcrumb-link,
        .breadcrumb-default .breadcrumb-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--breadcrumb-text);
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .breadcrumb-default .breadcrumb-link:hover {
          color: var(--breadcrumb-text-hover);
          background: var(--breadcrumb-hover);
        }

        .breadcrumb-default .breadcrumb-current {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--breadcrumb-active);
          background: var(--breadcrumb-hover);
          white-space: nowrap;
        }

        .breadcrumb-default .breadcrumb-home {
          padding: 6px 8px;
        }

        /* Minimal Variant */
        .breadcrumb-minimal .breadcrumb-link,
        .breadcrumb-minimal .breadcrumb-text {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 500;
          color: var(--breadcrumb-text);
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
          border-bottom: 1px solid transparent;
        }

        .breadcrumb-minimal .breadcrumb-link:hover {
          color: var(--breadcrumb-text-hover);
          border-bottom-color: var(--breadcrumb-border);
        }

        .breadcrumb-minimal .breadcrumb-current {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--breadcrumb-active);
          white-space: nowrap;
        }

        /* Pill Variant */
        .breadcrumb-pill .breadcrumb-link,
        .breadcrumb-pill .breadcrumb-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--breadcrumb-text);
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid transparent;
        }

        .breadcrumb-pill .breadcrumb-link:hover {
          color: var(--breadcrumb-text-hover);
          background: var(--breadcrumb-hover);
          border-color: var(--breadcrumb-border);
        }

        .breadcrumb-pill .breadcrumb-current {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .breadcrumb-pill .breadcrumb-home {
          padding: 5px 10px;
        }

        .breadcrumb-pill .breadcrumb-current .breadcrumb-label {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Separator */
        .breadcrumb-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px;
        }

        .separator-icon {
          color: var(--breadcrumb-separator);
          flex-shrink: 0;
        }

        .separator-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--breadcrumb-separator);
          flex-shrink: 0;
        }

        /* Icon */
        .breadcrumb-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Label */
        .breadcrumb-label {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        /* More Button */
        .breadcrumb-dropdown {
          display: flex;
          align-items: center;
        }

        .breadcrumb-more {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid var(--breadcrumb-border);
          color: var(--breadcrumb-text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .breadcrumb-more:hover {
          background: var(--breadcrumb-hover);
          color: var(--breadcrumb-text-hover);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .breadcrumb-default .breadcrumb-link,
          .breadcrumb-default .breadcrumb-text,
          .breadcrumb-default .breadcrumb-current {
            padding: 4px 6px;
            font-size: 12px;
          }

          .breadcrumb-label {
            max-width: 100px;
          }

          .breadcrumb-home .breadcrumb-label {
            display: none;
          }
        }
      `}</style>
    </>
  );
}