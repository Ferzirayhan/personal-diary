"use client";

import { publicPost } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { AuthPayload } from "@/types";
import Link from "next/link";
import { useState } from "react";

type Props = {
  type: "login" | "register";
};

export function AuthForm({ type }: Props) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload =
        type === "register"
          ? await publicPost<AuthPayload>("/auth/signup", { name, email, password })
          : await publicPost<AuthPayload>("/auth/login", { email, password });
      login(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-background)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--app-primary)] text-xl font-semibold text-[var(--app-primary-foreground)]">
            PD
          </div>
          <h1 className="font-[var(--font-heading)] text-4xl font-semibold">
            {type === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-[var(--app-muted)]">
            {type === "register" ? "Start your personal journaling journey" : "Sign in to your personal diary"}
          </p>
        </div>

        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-sm">
          <form className="space-y-5" onSubmit={submit}>
            {type === "register" && (
              <input
                className="w-full rounded-lg border border-[var(--app-border)] bg-white px-4 py-2.5 outline-none ring-2 ring-transparent transition focus:ring-[var(--app-ring)]"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              className="w-full rounded-lg border border-[var(--app-border)] bg-white px-4 py-2.5 outline-none ring-2 ring-transparent transition focus:ring-[var(--app-ring)]"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-[var(--app-border)] bg-white px-4 py-2.5 outline-none ring-2 ring-transparent transition focus:ring-[var(--app-ring)]"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--app-primary)] px-4 py-2.5 font-medium text-[var(--app-primary-foreground)] transition hover:opacity-90 disabled:opacity-70"
            >
              {loading ? "Please wait..." : type === "register" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--app-muted)]">
            {type === "register" ? "Already have an account?" : "No account yet?"}{" "}
            <Link href={type === "register" ? "/login" : "/register"} className="font-semibold text-[var(--app-primary)]">
              {type === "register" ? "Sign in" : "Create one"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
