"use client";

import { useUI } from "@/providers/ui-provider";

export function UIControls({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useUI();

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "rounded-xl bg-white/60 p-2 backdrop-blur-sm"}`}>
      <label className="sr-only">{t("lang_label")}</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "id" | "de")}
        className="rounded-lg border border-black/10 bg-white/90 px-2 py-1 text-xs text-ink"
      >
        <option value="en">🇬🇧</option>
        <option value="id">🇮🇩</option>
        <option value="de">🇩🇪</option>
      </select>
    </div>
  );
}
