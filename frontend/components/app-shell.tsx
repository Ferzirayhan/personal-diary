"use client";

import { useAuth } from "@/providers/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode, useState } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { auth, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);
  const isEntries = pathname === "/dashboard" || (pathname.startsWith("/dashboard/") && !pathname.startsWith("/dashboard/new"));
  const isNewEntry = pathname === "/dashboard/new";

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-foreground)]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)] px-4 backdrop-blur lg:hidden">
        <Link
          href="/dashboard"
          className="font-[var(--font-heading)] text-xl font-semibold tracking-tight"
          onClick={closeMenu}
        >
          {auth?.user.name ? `${auth.user.name}'s Diary` : 'My Diary'}
        </Link>
        <button
          type="button"
          className="rounded-lg border border-[var(--app-border)] bg-white px-3 py-2 text-sm transition hover:bg-[var(--app-accent)]"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-diary-nav"
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-diary-nav"
          className="fixed inset-0 z-30 flex flex-col bg-[var(--app-background)] pt-16 lg:hidden"
        >
          <div className="border-b border-[var(--app-border)] px-6 py-5">
            <p className="text-sm font-medium">{auth?.user.name}</p>
            <p className="truncate text-sm text-[var(--app-muted)]">{auth?.user.email}</p>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            <Link
              href="/dashboard"
              className={`block rounded-lg px-4 py-3 transition ${isEntries
                ? "bg-[var(--app-accent)] text-[var(--app-foreground)]"
                : "text-[var(--app-muted)] hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                }`}
              onClick={closeMenu}
            >
              All Entries
            </Link>
            <Link
              href="/dashboard/new"
              className={`block rounded-lg px-4 py-3 transition ${isNewEntry
                ? "bg-[var(--app-accent)] text-[var(--app-foreground)]"
                : "text-[var(--app-muted)] hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                }`}
              onClick={closeMenu}
            >
              New Entry
            </Link>
          </nav>
          <div className="border-t border-[var(--app-border)] p-4">
            <button
              type="button"
              className="w-full rounded-lg px-4 py-3 text-left text-[var(--app-muted)] transition hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--app-surface)] lg:flex">
          <div className="border-b border-[var(--app-border)] px-6 py-6">
            <Link href="/dashboard" className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight">
              {auth?.user.name ? `${auth.user.name}'s Diary` : 'My Diary'}
            </Link>
          </div>
          <div className="border-b border-[var(--app-border)] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--app-primary)] text-sm font-semibold text-[var(--app-primary-foreground)]">
                {auth?.user.name?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{auth?.user.name}</p>
                <p className="truncate text-sm text-[var(--app-muted)]">{auth?.user.email}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className={`block rounded-lg px-4 py-3 transition ${isEntries
                ? "bg-[var(--app-accent)] text-[var(--app-foreground)]"
                : "text-[var(--app-muted)] hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                }`}
            >
              All Entries
            </Link>
            <Link
              href="/dashboard/new"
              className={`block rounded-lg px-4 py-3 transition ${isNewEntry
                ? "bg-[var(--app-accent)] text-[var(--app-foreground)]"
                : "text-[var(--app-muted)] hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                }`}
            >
              New Entry
            </Link>
          </nav>
          <div className="border-t border-[var(--app-border)] p-4">
            <button
              type="button"
              className="w-full rounded-lg px-4 py-3 text-left text-[var(--app-muted)] transition hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 pb-8 pt-20 lg:px-8 lg:pt-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
