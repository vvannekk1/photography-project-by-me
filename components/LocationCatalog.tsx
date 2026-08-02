"use client";

import { useState } from "react";
import Link from "next/link";
import { Location } from "@/lib/types";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const GENRES = ["all", "portrait", "street", "landscape", "architecture"];
const ACCESS = ["all", "easy", "moderate", "hard"];

export default function LocationCatalog({ locations }: { locations: Location[] }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [access, setAccess] = useState("all");

  const filtered = locations.filter((loc) => {
    const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre === "all" || loc.genres.includes(genre);
    const matchesAccess = access === "all" || loc.access === access;
    return matchesSearch && matchesGenre && matchesAccess;
  });

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((loc, i) => (
          <Link
            key={loc.name}
            href={`/locations/${slugify(loc.name)}`}
            className="rounded-xl border border-[var(--frame)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
          >
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
        ))}
      </div>
    </div>
  );
}
