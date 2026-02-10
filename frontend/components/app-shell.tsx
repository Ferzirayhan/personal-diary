"use client";

import { useAuth } from "@/providers/auth-provider";
import { useUI } from "@/providers/ui-provider";
import { UIControls } from "@/components/ui-controls";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { auth, logout } = useAuth();
  const { t } = useUI();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      {
        href: "/dashboard",
        label: t("shell_all_entries"),
        active:
          pathname === "/dashboard" ||
          (pathname.startsWith("/dashboard/") && !pathname.startsWith("/dashboard/new")),
      },
      {
        href: "/dashboard/new",
        label: t("shell_new_entry"),
        active: pathname === "/dashboard/new",
      },
    ],
    [pathname, t]
  );

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen text-[var(--app-foreground)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-stone-100 bg-[color:color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-ghost px-3 py-2"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-diary-nav"
            >
              {mobileMenuOpen ? t("shell_close") : t("shell_menu")}
            </button>
            <Link href="/dashboard" className="font-heading text-xl font-bold tracking-tight text-ink" onClick={closeMenu}>
              HanaDiary
            </Link>
          </div>
          <UIControls compact />
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-0 hidden w-72 border-r border-stone-100 bg-[var(--bg)] px-6 pb-6 pt-8 lg:flex lg:flex-col">
        <Link href="/dashboard" className="mb-10 block font-heading text-2xl font-bold tracking-tight text-ink">
          HanaDiary
        </Link>

        <div className="mb-4">
          <UIControls />
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">{t("shell_today_focus")}</p>
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="font-heading text-lg font-medium leading-tight text-ink">
              {auth?.user.name ? `${auth.user.name}'s Journal` : "Your Journal"}
            </p>
            <p className="mt-2 text-sm text-ink/60">{t("shell_capture")}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${item.active
                ? "bg-white text-ink shadow-sm ring-1 ring-black/5"
                : "text-ink/60 hover:bg-white/50 hover:text-ink"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-stone-100 pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clay/10 text-xs font-bold text-clay">
              {auth?.user.name?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-ink">{auth?.user.name}</p>
              <p className="truncate text-xs text-ink/50">{auth?.user.email}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-all hover:bg-stone-50"
            onClick={logout}
          >
            {t("shell_sign_out")}
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <>
          <button className="fixed inset-0 z-40 bg-black/35" onClick={closeMenu} aria-label="Close menu" />
          <div id="mobile-diary-nav" className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--app-border)] bg-white p-5 shadow-2xl lg:hidden">
            <p className="font-[var(--font-heading)] text-xl font-semibold">HanaDiary</p>
            <p className="mt-1 text-sm text-[var(--app-muted)]">{auth?.user.name}</p>
            <nav className="mt-5 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${item.active
                    ? "bg-[var(--app-accent)] text-[var(--app-foreground)]"
                    : "text-[var(--app-muted)] hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                    }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button type="button" className="btn-ghost mt-6 w-full" onClick={logout}>
              {t("shell_sign_out")}
            </button>
          </div>
        </>
      )}

      <main className="px-4 pb-10 pt-20 lg:pl-[19.5rem] lg:pr-6">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
