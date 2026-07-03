import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Find the best light in <span className="text-amber-400">Dublin</span>
      </h1>
      <p className="mt-6 max-w-xl text-neutral-400">
        A directory of 15 photography locations across the city — filtered by
        genre, best time of day and access difficulty, backed by data from 220
        photo sessions.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/locations"
          className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-amber-300 focus:outline-2 focus:outline-offset-2 focus:outline-amber-400"
        >
          Browse locations
        </Link>
        <Link
          href="/stats"
          className="rounded-lg border border-neutral-700 px-6 py-3 font-semibold hover:border-amber-400 focus:outline-2 focus:outline-offset-2 focus:outline-amber-400"
        >
          View statistics
        </Link>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 p-6 text-left">
          <h2 className="font-semibold text-amber-400">Curated spots</h2>
          <p className="mt-2 text-sm text-neutral-400">
            From Ha&apos;penny Bridge to Howth Cliffs — genre, light and access
            info for every location.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 p-6 text-left">
          <h2 className="font-semibold text-amber-400">Data-driven</h2>
          <p className="mt-2 text-sm text-neutral-400">
            220 fictional session records show how time of day, weather and
            crowds affect results.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 p-6 text-left">
          <h2 className="font-semibold text-amber-400">Community input</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Know a hidden gem? Suggest a new spot — no account or personal data
            required.
          </p>
        </div>
      </div>
    </div>
  );
}
