import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import AccessibilityControls from "@/components/AccessibilityControls";
import type { PaletteItem } from "@/components/CommandPalette";
import { getLocations, slugify } from "@/lib/data";

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

const THEME_SCRIPT =
  "try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}";

const STATIC_ITEMS: PaletteItem[] = [
  { label: "Home", href: "/", kind: "Page", keywords: "start hero light meter" },
  {
    label: "All locations",
    href: "/locations",
    kind: "Page",
    keywords: "browse map catalogue directory spots",
  },
  {
    label: "Session statistics",
    href: "/stats",
    kind: "Page",
    keywords: "charts data ratings weather month season",
  },
  {
    label: "Session rating predictor",
    href: "/predict",
    kind: "Page",
    keywords: "machine learning regression forecast model",
  },
  {
    label: "Suggest a spot",
    href: "/suggest",
    kind: "Page",
    keywords: "submit form add new location community",
  },
];

function buildPaletteItems(): PaletteItem[] {
  const locationItems: PaletteItem[] = getLocations().map((location) => ({
    label: location.name,
    href: "/locations/" + slugify(location.name),
    kind: "Location",
    keywords:
      location.genres.join(" ") +
      " " +
      location.best_time.replace("_", " ") +
      " " +
      location.access,
  }));

  return [...STATIC_ITEMS, ...locationItems];
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [fraunces.variable, plexMono.variable, inter.variable].join(" ");
  const paletteItems = buildPaletteItems();

  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-[var(--ink)] text-[var(--paper)] antialiased">
        <Nav paletteItems={paletteItems} />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-[var(--frame)] py-6 text-center font-mono-data text-xs text-[var(--ash)]">
          Dublin Photo Spots — student project, all session data is fictional.
        </footer>
        <AccessibilityControls />
      </body>
    </html>
  );
}
