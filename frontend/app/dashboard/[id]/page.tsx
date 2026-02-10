"use client";

import { AppShell } from "@/components/app-shell";
import { Protected } from "@/components/protected";
import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const entryQuery = useQuery({
    queryKey: ["entry", params.id],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<Entry>(`/entries/${params.id}`, auth.token, "GET");
    },
    enabled: !!auth,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<null>(`/entries/${params.id}`, auth.token, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      router.push("/dashboard");
    },
  });

  const lockMutation = useMutation({
    mutationFn: async (lock: boolean) => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<Entry>(`/entries/${params.id}/${lock ? "lock" : "unlock"}`, auth.token, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["entry", params.id] });
    },
  });

  return (
    <Protected>
      <AppShell>
        {entryQuery.isLoading && <p className="glass-card px-4 py-3 text-sm text-[var(--app-muted)]">Loading entry...</p>}
        {entryQuery.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{(entryQuery.error as Error).message}</p>}

        {entryQuery.data && (
          <>
            <div className="mb-5">
              <Link href="/dashboard" className="text-sm font-medium text-[var(--app-muted)] transition hover:text-[var(--app-foreground)]">
                Back to all entries
              </Link>
            </div>

            <section className="glass-card mb-5 p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="chip capitalize">{entryQuery.data.mood}</span>
                  <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold leading-tight">{entryQuery.data.title}</h1>
                  <p className="mt-2 text-sm text-[var(--app-muted)]">
                    {new Date(entryQuery.data.createdAt).toLocaleDateString()} · Updated {new Date(entryQuery.data.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => lockMutation.mutate(!entryQuery.data?.locked)}
                    disabled={lockMutation.isPending}
                  >
                    {entryQuery.data.locked ? "Unlock" : "Lock"}
                  </button>
                  <Link href={`/dashboard/${entryQuery.data.id}/edit`} className="btn-ghost">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    onClick={() => setConfirmDelete(true)}
                    disabled={entryQuery.data.locked}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {entryQuery.data.locked && (
                <p className="mt-3 inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  🔒 Locked entry
                </p>
              )}
              {entryQuery.data.oneLine && (
                <p className="mt-3 text-sm italic text-[var(--app-foreground)]">“{entryQuery.data.oneLine}”</p>
              )}
            </section>

            <article className="glass-card p-7 sm:p-8">
              <div className="prose prose-sm max-w-none text-[var(--app-foreground)] sm:prose-base" dangerouslySetInnerHTML={{ __html: entryQuery.data.content }} />
            </article>

            <section className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="glass-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--app-muted)]">Someone Was There</p>
                <p className="mt-2 text-sm">{entryQuery.data.someoneWasThere ? "Yes" : "No"}</p>
                {entryQuery.data.someoneCareNote && <p className="mt-2 text-sm text-[var(--app-muted)]">{entryQuery.data.someoneCareNote}</p>}
              </div>
              <div className="glass-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--app-muted)]">Quiet Gratitude</p>
                <p className="mt-2 text-sm text-[var(--app-foreground)]">{entryQuery.data.quietGratitude || "-"}</p>
              </div>
            </section>
            {entryQuery.data.closeTheDay && (
              <p className="mt-4 inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                Today, this was enough.
              </p>
            )}
          </>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-white p-6 shadow-xl">
              <h2 className="font-[var(--font-heading)] text-2xl font-semibold">Delete Entry</h2>
              <p className="mt-2 text-sm text-[var(--app-muted)]">Are you sure? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </Protected>
  );
}
