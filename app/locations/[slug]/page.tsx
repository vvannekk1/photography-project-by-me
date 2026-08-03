import { notFound } from "next/navigation";
import { getLocations, getLocationBySlug, getSessions, slugify } from "@/lib/data";
import { genreGradient, genreIconColor } from "@/lib/genre";
import GenreIcon from "@/components/GenreIcon";

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

  const allLocations = getLocations();
  const frameNumber = allLocations.findIndex((l) => l.name === location.name) + 1;
  const primaryGenre = location.genres[0];

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
      <div
        className="relative flex h-48 items-end overflow-hidden rounded-2xl border border-[var(--frame)] p-6"
        style={{ backgroundImage: genreGradient(primaryGenre) }}
      >
        <GenreIcon
          genre={primaryGenre}
          className="absolute right-6 top-6 h-16 w-16 opacity-60"
          style={{ color: genreIconColor(primaryGenre) }}
        />
        <div>
          <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
            N°{String(frameNumber).padStart(2, "0")} · {bestTime}
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--paper)]">{location.name}</h1>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {location.genres.map((g) => (
          <span
            key={g}
            className="rounded-full border border-[var(--frame)] px-3 py-1 text-sm text-[var(--ash)]"
          >
            {g}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-[var(--ash)]">{location.description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--frame)] p-5">
          <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Best time</p>
          <p className="mt-1 font-semibold text-[var(--paper)]">{bestTime}</p>
        </div>
        <div className="rounded-xl border border-[var(--frame)] p-5">
          <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Access</p>
          <p className="mt-1 font-semibold text-[var(--paper)]">{location.access}</p>
        </div>
        <div className="rounded-xl border border-[var(--frame)] p-5">
          <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Avg rating</p>
          <p className="mt-1 font-semibold text-[var(--safelight)]">{avgRating.toFixed(1)} / 10</p>
        </div>
        <div className="rounded-xl border border-[var(--frame)] p-5">
          <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Sessions</p>
          <p className="mt-1 font-semibold text-[var(--paper)]">{sessions.length}</p>
        </div>
      </div>

      
        <a
          href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-lg border border-[var(--frame)] px-5 py-2 text-sm text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
      >
        {mapsLabel}
      </a>
    </article>
  );
}
