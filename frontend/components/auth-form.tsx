"use client";

import { publicPost } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useUI } from "@/providers/ui-provider";
import type { AuthPayload } from "@/types";
import Link from "next/link";
import { useState } from "react";

type Props = {
  type: "login" | "register";
};

export function AuthForm({ type }: Props) {
  const { login } = useAuth();
  const { t } = useUI();
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-aurora opacity-60" />
      <div className="absolute -left-20 top-20 h-64 w-64 animate-float rounded-full bg-ember/10 blur-3xl" />
      <div className="absolute -bottom-20 right-20 h-80 w-80 animate-float rounded-full bg-pine/10 blur-3xl" style={{ animationDelay: "2s" }} />

      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/50 bg-white/40 shadow-panel backdrop-blur-xl lg:grid-cols-2">
        {/* Left Side (Visual/Brand) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-pine/5 p-12 text-ink lg:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

          <div className="relative z-10">
            <p className="font-heading text-xl font-bold tracking-tight text-pine">HanaDiary</p>
          </div>

          <div className="relative z-10 mt-12 space-y-6">
            <h1 className="font-heading text-5xl leading-[1.1] text-ink">
              {t("auth_left_title")}
            </h1>
            <p className="max-w-xs text-lg text-ink/70">
              {t("auth_left_subtitle")}
            </p>
          </div>

          <div className="relative z-10 mt-12 rounded-2xl bg-white/50 p-6 shadow-sm backdrop-blur-sm">
            <p className="font-heading text-lg italic text-ink/80">{t("auth_footer_line")}</p>
          </div>
        </aside>

        {/* Right Side (Form) */}
        <section className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-heading text-3xl font-semibold text-ink">
              {type === "register" ? t("auth_register_title") : t("auth_login_title")}
            </h2>
            <p className="mt-2 text-muted">
              {type === "register"
                ? t("auth_register_subtitle")
                : t("auth_login_subtitle")}
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            {type === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-ink/60">{t("auth_name_label")}</label>
                <input
                  className="w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-3.5 text-ink outline-none transition-all placeholder:text-stone-400 focus:border-clay/50 focus:bg-white focus:ring-4 focus:ring-clay/10"
                  placeholder={t("auth_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-ink/60">{t("auth_email_label")}</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-3.5 text-ink outline-none transition-all placeholder:text-stone-400 focus:border-clay/50 focus:bg-white focus:ring-4 focus:ring-clay/10"
                placeholder="hello@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-ink/60">{t("auth_password_label")}</label>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-3.5 text-ink outline-none transition-all placeholder:text-stone-400 focus:border-clay/50 focus:bg-white focus:ring-4 focus:ring-clay/10"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50/50 px-4 py-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-lg shadow-clay/20 hover:shadow-xl hover:shadow-clay/30"
            >
              {loading ? "Please wait..." : type === "register" ? t("auth_button_register") : t("auth_button_login")}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            {type === "register" ? t("auth_already") : t("auth_new")} {" "}
            <Link
              href={type === "register" ? "/login" : "/register"}
              className="font-semibold text-clay decoration-2 hover:underline hover:text-clay/80"
            >
              {type === "register" ? t("auth_log_in") : t("auth_create_account")}
            </Link>
          </div>
          {type === "register" && (
            <p className="mt-5 text-center text-xs text-muted">
              {t("auth_footer_line")}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
