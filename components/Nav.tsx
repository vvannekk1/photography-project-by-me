import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CommandPalette from "@/components/CommandPalette";
import type { PaletteItem } from "@/components/CommandPalette";

const LINKS = [
  { href: "/locations", label: "Locations" },
  { href: "/light", label: "Light" },
  { href: "/stats", label: "Statistics" },
  { href: "/predict", label: "Predictor" },
  { href: "/suggest", label: "Suggest" },
];

const LINK_CLASS =
  "relative pb-1 transition hover:text-[var(--paper)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--safelight)] after:transition-all after:duration-300 hover:after:w-full focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]";

export default function Nav({ paletteItems }: { paletteItems: PaletteItem[] }) {
  return (
    <header className="border-b border-[var(--frame)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"
      >
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-2 focus:outline-offset-4 focus:outline-[var(--safelight)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="PeakSesh1n"
            width={450}
            height={240}
            className="brand-mark h-9 w-auto"
          />
          <span className="hidden border-l border-[var(--frame)] pl-3 font-mono-data text-[10px] uppercase leading-tight tracking-[0.15em] text-[var(--ash)] sm:block">
            Dublin
            <br />
            Photo Spots
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden flex-wrap gap-5 font-mono-data text-xs uppercase tracking-[0.15em] text-[var(--ash)] md:flex">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </div>
          <CommandPalette items={paletteItems} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
