"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Location } from "@/lib/types";
import LocationCard from "@/components/LocationCard";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const GENRES = ["all", "portrait", "street", "landscape", "architecture"];
const ACCESS = ["all", "easy", "moderate", "hard"];

const FIELD_CLASS =
  "rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none";

const LABEL_CLASS =
  "mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]";

const CARD_CLASS =
  "focus-subject rise-in relative overflow-hidden rounded-xl border border-[var(--frame)] p-3 hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]";

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

    setTimeout(() => router.push("/locations/" + slug), prefersReduced ? 0 : 220);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="search" className={LABEL_CLASS}>
            Search by name
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Phoenix Park"
            className={FIELD_CLASS + " w-full placeholder:text-[var(--ash)]"}
          />
        </div>
        <div>
          <label htmlFor="genre" className={LABEL_CLASS}>
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={FIELD_CLASS}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="access" className={LABEL_CLASS}>
            Access
          </label>
          <select
            id="access"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className={FIELD_CLASS}
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
        <div className="focus-field grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((loc, i) => {
            const slug = slugify(loc.name);
            return (
              <Link
                key={loc.name}
                href={"/locations/" + slug}
                onClick={(e) => handleCardClick(e, slug)}
                style={{ animationDelay: Math.min(i * 0.05, 0.4) + "s" }}
                className={CARD_CLASS}
              >
                {flashSlug === slug && (
                  <span
                    aria-hidden="true"
                    className="shutter-flash pointer-events-none absolute inset-0 z-10 rounded-xl bg-[var(--paper)]"
                  />
                )}
                <LocationCard
                  name={loc.name}
                  slug={slug}
                  genres={loc.genres}
                  bestTime={loc.best_time}
                  access={loc.access}
                  index={i}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
