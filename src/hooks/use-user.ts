"use client";

import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    role: session?.user?.role ?? null,
    isAdmin: session?.user?.role === "admin",
    isModerator: session?.user?.role === "moderator",
  };
}
