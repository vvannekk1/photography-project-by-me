import Link from "next/link";

const links = [
  { href: "/locations", label: "Locations" },
  { href: "/stats", label: "Statistics" },
  { href: "/predict", label: "Predictor" },
  { href: "/suggest", label: "Suggest a Spot" },
];

export default function Nav() {
  return (
    <header className="border-b border-[var(--frame)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5"
      >
        <Link href="/" className="font-display text-lg italic tracking-tight text-[var(--paper)]">
          Dublin <span className="text-[var(--safelight)]">Photo Spots</span>
        </Link>
        <div className="flex gap-6 font-mono-data text-xs uppercase tracking-[0.15em] text-[var(--ash)]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative pb-1 transition hover:text-[var(--paper)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--safelight)] after:transition-all after:duration-300 hover:after:w-full focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
