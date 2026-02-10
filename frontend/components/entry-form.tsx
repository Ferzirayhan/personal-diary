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
  const [oneLine, setOneLine] = useState(initial?.oneLine || "");
  const [content, setContent] = useState(initial?.content || "");
  const [mood, setMood] = useState(initial?.mood || "calm");
  const [someoneWasThere, setSomeoneWasThere] = useState(initial?.someoneWasThere || false);
  const [someoneCareNote, setSomeoneCareNote] = useState(initial?.someoneCareNote || "");
  const [quietGratitude, setQuietGratitude] = useState(initial?.quietGratitude || "");
  const [closeTheDay, setCloseTheDay] = useState(initial?.closeTheDay || false);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      if (initial) {
        return privateRequest<Entry>(`/entries/${initial.id}`, auth.token, "PUT", {
          title,
          oneLine,
          content,
          mood,
          someoneWasThere,
          someoneCareNote,
          quietGratitude,
          closeTheDay,
        });
      }
      return privateRequest<Entry>("/entries", auth.token, "POST", {
        title,
        oneLine,
        content,
        mood,
        someoneWasThere,
        someoneCareNote,
        quietGratitude,
        closeTheDay,
      });
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

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">One Line Worth Keeping</label>
          <input
            className="mt-2 w-full rounded-xl border border-[var(--app-border)] bg-white/70 px-4 py-3 text-sm text-[var(--app-foreground)] outline-none placeholder:text-[var(--app-muted)]/70"
            placeholder="One sentence you want to remember."
            value={oneLine}
            onChange={(e) => setOneLine(e.target.value)}
          />
        </div>

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

      <section className="glass-card p-4 sm:p-6 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">Someone Was There ⭐</p>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Was someone there for you today?</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${someoneWasThere ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-[var(--app-muted)] border-[var(--app-border)]"}`}
              onClick={() => setSomeoneWasThere(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${!someoneWasThere ? "bg-slate-700 text-white border-slate-700" : "bg-white text-[var(--app-muted)] border-[var(--app-border)]"}`}
              onClick={() => setSomeoneWasThere(false)}
            >
              No
            </button>
          </div>
        </div>

        {someoneWasThere && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">What did they do?</label>
            <input
              className="mt-2 w-full rounded-xl border border-[var(--app-border)] bg-white/70 px-4 py-3 text-sm text-[var(--app-foreground)] outline-none placeholder:text-[var(--app-muted)]/70"
              placeholder="Optional note..."
              value={someoneCareNote}
              onChange={(e) => setSomeoneCareNote(e.target.value)}
            />
          </div>
        )}
      </section>

      <section className="glass-card p-4 sm:p-6">
        <Tiptap content={content} onChange={(newContent) => setContent(newContent)} placeholder="Daily reflection: talk freely, no need to be formal..." />
      </section>

      <section className="glass-card p-4 sm:p-6">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">Write a Quiet Thank You</label>
        <textarea
          className="mt-2 min-h-28 w-full rounded-xl border border-[var(--app-border)] bg-white/70 px-4 py-3 text-sm text-[var(--app-foreground)] outline-none placeholder:text-[var(--app-muted)]/70"
          placeholder="Write a thank you you may never send..."
          value={quietGratitude}
          onChange={(e) => setQuietGratitude(e.target.value)}
        />
      </section>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          className={`rounded-xl border px-4 py-2 text-sm font-medium ${closeTheDay ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-[var(--app-muted)] border-[var(--app-border)]"}`}
          type="button"
          onClick={() => setCloseTheDay((v) => !v)}
        >
          {closeTheDay ? "Today, this was enough ✓" : "Close-the-day"}
        </button>
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
