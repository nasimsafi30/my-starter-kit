"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export default function ActivityPage() {
  const { data: session, status } = useSession();
  const [grouped, setGrouped] = useState<Record<string, ActivityItem[]>>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [fetched, setFetched] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode from HTML class
  useEffect(() => {
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDark(hasDarkClass);
      console.log('Dark mode:', hasDarkClass); // Debug log
    };

    // Initial check
    checkTheme();

    // Watch for class changes on HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
      return;
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && !fetched) {
      setFetched(true);
      setLoading(true);
      fetch("/api/activity")
        .then((res) => res.json())
        .then((data) => {
          setActivities(data.activities || []);
          setGrouped(data.grouped || {});
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [status, fetched]);

  const refreshActivity = useCallback(() => {
    setLoading(true);
    fetch("/api/activity")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.activities || []);
        setGrouped(data.grouped || {});
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getActionIcon = (action: string, entity: string): string => {
    const a = action.toLowerCase();
    const e = (entity || "").toLowerCase();
    if (a.includes("login") || a.includes("logout")) return "🔑";
    if (a.includes("profile") || a.includes("updated")) return "👤";
    if (a.includes("password") || a.includes("security")) return "🔒";
    if (a.includes("document") || a.includes("upload") || a.includes("file")) return "📄";
    if (a.includes("delete") || a.includes("remove")) return "🗑️";
    if (a.includes("create") || a.includes("add")) return "✨";
    if (a.includes("setting") || a.includes("preference")) return "⚙️";
    if (a.includes("view") || a.includes("page")) return "👁️";
    if (e.includes("payment") || e.includes("billing")) return "💳";
    return "📌";
  };

  const getActionColor = (action: string): string => {
    const a = action.toLowerCase();
    if (a.includes("login")) return "#10b981";
    if (a.includes("logout")) return "#6b7280";
    if (a.includes("delete")) return "#ef4444";
    if (a.includes("create") || a.includes("upload")) return "#3b82f6";
    if (a.includes("update") || a.includes("change")) return "#8b5cf6";
    if (a.includes("security") || a.includes("password")) return "#f59e0b";
    return "#6b7280";
  };

  const formatTime = (date: string): string => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const entityTypes = [...new Set(activities.map((a) => a.entity).filter(Boolean))] as string[];

  // Define all colors based on isDark
  const colors = {
    pageBg: isDark ? "#0f172a" : "#f8fafc",
    cardBg: isDark ? "#1e293b" : "#ffffff",
    cardBorder: isDark ? "#334155" : "#e2e8f0",
    textPrimary: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    textMuted: isDark ? "#64748b" : "#94a3b8",
    hoverBg: isDark ? "#334155" : "#f1f5f9",
    buttonBg: isDark ? "#0f172a" : "#f1f5f9",
    buttonBorder: isDark ? "#334155" : "#e2e8f0",
    badgeBg: isDark ? "#334155" : "#f1f5f9",
    badgeText: isDark ? "#cbd5e1" : "#475569",
    shadow: isDark ? "0 4px 6px -1px rgba(0,0,0,0.3)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
    activeFilterBg: isDark ? "#3b82f6" : "#0f172a",
    activeFilterText: "#ffffff",
  };

  if (status === "loading" || loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        backgroundColor: colors.pageBg,
        transition: "background-color 0.3s",
      }}>
        <p style={{ color: colors.textSecondary, fontSize: "15px" }}>
          Loading activity...
        </p>
      </div>
    );
  }
  
  if (!session?.user) return null;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.pageBg,
      transition: "background-color 0.3s",
      padding: "32px 24px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: colors.shadow,
          transition: "all 0.3s",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}>
            <div>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "800",
                color: colors.textPrimary,
                margin: "0 0 4px 0",
                transition: "color 0.3s",
              }}>
                📊 Activity Log
              </h1>
              <p style={{
                color: colors.textSecondary,
                margin: 0,
                fontSize: "15px",
                transition: "color 0.3s",
              }}>
                {activities.length} total activities recorded
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                backgroundColor: colors.buttonBg,
                border: `1px solid ${colors.buttonBorder}`,
                borderRadius: "12px",
                padding: "10px 20px",
                transition: "all 0.3s",
              }}>
                <span style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: colors.textPrimary,
                  transition: "color 0.3s",
                }}>
                  {activities.length}
                </span>
                <span style={{
                  fontSize: "13px",
                  color: colors.textSecondary,
                  marginLeft: "8px",
                  transition: "color 0.3s",
                }}>
                  events
                </span>
              </div>
              <button
                onClick={refreshActivity}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.buttonBorder}`,
                  backgroundColor: colors.cardBg,
                  color: colors.textPrimary,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBg;
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13px",
              border: filter === "all" ? "none" : `1px solid ${colors.buttonBorder}`,
              backgroundColor: filter === "all" ? colors.activeFilterBg : colors.cardBg,
              color: filter === "all" ? colors.activeFilterText : colors.textPrimary,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            All
          </button>
          {entityTypes.map((entity) => (
            <button
              key={entity}
              onClick={() => setFilter(entity)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "capitalize",
                border: filter === entity ? "none" : `1px solid ${colors.buttonBorder}`,
                backgroundColor: filter === entity ? colors.activeFilterBg : colors.cardBg,
                color: filter === entity ? colors.activeFilterText : colors.textPrimary,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {entity}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(grouped).length === 0 ? (
          <div style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "20px",
            padding: "60px 24px",
            textAlign: "center",
            boxShadow: colors.shadow,
            transition: "all 0.3s",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: colors.textPrimary,
              margin: "0 0 8px 0",
              transition: "color 0.3s",
            }}>
              No activity yet
            </h3>
            <p style={{
              color: colors.textSecondary,
              fontSize: "14px",
              margin: 0,
              transition: "color 0.3s",
            }}>
              Your activity will appear here as you use the platform.
            </p>
          </div>
        ) : (
          /* Activity Groups */
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: "700",
                color: colors.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "16px",
                paddingLeft: "4px",
                transition: "color 0.3s",
              }}>
                📅 {date}
              </h3>
              <div style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: colors.shadow,
                transition: "all 0.3s",
              }}>
                {items
                  .filter((a) => filter === "all" || a.entity === filter)
                  .map((activity, i) => {
                    const color = getActionColor(activity.action);
                    const icon = getActionIcon(activity.action, activity.entity);
                    const isLast = i === items.filter((a) => filter === "all" || a.entity === filter).length - 1;
                    
                    return (
                      <div
                        key={activity.id || i}
                        style={{
                          display: "flex",
                          gap: "16px",
                          padding: "16px 20px",
                          borderBottom: isLast ? "none" : `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}`,
                          alignItems: "flex-start",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          backgroundColor: `${color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "20px",
                        }}>
                          {icon}
                        </div>
                        
                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "16px",
                          }}>
                            <div>
                              <p style={{
                                fontWeight: "600",
                                color: colors.textPrimary,
                                fontSize: "14px",
                                margin: "0 0 6px 0",
                                transition: "color 0.3s",
                              }}>
                                {activity.action}
                              </p>
                              <div style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}>
                                {activity.entity && (
                                  <span style={{
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    backgroundColor: colors.badgeBg,
                                    color: colors.badgeText,
                                    fontWeight: "600",
                                    textTransform: "capitalize",
                                    transition: "all 0.3s",
                                  }}>
                                    {activity.entity}
                                  </span>
                                )}
                                <span style={{
                                  fontSize: "12px",
                                  color: colors.textMuted,
                                  transition: "color 0.3s",
                                }}>
                                  🕐 {formatTime(activity.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}