"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function Protected({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.replace("/login");
    }
  }, [auth, router]);

  if (!auth) {
    return <div className="p-6 text-sm">Redirecting...</div>;
  }

  return <>{children}</>;
}
