import Link from "next/link";

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
          <Link href="/locations" className="transition hover:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]">
            Locations
          </Link>
          <Link href="/stats" className="transition hover:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]">
            Statistics
          </Link>
          <Link href="/predict" className="transition hover:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]">
            Predictor
          </Link>
          <Link href="/suggest" className="transition hover:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]">
            Suggest a Spot
          </Link>
        </div>
      </nav>
    </header>
  );
}
