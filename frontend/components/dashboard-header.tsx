"use client";

import { useAuth } from "@/providers/auth-provider";

export function DashboardHeader() {
  const { auth } = useAuth();
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <p className="font-heading text-sm font-semibold uppercase tracking-widest text-clay/80">{today}</p>
      <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl">
        {auth?.user.name ? <span className="text-pine">Hello, {auth.user.name}.</span> : "Good evening."}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Ready to capture a moment of joy today?
      </p>
    </div>
  );
}
