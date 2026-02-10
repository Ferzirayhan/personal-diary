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
        {entryQuery.isLoading && (
          <p className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-muted)]">
            Loading entry...
          </p>
        )}
        {entryQuery.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{(entryQuery.error as Error).message}</p>}

        {entryQuery.data && (
          <>
            <div className="mb-6">
              <Link href="/dashboard" className="text-sm text-[var(--app-muted)] transition hover:text-[var(--app-foreground)]">
                Back to all entries
              </Link>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-[var(--font-heading)] text-3xl font-semibold">{entryQuery.data.title}</h1>
                  <p className="mt-1 text-sm text-[var(--app-muted)]">
                    {new Date(entryQuery.data.createdAt).toLocaleDateString()} - Updated {new Date(entryQuery.data.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/${entryQuery.data.id}/edit`}
                    className="rounded-lg border border-[var(--app-border)] bg-[var(--app-accent)] px-3 py-2 text-sm text-[var(--app-foreground)] transition hover:opacity-90"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--app-border)] bg-[var(--app-accent)] px-3 py-2 text-sm text-red-700 transition hover:opacity-90"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8">
              <div className="prose prose-sm max-w-none text-[var(--app-foreground)] sm:prose-base" dangerouslySetInnerHTML={{ __html: entryQuery.data.content }} />
            </article>
          </>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-md rounded-xl border border-[var(--app-border)] bg-white p-6">
              <h2 className="font-[var(--font-heading)] text-xl font-semibold">Delete Entry</h2>
              <p className="mt-2 text-sm text-[var(--app-muted)]">Are you sure you want to delete this entry? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--app-accent)] px-4 py-2 text-sm text-[var(--app-foreground)]"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-70"
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
