"use client";

import { useState } from "react";
import { genreGradient, genreIconColor } from "@/lib/genre";
import GenreIcon from "@/components/GenreIcon";

export default function LocationCard({
  name,
  slug,
  genres,
  bestTime,
  access,
  index,
}: {
  name: string;
  slug: string;
  genres: string[];
  bestTime: string;
  access: string;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const primaryGenre = genres[0];
  const imageSrc = "/locations/" + slug + ".jpg";

  return (
    <div className="flex gap-4">
      <div
        className="relative aspect-[4/5] w-2/5 shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundImage: genreGradient(primaryGenre) }}
      >
        {imageFailed ? (
          <span className="flex h-full w-full items-center justify-center">
            <GenreIcon
              genre={primaryGenre}
              className="h-9 w-9"
              style={{ color: genreIconColor(primaryGenre) }}
            />
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt=""
            loading={index < 6 ? "eager" : "lazy"}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <p className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-[var(--safelight)]">
          N&#176;{String(index + 1).padStart(2, "0")} · {bestTime.replace("_", " ")}
        </p>
        <h2 className="mt-1 font-display text-lg leading-tight text-[var(--paper)]">
          {name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full border border-[var(--frame)] px-2.5 py-0.5 text-xs text-[var(--ash)]"
            >
              {genre}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-[var(--ash)]">Access: {access}</p>
      </div>
    </div>
  );
}
