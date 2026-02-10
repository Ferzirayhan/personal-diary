"use client";

import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export function EntryList() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      if (!auth) return [] as Entry[];
      return privateRequest<Entry[]>("/entries", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<null>(`/entries/${id}`, auth.token, "DELETE");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] }),
  });

  if (entriesQuery.isLoading) {
    return (
      <p className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-muted)]">
        Loading entries...
      </p>
    );
  }

  if (entriesQuery.error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{(entriesQuery.error as Error).message}</p>;
  }

  if (!entriesQuery.data?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--app-accent)]/70">
          <span className="font-[var(--font-heading)] text-2xl">DIARY</span>
        </div>
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold">No diary entries yet</h2>
        <p className="mt-2 max-w-md text-sm text-[var(--app-muted)]">
          Start your journaling journey by creating your first diary entry.
        </p>
        <Link
          href="/dashboard/new"
          className="mt-6 rounded-lg bg-[var(--app-primary)] px-6 py-2.5 font-medium text-[var(--app-primary-foreground)] transition hover:opacity-90"
        >
          Create Your First Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entriesQuery.data.map((entry) => (
        <article
          key={entry.id}
          className="group rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-left transition hover:border-[var(--app-ring)]"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <Link href={`/dashboard/${entry.id}`} className="min-w-0">
              <h2 className="line-clamp-1 font-[var(--font-heading)] text-2xl font-semibold transition group-hover:text-[var(--app-primary)]">
                {entry.title}
              </h2>
            </Link>
            <div className="flex shrink-0 items-center gap-2 text-sm">
              <Link
                className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-[var(--app-muted)] transition hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
                href={`/dashboard/${entry.id}/edit`}
              >
                Edit
              </Link>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700 transition hover:bg-red-50"
                onClick={() => deleteMutation.mutate(entry.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mb-4 line-clamp-2 text-sm text-[var(--app-muted)]">
            {entry.content.replace(/<[^>]*>/g, "").trim() || "No content"}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--app-muted)]">
            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
            <span>{new Date(entry.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
