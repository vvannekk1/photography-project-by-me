import { notFound } from "next/navigation";
import { getLocations, getLocationBySlug, getSessions, slugify } from "@/lib/data";

export function generateStaticParams() {
  return getLocations().map((loc) => ({ slug: slugify(loc.name) }));
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const sessions = getSessions().filter((s) => s.location_name === location.name);
  const avgRating =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.session_rating, 0) / sessions.length
      : 0;

  const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  const bestTime = location.best_time.replace("_", " ");
  const mapsLabel = `Open in Google Maps: ${location.latitude}, ${location.longitude}`;

  return (
    <article>
      <h1 className="text-3xl font-bold">{location.name}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {location.genres.map((g) => (
          <span
            key={g}
            className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-amber-400"
          >
            {g}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-neutral-300">{location.description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 p-5">
          <p className="text-xs uppercase text-neutral-500">Best time</p>
          <p className="mt-1 font-semibold">{bestTime}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 p-5">
          <p className="text-xs uppercase text-neutral-500">Access</p>
          <p className="mt-1 font-semibold">{location.access}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 p-5">
          <p className="text-xs uppercase text-neutral-500">Avg rating</p>
          <p className="mt-1 font-semibold text-amber-400">{avgRating.toFixed(1)} / 10</p>
        </div>
        <div className="rounded-xl border border-neutral-800 p-5">
          <p className="text-xs uppercase text-neutral-500">Sessions</p>
          <p className="mt-1 font-semibold">{sessions.length}</p>
        </div>
      </div>

      
        <a
          href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-lg border border-neutral-700 px-5 py-2 text-sm hover:border-amber-400 focus:outline-2 focus:outline-amber-400"
      >
        {mapsLabel}
      </a>
    </article>
  );
}
