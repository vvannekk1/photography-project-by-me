import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/locations", label: "Locations" },
  { href: "/stats", label: "Statistics" },
  { href: "/predict", label: "Predictor" },
  { href: "/suggest", label: "Suggest a Spot" },
];

const LINK_CLASS =
  "relative pb-1 transition hover:text-[var(--paper)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--safelight)] after:transition-all after:duration-300 hover:after:w-full focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]";

export default function Nav() {
  return (
    <header className="border-b border-[var(--frame)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5"
      >
        <Link
          href="/"
          className="font-display text-lg italic tracking-tight text-[var(--paper)]"
        >
          Dublin <span className="text-[var(--safelight)]">Photo Spots</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex flex-wrap gap-6 font-mono-data text-xs uppercase tracking-[0.15em] text-[var(--ash)]">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
