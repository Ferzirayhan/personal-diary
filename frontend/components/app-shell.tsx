"use client";

import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-ink">
            Personal Diary
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/dashboard/new" className="rounded-lg bg-pine px-3 py-2 font-medium text-white hover:opacity-90">
              New Entry
            </Link>
            <span className="hidden text-ink/70 sm:block">{auth?.user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-ink/20 px-3 py-2 text-ink hover:border-ink/40"
              type="button"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
