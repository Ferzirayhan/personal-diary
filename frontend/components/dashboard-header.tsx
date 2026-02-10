"use client";

import { useAuth } from "@/providers/auth-provider";

export function DashboardHeader() {
    const { auth } = useAuth();

    return (
        <div>
            <h1 className="font-[var(--font-heading)] text-3xl font-semibold leading-tight">
                {auth?.user.name ? `${auth.user.name}'s Diary` : 'My Diary'}
            </h1>
            <p className="mt-1 text-sm text-[var(--app-muted)]">Your saved entries and reflections</p>
        </div>
    );
}
