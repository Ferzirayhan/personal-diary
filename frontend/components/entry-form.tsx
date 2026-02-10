"use client";

import { privateRequest } from "@/lib/api";
import { Tiptap } from "@/components/tiptap";
import { useAuth } from "@/providers/auth-provider";
import type { Entry } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial?: Entry;
};

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
      className="space-y-6"
    >
      <input
        className="w-full border-none bg-transparent font-[var(--font-heading)] text-4xl font-semibold outline-none placeholder:text-[var(--app-muted)]/70"
        placeholder="Entry title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
        <label className="mb-2 block text-sm text-[var(--app-muted)]" htmlFor="mood">
          Mood
        </label>
        <select
          id="mood"
          className="w-full rounded-lg border border-[var(--app-border)] bg-white px-4 py-2.5 text-sm outline-none ring-2 ring-transparent transition focus:ring-[var(--app-ring)]"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="calm">Calm</option>
          <option value="happy">Happy</option>
          <option value="focused">Focused</option>
          <option value="tired">Tired</option>
          <option value="anxious">Anxious</option>
        </select>
      </div>

      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <Tiptap content={content} onChange={(newContent) => setContent(newContent)} placeholder="Start writing your thoughts..." />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-4">
        <button
          className="rounded-lg px-4 py-2.5 text-[var(--app-muted)] transition hover:bg-[var(--app-accent)] hover:text-[var(--app-foreground)]"
          type="button"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-[var(--app-primary)] px-6 py-2.5 font-medium text-[var(--app-primary-foreground)] transition hover:opacity-90 disabled:opacity-70"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : initial ? "Update Entry" : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
