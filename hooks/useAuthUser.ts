"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export interface AuthUser {
  name: string;
  email: string;
  image: string | null;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * Menyatukan dua sumber login yang ada di Cardify:
 * 1. NextAuth session (Google / GitHub)
 * 2. Login manual (disimpan di localStorage)
 */
export function useAuthUser() {
  const { data: session, status: sessionStatus } = useSession();
  const [manualUser, setManualUser] = useState<AuthUser | null>(null);
  const [manualChecked, setManualChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") === "true") {
      setManualUser({
        name: localStorage.getItem("userName") || "Pengguna",
        email: localStorage.getItem("userEmail") || "user@cardify.id",
        image: null,
      });
    }
    setManualChecked(true);
  }, []);

  const user: AuthUser | null = session?.user
    ? {
        name: session.user.name || "Pengguna",
        email: session.user.email || "user@cardify.id",
        image: session.user.image || null,
      }
    : manualUser;

  let status: AuthStatus = "unauthenticated";
  if (user) status = "authenticated";
  else if (sessionStatus === "loading" && !manualChecked) status = "loading";

  const logout = useCallback(async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setManualUser(null);
    window.location.href = "/";
  }, [session]);

  return { user, status, logout };
}