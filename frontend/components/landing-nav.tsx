"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingNav() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 backdrop-blur-md lg:px-12"
        >
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-clay mix-blend-multiply opacity-80" />
                <Link href="/" className="font-heading text-xl font-bold tracking-tight text-ink">
                    HanaDiary
                </Link>
            </div>

            <nav className="flex items-center gap-6">
                <Link
                    href="/login"
                    className="text-sm font-medium text-ink/70 transition hover:text-ink"
                >
                    Sign In
                </Link>
                <Link
                    href="/register"
                    className="rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay/20 transition hover:bg-clay/90 hover:shadow-xl hover:shadow-clay/30 hover:-translate-y-0.5"
                >
                    Get Started
                </Link>
            </nav>
        </motion.header>
    );
}
