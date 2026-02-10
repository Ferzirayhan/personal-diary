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
    return <p>Loading entries...</p>;
  }

  if (entriesQuery.error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{(entriesQuery.error as Error).message}</p>;
  }

  if (!entriesQuery.data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/30 bg-white p-10 text-center text-ink/70">
        Belum ada entry. Mulai dari satu cerita hari ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entriesQuery.data.map((entry) => (
        <article key={entry.id} className="rounded-2xl bg-white p-5 shadow-panel">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{entry.title}</h2>
              <p className="text-xs uppercase tracking-wide text-ink/50">
                {new Date(entry.createdAt).toLocaleString()} • Mood: {entry.mood || "-"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link className="rounded-lg border border-ink/20 px-3 py-1.5 hover:border-ink/40" href={`/dashboard/${entry.id}/edit`}>
                Edit
              </Link>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"
                onClick={() => deleteMutation.mutate(entry.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm text-ink/80">{entry.content}</p>
        </article>
      ))}
    </div>
  );
}
