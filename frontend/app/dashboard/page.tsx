import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { EntryList } from "@/components/entry-list";
import { Protected } from "@/components/protected";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Protected>
      <AppShell>
        <section className="mb-8 flex items-center justify-between gap-4">
          <DashboardHeader />
          <Link
            href="/dashboard/new"
            className="rounded-lg bg-[var(--app-primary)] px-4 py-2.5 text-sm font-medium text-[var(--app-primary-foreground)] transition hover:opacity-90"
          >
            New Entry
          </Link>
        </section>
        <EntryList />
      </AppShell>
    </Protected>
  );
}
