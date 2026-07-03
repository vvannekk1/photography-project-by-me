import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Dublin Photo Spots",
  description:
    "A directory of photography locations in Dublin: genres, best light, access info and data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
          Dublin Photo Spots — student project, all session data is fictional.
        </footer>
      </body>
    </html>
  );
}
