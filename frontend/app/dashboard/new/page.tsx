import { AppShell } from "@/components/app-shell";
import { EntryForm } from "@/components/entry-form";
import { Protected } from "@/components/protected";
import Link from "next/link";

export default function NewEntryPage() {
  return (
    <Protected>
      <AppShell>
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-[var(--app-muted)] transition hover:text-[var(--app-foreground)]">
            Back to all entries
          </Link>
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold">New Entry</h1>
        </div>
        <EntryForm />
      </AppShell>
    </Protected>
  );
}
