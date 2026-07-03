import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-neutral-800">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4"
      >
        <Link href="/" className="text-lg font-bold tracking-tight text-amber-400">
          Dublin Photo Spots
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/locations" className="hover:text-amber-400 focus:outline-2 focus:outline-amber-400">
            Locations
          </Link>
          <Link href="/stats" className="hover:text-amber-400 focus:outline-2 focus:outline-amber-400">
            Statistics
          </Link>
          <Link href="/suggest" className="hover:text-amber-400 focus:outline-2 focus:outline-amber-400">
            Suggest a Spot
          </Link>
        </div>
      </nav>
    </header>
  );
}
