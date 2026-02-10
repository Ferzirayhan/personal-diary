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
      className="space-y-4"
    >
      <input
        className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine focus:ring-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine focus:ring-2"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        <option value="calm">Calm</option>
        <option value="happy">Happy</option>
        <option value="focused">Focused</option>
        <option value="tired">Tired</option>
        <option value="anxious">Anxious</option>
      </select>

      <Tiptap
        content={content}
        onChange={(newContent) => setContent(newContent)}
        placeholder="Write your day..."
      />

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button className="rounded-xl bg-ink px-5 py-3 font-medium text-white" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : initial ? "Update Entry" : "Save Entry"}
      </button>
    </form>
  );
}
