"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GenreIcon from "@/components/GenreIcon";
import { genreGradient, genreIconColor } from "@/lib/genre";

type Frame = {
  index: number;
  genre: string;
  angle: number;
  exposure: string;
};

const EXPOSURES = [
  "1/250 · f/2.8 · ISO 100",
  "1/60 · f/5.6 · ISO 400",
  "1/1000 · f/1.8 · ISO 200",
  "1/15 · f/11 · ISO 800",
];

function buildFrames(genres: string[]): Frame[] {
  const angles = [160, 25, 200, 75];
  return angles.map((angle, i) => ({
    index: i + 1,
    genre: genres[i % genres.length],
    angle,
    exposure: EXPOSURES[i % EXPOSURES.length],
  }));
}

function frameStyle(frame: Frame) {
  const base = genreGradient(frame.genre);
  return { backgroundImage: base.replace("160deg", frame.angle + "deg") };
}

export default function FilmStrip({
  locationName,
  genres,
}: {
  locationName: string;
  genres: string[];
}) {
  const frames = buildFrames(genres);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    if (lastFocused.current) lastFocused.current.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = (current + delta + frames.length) % frames.length;
        return next;
      });
    },
    [frames.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    document.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  function open(index: number, event: React.MouseEvent<HTMLButtonElement>) {
    lastFocused.current = event.currentTarget;
    setOpenIndex(index);
  }

  const active = openIndex === null ? null : frames[openIndex];

  return (
    <section className="mt-8" aria-labelledby="film-strip-heading">
      <h2
        id="film-strip-heading"
        className="mb-3 font-mono-data text-[10px] uppercase tracking-[0.25em] text-[var(--ash)]"
      >
        Contact strip · {frames.length} frames
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {frames.map((frame, index) => (
          <button
            key={frame.index}
            type="button"
            onClick={(event) => open(index, event)}
            style={{ animationDelay: index * 0.06 + "s" }}
            className="rise-in group relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[var(--frame)] transition hover:-translate-y-0.5 hover:border-[var(--safelight)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
            aria-label={"Open frame " + frame.index + " of " + locationName}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={frameStyle(frame)}
            />
            <GenreIcon
              genre={frame.genre}
              className="relative h-8 w-8 transition-transform group-hover:scale-110"
              style={{ color: genreIconColor(frame.genre) }}
            />
            <span className="absolute bottom-1 left-2 font-mono-data text-[9px] text-[var(--ash)]">
              {String(frame.index).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-2 font-mono-data text-[10px] text-[var(--ash)]">
        Abstract frames generated from each spot&apos;s genre profile · click to
        enlarge
      </p>

      {active !== null && (
        <div
          className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={"Frame " + active.index + " of " + locationName}
          onClick={close}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-[var(--frame)] bg-[var(--ink)] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex h-72 items-center justify-center rounded-xl"
              style={frameStyle(active)}
            >
              <GenreIcon
                genre={active.genre}
                className="h-24 w-24"
                style={{ color: genreIconColor(active.genre) }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg text-[var(--paper)]">
                  {locationName}
                </p>
                <p className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
                  Frame {String(active.index).padStart(2, "0")} ·{" "}
                  {active.genre} · {active.exposure}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous frame"
                  className="rounded-lg border border-[var(--frame)] px-3 py-1 text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
                >
                  &#8592;
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next frame"
                  className="rounded-lg border border-[var(--frame)] px-3 py-1 text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
                >
                  &#8594;
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="rounded-lg bg-[var(--safelight)] px-4 py-1 font-semibold text-[var(--ink)] transition hover:brightness-110 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
                >
                  Close
                </button>
              </div>
            </div>

            <p className="mt-2 font-mono-data text-[9px] text-[var(--ash)]">
              Esc to close · arrow keys to move between frames
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
