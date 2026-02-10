import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { EntryList } from "@/components/entry-list";
import { Protected } from "@/components/protected";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Protected>
      <AppShell>
        <section className="mb-8 flex flex-wrap items-end justify-between gap-6 px-4 sm:px-0">
          <DashboardHeader />
          <Link
            href="/dashboard/new"
            className="btn-primary shadow-lg shadow-clay/20 transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-clay/30"
          >
            Write Check-in
          </Link>
        </section>
        <EntryList />
      </AppShell>
    </Protected>
  );
}
