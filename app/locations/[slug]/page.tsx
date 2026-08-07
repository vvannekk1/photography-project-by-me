import { notFound } from "next/navigation";
import {
  getLocations,
  getLocationBySlug,
  getSessions,
  slugify,
} from "@/lib/data";
import { genreGradient, genreIconColor } from "@/lib/genre";
import GenreIcon from "@/components/GenreIcon";
import FilmStrip from "@/components/FilmStrip";

const MAPS_LINK_CLASS =
  "mt-8 inline-block rounded-lg border border-[var(--frame)] px-5 py-2 text-sm text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]";

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
  const frameNumber =
    allLocations.findIndex((l) => l.name === location.name) + 1;
  const primaryGenre = location.genres[0];

  const sessions = getSessions().filter(
    (s) => s.location_name === location.name
  );
  const avgRating =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.session_rating, 0) / sessions.length
      : 0;

  const mapsUrl =
    "https://www.google.com/maps?q=" +
    location.latitude +
    "," +
    location.longitude;
  const bestTime = location.best_time.replace("_", " ");
  const mapsLabel =
    "Open in Google Maps: " + location.latitude + ", " + location.longitude;

  const stats = [
    { label: "Best time", value: bestTime, accent: false },
    { label: "Access", value: location.access, accent: false },
    { label: "Avg rating", value: avgRating.toFixed(1) + " / 10", accent: true },
    { label: "Sessions", value: String(sessions.length), accent: false },
  ];

  return (
    <article>
      <div
        className="rise-in relative flex h-64 items-end overflow-hidden rounded-2xl border border-[var(--frame)] p-6"
        style={{
          backgroundImage:
            "url('/locations/" + slug + ".jpg'), " + genreGradient(primaryGenre),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15) 60%, transparent)",
          }}
        />
        <GenreIcon
          genre={primaryGenre}
          className="absolute right-6 top-6 h-14 w-14 opacity-70"
          style={{ color: genreIconColor(primaryGenre) }}
        />
        <div className="relative">
          <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
            N&#176;{String(frameNumber).padStart(2, "0")} · {bestTime}
          </p>
          <h1 className="mt-1 font-display text-4xl text-[#ECE6D6]">
            {location.name}
          </h1>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {location.genres.map((genre) => (
          <span
            key={genre}
            className="rounded-full border border-[var(--frame)] px-3 py-1 text-sm text-[var(--ash)]"
          >
            {genre}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-[var(--ash)]">{location.description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rise-in rounded-xl border border-[var(--frame)] p-5"
            style={{ animationDelay: index * 0.05 + "s" }}
          >
            <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">
              {stat.label}
            </p>
            <p
              className={
                stat.accent
                  ? "mt-1 font-semibold text-[var(--safelight)]"
                  : "mt-1 font-semibold text-[var(--paper)]"
              }
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <FilmStrip locationName={location.name} genres={location.genres} />

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={MAPS_LINK_CLASS}
      >
        {mapsLabel}
      </a>
    </article>
  );
}
