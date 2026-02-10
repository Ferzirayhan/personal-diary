"use client";

import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { DailyPrompt, MemoryLaneItem, MoodAnalytics } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function DashboardInsights() {
  const { auth } = useAuth();

  const moodQuery = useQuery({
    queryKey: ["mood-analytics"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<MoodAnalytics>("/analytics/mood", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const promptQuery = useQuery({
    queryKey: ["daily-prompt"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<DailyPrompt>("/prompts/daily", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const memoryQuery = useQuery({
    queryKey: ["memory-lane"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<MemoryLaneItem[]>("/entries/memory-lane", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const topMood = moodQuery.data
    ? Object.entries(moodQuery.data.moodCounts).sort((a, b) => b[1] - a[1])[0]
    : undefined;

  return (
    <section className="mb-8 grid gap-4 md:grid-cols-3">
      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Smart Prompt</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">Daily Prompt</h3>
        <p className="mt-3 text-sm text-ink/70">
          {promptQuery.isLoading ? "Loading prompt..." : promptQuery.data?.prompt ?? "No prompt available."}
        </p>
      </article>

      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Mood Analytics</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">Last 30 Days</h3>
        {moodQuery.isLoading ? (
          <p className="mt-3 text-sm text-ink/60">Calculating trends...</p>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-ink/70">
            <p>Entries: {moodQuery.data?.totalEntries ?? 0}</p>
            <p>Dominant mood: {moodQuery.data?.dominantMood ?? "neutral"}</p>
            <p>Top mood count: {topMood ? `${topMood[0]} (${topMood[1]})` : "N/A"}</p>
            <p>Trend: {moodQuery.data?.trend ?? "stable"}</p>
          </div>
        )}
      </article>

      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Memory Lane</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">On This Day</h3>
        {memoryQuery.isLoading ? (
          <p className="mt-3 text-sm text-ink/60">Loading memories...</p>
        ) : memoryQuery.data && memoryQuery.data.length > 0 ? (
          <div className="mt-3 space-y-3">
            {memoryQuery.data.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-xl border border-black/5 bg-white/50 p-3">
                <Link href={`/dashboard/${item.id}`} className="text-sm font-semibold text-ink hover:underline">
                  {item.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-ink/60">{plainText(item.content) || "No content"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink/60">No memory from this date yet.</p>
        )}
      </article>
    </section>
  );
}
