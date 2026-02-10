import type { Metadata } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const heading = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const body = Newsreader({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Personal Diary",
  description: "Your personal daily reflection app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-[var(--font-body)] antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
