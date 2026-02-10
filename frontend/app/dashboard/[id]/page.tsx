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
                  <Link href={`/dashboard/${entryQuery.data.id}/edit`} className="btn-ghost">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </section>

            <article className="glass-card p-7 sm:p-8">
              <div className="prose prose-sm max-w-none text-[var(--app-foreground)] sm:prose-base" dangerouslySetInnerHTML={{ __html: entryQuery.data.content }} />
            </article>
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
