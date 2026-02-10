import { AppShell } from "@/components/app-shell";
import { EntryForm } from "@/components/entry-form";
import { Protected } from "@/components/protected";

export default function NewEntryPage() {
  return (
    <Protected>
      <AppShell>
        <h1 className="mb-5 font-[var(--font-heading)] text-3xl font-semibold">Write new entry</h1>
        <EntryForm />
      </AppShell>
    </Protected>
  );
}
