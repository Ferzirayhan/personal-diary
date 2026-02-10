"use client";

import { privateRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useUI } from "@/providers/ui-provider";
import type { MemoryLaneResponse, MoodAnalytics, OldEntryPeek } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function DashboardInsights() {
  const { auth } = useAuth();
  const { t } = useUI();

  const moodQuery = useQuery({
    queryKey: ["mood-analytics"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<MoodAnalytics>("/analytics/mood", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const memoryQuery = useQuery({
    queryKey: ["memory-lane"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<MemoryLaneResponse>("/entries/memory-lane", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const oldPeekQuery = useQuery({
    queryKey: ["old-peek"],
    queryFn: async () => {
      if (!auth) throw new Error("Unauthorized");
      return privateRequest<{ item: OldEntryPeek | null }>("/entries/old-peek", auth.token, "GET");
    },
    enabled: !!auth,
  });

  const topMood = moodQuery.data
    ? Object.entries(moodQuery.data.moodCounts).sort((a, b) => b[1] - a[1])[0]
    : undefined;

  return (
    <section className="mb-8 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">

      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">📈 Mood Analytics</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">{t("insight_mood_title")}</h3>
        {moodQuery.isLoading ? (
          <p className="mt-3 text-sm text-ink/60">{t("insight_mood_loading")}</p>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-ink/70">
            <p>{t("insight_entries")}: {moodQuery.data?.totalEntries ?? 0}</p>
            <p>{t("insight_dominant")}: {moodQuery.data?.dominantMood ?? "neutral"}</p>
            <p>{t("insight_top_count")}: {topMood ? `${topMood[0]} (${topMood[1]})` : "N/A"}</p>
            <p>{t("insight_trend")}: {moodQuery.data?.trend ?? "stable"}</p>
          </div>
        )}
      </article>

      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">🕰️ Memory Lane</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">{t("insight_memory_title")}</h3>
        {memoryQuery.isLoading ? (
          <p className="mt-3 text-sm text-ink/60">{t("insight_memory_loading")}</p>
        ) : memoryQuery.data && memoryQuery.data.items.length > 0 ? (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-ink/60">{memoryQuery.data.message}</p>
            {memoryQuery.data.items.slice(0, 1).map((item) => (
              <div key={item.id} className="rounded-xl border border-black/5 bg-white/50 p-3">
                <Link href={`/dashboard/${item.id}`} className="text-sm font-semibold text-ink hover:underline">
                  {item.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-ink/60">{plainText(item.content) || t("entry_no_content")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink/60">{t("insight_memory_empty")}</p>
        )}
      </article>

      </div>

      <article className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">📬 Unread Old Entry</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">A page from your past</h3>
        {oldPeekQuery.isLoading ? (
          <p className="mt-3 text-sm text-ink/60">Finding an older entry...</p>
        ) : oldPeekQuery.data?.item ? (
          <div className="mt-3 space-y-2">
            <Link href={`/dashboard/${oldPeekQuery.data.item.id}`} className="text-sm font-semibold text-ink hover:underline">
              {oldPeekQuery.data.item.title}
            </Link>
            <p className="text-sm text-ink/70">{oldPeekQuery.data.item.oneLine || plainText(oldPeekQuery.data.item.content)}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink/60">Write more days and this section will start showing surprises.</p>
        )}
      </article>
    </section>
  );
}
