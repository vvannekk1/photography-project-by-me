import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import AccessibilityControls from "@/components/AccessibilityControls";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dublin Photo Spots",
  description:
    "A directory of photography locations in Dublin: genres, best light, access info and data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--ink)] text-[var(--paper)] antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-[var(--frame)] py-6 text-center font-mono-data text-xs text-[var(--ash)]">
          Dublin Photo Spots — student project, all session data is fictional.
        </footer>
        <AccessibilityControls />
      </body>
    </html>
  );
}
