"use client";

import { Footer } from "@/components/footer";
import { LandingNav } from "@/components/landing-nav";
import { motion } from "framer-motion";
import { Book, Heart, Sparkles, Sun } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-mist">
      <LandingNav />

      {/* Hero Section */}
      <main className="relative flex flex-grow flex-col items-center justify-center px-6 pt-32 pb-20 text-center lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-aurora opacity-40 mix-blend-multiply" />
        <div className="absolute -top-[20%] left-[20%] h-[500px] w-[500px] animate-float rounded-full bg-ember/20 blur-[100px]" />
        <div className="absolute top-[10%] right-[10%] h-[400px] w-[400px] animate-float rounded-full bg-pine/20 blur-[120px]" style={{ animationDelay: "2s" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-2xl"
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-clay/10 bg-white/50 px-4 py-1.5 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="h-4 w-4 text-clay" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink/70">Your Personal Space</span>
          </div>

          <h1 className="font-heading text-5xl font-bold leading-[1.1] text-ink sm:text-7xl">
            Capture life in <span className="italic text-clay">color</span>.
          </h1>
          <p className="mt-8 text-lg text-ink/70 sm:text-xl">
            A beautiful, mindful space to write your thoughts, track your mood, and celebrate the small wins.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group relative flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-base font-bold text-white shadow-lg shadow-clay/20 transition-all hover:bg-clay/90 hover:shadow-xl hover:shadow-clay/30 hover:-translate-y-1"
            >
              Start Writing
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                &rarr;
              </motion.span>
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white/50 px-8 py-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <section className="mt-24 grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: Sun,
              title: "Daily Reflections",
              desc: "Start each day with intention and gratitude.",
              color: "text-amber-600 bg-amber-100/50",
            },
            {
              icon: Book,
              title: "Private Journal",
              desc: "A secure place for your deepest thoughts.",
              color: "text-clay bg-orange-100/50",
            },
            {
              icon: Heart,
              title: "Mood Tracking",
              desc: "Understand your emotional patterns over time.",
              color: "text-rose-600 bg-rose-100/50",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
              className="group flex flex-col items-center rounded-3xl border border-white/60 bg-white/40 p-8 text-center shadow-lg shadow-black/[0.03] backdrop-blur-sm transition-all hover:border-white hover:bg-white/80"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}>
                <feature.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="text-sm text-ink/60">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
