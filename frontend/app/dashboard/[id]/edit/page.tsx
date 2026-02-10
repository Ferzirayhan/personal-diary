"use client";

import { AppShell } from "@/components/app-shell";
import { EntryForm } from "@/components/entry-form";
import { Protected } from "@/components/protected";
import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditEntryPage() {
  const params = useParams<{ id: string }>();
  const { auth } = useAuth();

  const entryQuery = useQuery({
    queryKey: ["entry", params.id],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<Entry>(`/entries/${params.id}`, auth.token, "GET");
    },
    enabled: !!auth,
  });

  return (
    <Protected>
      <AppShell>
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-[var(--app-muted)] transition hover:text-[var(--app-foreground)]">
            Back to all entries
          </Link>
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold">Edit Entry</h1>
        </div>
        {entryQuery.isLoading && (
          <p className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-muted)]">
            Loading...
          </p>
        )}
        {entryQuery.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{(entryQuery.error as Error).message}</p>}
        {entryQuery.data && <EntryForm initial={entryQuery.data} />}
      </AppShell>
    </Protected>
  );
}
