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
    <div className="mx-auto mt-20 w-full max-w-md rounded-2xl bg-white p-8 shadow-panel">
      <h1 className="mb-2 text-2xl font-semibold text-ink">{type === "register" ? "Create account" : "Welcome back"}</h1>
      <p className="mb-6 text-sm text-ink/60">Start writing your thoughts with a calm, clean flow.</p>

      <form className="space-y-4" onSubmit={submit}>
        {type === "register" && (
          <input
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine transition focus:ring-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine transition focus:ring-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine transition focus:ring-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-ink px-4 py-3 font-medium text-white disabled:opacity-70"
        >
          {loading ? "Please wait..." : type === "register" ? "Sign up" : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        {type === "register" ? "Already have an account?" : "No account yet?"}{" "}
        <Link href={type === "register" ? "/login" : "/register"} className="font-medium text-ember">
          {type === "register" ? "Login" : "Register"}
        </Link>
      </p>
    </div>
  );
}
