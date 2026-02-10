"use client";

import { Tiptap } from "@/components/tiptap";
import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial?: Entry;
};

const moodOptions = ["calm", "happy", "focused", "tired", "anxious"];

export function EntryForm({ initial }: Props) {
  const { auth } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [mood, setMood] = useState(initial?.mood || "calm");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      if (initial) {
        return privateRequest<Entry>(`/entries/${initial.id}`, auth.token, "PUT", { title, content, mood });
      }
      return privateRequest<Entry>("/entries", auth.token, "POST", { title, content, mood });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      router.push("/dashboard");
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Save failed");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        mutation.mutate();
      }}
      className="space-y-5"
    >
      <section className="glass-card p-6 sm:p-7">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">Title</label>
        <input
          className="mt-2 w-full border-none bg-transparent font-[var(--font-heading)] text-4xl font-semibold leading-tight outline-none placeholder:text-[var(--app-muted)]/70"
          placeholder="How did your day feel?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">Mood</span>
          {moodOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-full border px-3 py-1 text-sm font-medium capitalize transition ${
                mood === option
                  ? "border-transparent bg-[var(--app-primary)] text-[var(--app-primary-foreground)]"
                  : "border-[var(--app-border)] bg-white text-[var(--app-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setMood(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card p-4 sm:p-6">
        <Tiptap content={content} onChange={(newContent) => setContent(newContent)} placeholder="Write your reflection, gratitude, and next move..." />
      </section>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="btn-ghost" type="button" onClick={() => router.push("/dashboard")}>
          Cancel
        </button>
        <button className="btn-primary px-6" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : initial ? "Update Entry" : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
