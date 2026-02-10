"use client";

import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const moodStyles: Record<string, string> = {
  calm: "bg-teal-50 text-teal-700 border-teal-100",
  happy: "bg-amber-50 text-amber-700 border-amber-100",
  focused: "bg-blue-50 text-blue-700 border-blue-100",
  tired: "bg-slate-50 text-slate-700 border-slate-200",
  anxious: "bg-rose-50 text-rose-700 border-rose-100",
};

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

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
    return <p className="glass-card px-4 py-3 text-sm text-[var(--app-muted)]">Loading entries...</p>;
  }

  if (entriesQuery.error) {
    return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{(entriesQuery.error as Error).message}</p>;
  }

  if (!entriesQuery.data?.length) {
    return (
      <div className="glass-card flex min-h-[58vh] flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex rounded-full bg-[var(--app-accent)] px-4 py-1 text-sm font-semibold text-[var(--teal)]">Start here</div>
        <h2 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold">Write your first joyful note</h2>
        <p className="mt-3 max-w-md text-sm text-[var(--app-muted)]">
          Begin with one sentence about today. You can always return and expand it later.
        </p>
        <Link href="/dashboard/new" className="btn-primary mt-6 px-6">
          Create First Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entriesQuery.data.map((entry, index) => {
        const moodClass = moodStyles[entry.mood] ?? "bg-slate-50 text-slate-700 border-slate-200";
        return (
          <article
            key={entry.id}
            className="glass-card group p-5"
            style={{ animation: `fadeIn 280ms ease ${index * 70}ms both` }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <Link href={`/dashboard/${entry.id}`} className="min-w-0">
                <h2 className="line-clamp-2 font-[var(--font-heading)] text-2xl font-semibold leading-tight transition group-hover:text-[var(--primary-strong)]">
                  {entry.title}
                </h2>
              </Link>
              <span className={`chip border ${moodClass}`}>{entry.mood}</span>
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-[var(--app-muted)]">
              {plainText(entry.content) || "No content"}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--app-border)] pt-4">
              <div className="text-xs text-[var(--app-muted)]">
                <p>{new Date(entry.createdAt).toLocaleDateString()}</p>
                <p>Updated {new Date(entry.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Link className="btn-ghost px-3 py-2" href={`/dashboard/${entry.id}/edit`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-medium text-red-700 transition hover:bg-red-100"
                  onClick={() => deleteMutation.mutate(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
