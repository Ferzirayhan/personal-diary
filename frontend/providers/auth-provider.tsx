"use client";

import { clearAuth, getAuth, saveAuth } from "@/lib/auth-store";
import type { AuthPayload } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  auth: AuthPayload | null;
  login: (payload: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthPayload | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider mounted. Checking auth...");
    try {
      const stored = getAuth();
      console.log("Stored auth:", stored);
      setAuth(stored);
    } catch (e) {
      console.error("Error reading auth:", e);
    } finally {
      setReady(true);
      console.log("AuthProvider ready set to true");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      login: (payload) => {
        saveAuth(payload);
        setAuth(payload);
        router.push("/dashboard");
      },
      logout: () => {
        clearAuth();
        setAuth(null);
        router.push("/login");
      },
    }),
    [auth, router],
  );

  if (!ready) {
    return <div className="p-10 text-center text-sm">Preparing your diary...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
