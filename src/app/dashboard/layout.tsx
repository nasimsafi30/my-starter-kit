"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/help", label: "Help" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return <p style={{ padding: "48px", textAlign: "center" }}>Loading...</p>;
  }
  if (!session?.user) return null;

  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#111827" : "#f9fafb", transition: "background 0.3s" }}>
      <Header />
      <div style={{ display: "flex" }}>
        <aside style={{ width: "256px", borderRight: "1px solid " + (isDark ? "#374151" : "#e5e7eb"), background: isDark ? "#1f2937" : "white", minHeight: "calc(100vh - 56px)", padding: "16px" }}>
          <nav>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "block", padding: "8px 12px", borderRadius: "8px", fontSize: "14px", color: isDark ? "#d1d5db" : "#374151", textDecoration: "none", marginBottom: "4px" }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main style={{ flex: 1, padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}