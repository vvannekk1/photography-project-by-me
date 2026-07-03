"use client";

import { useState } from "react";
import Link from "next/link";
import { Location } from "@/lib/types";

// slugify duplicated here because lib/data.ts uses fs (server-only)
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
          <label htmlFor="search" className="mb-1 block text-sm text-neutral-400">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Phoenix Park"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="genre" className="mb-1 block text-sm text-neutral-400">
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="access" className="mb-1 block text-sm text-neutral-400">
            Access
          </label>
          <select
            id="access"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          >
            {ACCESS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-500" aria-live="polite">
        {filtered.length} location{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((loc) => (
          <Link
            key={loc.name}
            href={`/locations/${slugify(loc.name)}`}
            className="rounded-xl border border-neutral-800 p-6 transition hover:border-amber-400 focus:outline-2 focus:outline-amber-400"
          >
            <h2 className="text-lg font-semibold">{loc.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {loc.genres.map((g) => (
                <span key={g} className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-amber-400">
                  {g}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-400">
              Best: {loc.best_time.replace("_", " ")} · Access: {loc.access}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
