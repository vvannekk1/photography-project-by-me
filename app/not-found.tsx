import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        Frame not found
      </p>
      <h1 className="mt-4 font-display text-5xl text-[var(--paper)]">
        Nothing developed here
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--ash)]">
        That page came back blank. The spot may have been renamed, or the link
        may have been mistyped.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/locations"
          className="rounded-md bg-[var(--safelight)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-110 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
        >
          Browse all locations
        </Link>
        <Link
          href="/"
          className="rounded-md border border-[var(--frame)] px-6 py-3 text-sm font-semibold text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
