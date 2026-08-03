"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Location } from "@/lib/types";
import { genreGradient, genreIconColor } from "@/lib/genre";
import GenreIcon from "@/components/GenreIcon";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const GENRES = ["all", "portrait", "street", "landscape", "architecture"];
const ACCESS = ["all", "easy", "moderate", "hard"];

export default function LocationCatalog({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [access, setAccess] = useState("all");
  const [flashSlug, setFlashSlug] = useState<string | null>(null);

  const filtered = locations.filter((loc) => {
    const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === "all" || loc.genres.includes(genre);
    const matchesAccess = access === "all" || loc.access === access;
    return matchesSearch && matchesGenre && matchesAccess;
  });

  function handleCardClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setFlashSlug(slug);

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-reduced-motion");

    setTimeout(() => router.push(`/locations/${slug}`), prefersReduced ? 0 : 220);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="search" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Phoenix Park"
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] placeholder:text-[var(--ash)] focus:border-[var(--safelight)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="genre" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="access" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Access
          </label>
          <select
            id="access"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className="rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          >
            {ACCESS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 font-mono-data text-xs text-[var(--ash)]" aria-live="polite">
        {filtered.length} location{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--frame)] p-10 text-center">
          <p className="font-display text-lg text-[var(--paper)]">No frames match</p>
          <p className="mt-2 text-sm text-[var(--ash)]">
            Try a different genre, access level, or search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((loc, i) => {
            const slug = slugify(loc.name);
            const primaryGenre = loc.genres[0];
            return (
              <Link
                key={loc.name}
                href={`/locations/${slug}`}
                onClick={(e) => handleCardClick(e, slug)}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                className="rise-in relative overflow-hidden rounded-xl border border-[var(--frame)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
              >
                {flashSlug === slug && (
                  <span
                    aria-hidden="true"
                    className="shutter-flash pointer-events-none absolute inset-0 rounded-xl bg-[var(--paper)]"
                  />
                )}
                <div
                  className="mb-4 flex h-24 items-center justify-center rounded-lg"
                  style={{ backgroundImage: genreGradient(primaryGenre) }}
                >
                  <GenreIcon
                    genre={primaryGenre}
                    className="h-10 w-10"
                    style={{ color: genreIconColor(primaryGenre) }}
                  />
                </div>
                <p className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-[var(--safelight)]">
                  N°{String(i + 1).padStart(2, "0")} · {loc.best_time.replace("_", " ")}
                </p>
                <h2 className="mt-2 font-display text-lg text-[var(--paper)]">{loc.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {loc.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-[var(--frame)] px-3 py-1 text-xs text-[var(--ash)]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-[var(--ash)]">Access: {loc.access}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
