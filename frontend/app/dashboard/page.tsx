import { AppShell } from "@/components/app-shell";
import { EntryList } from "@/components/entry-list";
import { Protected } from "@/components/protected";

export default function DashboardPage() {
  return (
    <Protected>
      <AppShell>
        <section className="mb-8 rounded-2xl border border-ink/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Dashboard</p>
          <h1 className="font-[var(--font-heading)] text-3xl font-semibold leading-tight text-ink">Your story archive</h1>
          <p className="mt-2 text-ink/70">A chronological space to track how your days evolve.</p>
        </section>
        <EntryList />
      </AppShell>
    </Protected>
  );
}
