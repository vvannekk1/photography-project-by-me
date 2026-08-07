"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getSunTimes,
  formatTime,
  formatDuration,
  dayFraction,
} from "@/lib/sun";

export type LightLocation = {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  bestTime: string;
};

const NIGHT = "#11131c";
const BLUE = "#3f5f8f";
const GOLD = "#d99a4e";
const DAY = "#8fa3b8";

const SELECT_CLASS =
  "w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none";

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

type Band = { from: number; to: number; colour: string; label: string };

function buildBands(
  fractions: Record<string, number | null>
): Band[] {
  const {
    civilRise,
    blueRise,
    sunrise,
    goldenRise,
    goldenSet,
    sunset,
    blueSet,
    civilSet,
  } = fractions;

  const bands: Band[] = [];
  const push = (from: number | null, to: number | null, colour: string, label: string) => {
    if (from === null || to === null || to <= from) return;
    bands.push({ from, to, colour, label });
  };

  push(0, civilRise, NIGHT, "Night");
  push(civilRise, blueRise, BLUE, "Blue hour");
  push(blueRise, goldenRise, GOLD, "Golden hour");
  push(goldenRise, goldenSet, DAY, "Daylight");
  push(goldenSet, blueSet, GOLD, "Golden hour");
  push(blueSet, civilSet, BLUE, "Blue hour");
  push(civilSet, 1, NIGHT, "Night");

  // Keep sunrise/sunset available for the marker layer.
  void sunrise;
  void sunset;

  return bands;
}

export default function LightPlanner({
  locations,
}: {
  locations: LightLocation[];
}) {
  const [slug, setSlug] = useState(locations[0]?.slug ?? "");
  const [dateValue, setDateValue] = useState(todayISO());

  const location =
    locations.find((item) => item.slug === slug) ?? locations[0];

  const times = useMemo(() => {
    if (!location) return null;
    const parsed = new Date(dateValue + "T12:00:00Z");
    if (Number.isNaN(parsed.valueOf())) return null;
    return getSunTimes(parsed, location.latitude, location.longitude);
  }, [location, dateValue]);

  const bands = useMemo(() => {
    if (!times) return [];
    return buildBands({
      civilRise: dayFraction(times.blueHourMorningStart),
      blueRise: dayFraction(times.blueHourMorningEnd),
      sunrise: dayFraction(times.sunrise),
      goldenRise: dayFraction(times.goldenHourMorningEnd),
      goldenSet: dayFraction(times.goldenHourEveningStart),
      sunset: dayFraction(times.sunset),
      blueSet: dayFraction(times.blueHourEveningStart),
      civilSet: dayFraction(times.blueHourEveningEnd),
    });
  }, [times]);

  if (!location || !times) {
    return <p className="text-[var(--ash)]">No location data available.</p>;
  }

  const sunriseFraction = dayFraction(times.sunrise);
  const sunsetFraction = dayFraction(times.sunset);

  const phases = [
    {
      title: "Morning blue hour",
      window:
        formatTime(times.blueHourMorningStart) +
        " – " +
        formatTime(times.blueHourMorningEnd),
      note: "Cool, even light before the sun clears the horizon.",
      accent: BLUE,
    },
    {
      title: "Morning golden hour",
      window:
        formatTime(times.blueHourMorningEnd) +
        " – " +
        formatTime(times.goldenHourMorningEnd),
      note: "Low warm sun, long shadows, softest contrast of the day.",
      accent: GOLD,
    },
    {
      title: "Evening golden hour",
      window:
        formatTime(times.goldenHourEveningStart) +
        " – " +
        formatTime(times.blueHourEveningStart),
      note: "The window your dataset rates highest, at 6.5 average.",
      accent: GOLD,
    },
    {
      title: "Evening blue hour",
      window:
        formatTime(times.blueHourEveningStart) +
        " – " +
        formatTime(times.blueHourEveningEnd),
      note: "City lights balance with the sky — best for architecture.",
      accent: BLUE,
    },
  ];

  const headline = [
    { label: "Sunrise", value: formatTime(times.sunrise) },
    { label: "Solar noon", value: formatTime(times.solarNoon) },
    { label: "Sunset", value: formatTime(times.sunset) },
    { label: "Daylight", value: formatDuration(times.daylightMinutes) },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="light-location"
            className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]"
          >
            Location
          </label>
          <select
            id="light-location"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={SELECT_CLASS}
          >
            {locations.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="light-date"
            className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]"
          >
            Date
          </label>
          <input
            id="light-date"
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className={SELECT_CLASS}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {headline.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--frame)] p-5"
          >
            <p className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl text-[var(--paper)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="day-strip">
        <h2
          id="day-strip"
          className="mb-3 font-mono-data text-[10px] uppercase tracking-[0.25em] text-[var(--ash)]"
        >
          The day, midnight to midnight
        </h2>

        <div
          className="relative h-12 w-full overflow-hidden rounded-lg border border-[var(--frame)]"
          role="img"
          aria-label={
            "Light phases for " +
            location.name +
            " on " +
            dateValue +
            ": sunrise " +
            formatTime(times.sunrise) +
            ", sunset " +
            formatTime(times.sunset)
          }
        >
          {bands.map((band, index) => (
            <span
              key={band.label + index}
              className="absolute inset-y-0"
              style={{
                left: band.from * 100 + "%",
                width: (band.to - band.from) * 100 + "%",
                backgroundColor: band.colour,
              }}
            />
          ))}

          {sunriseFraction !== null && (
            <span
              className="absolute inset-y-0 w-px bg-white/70"
              style={{ left: sunriseFraction * 100 + "%" }}
            />
          )}
          {sunsetFraction !== null && (
            <span
              className="absolute inset-y-0 w-px bg-white/70"
              style={{ left: sunsetFraction * 100 + "%" }}
            />
          )}
        </div>

        <div className="mt-1 flex justify-between font-mono-data text-[9px] text-[var(--ash)]">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: NIGHT }}
            />
            Night
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: BLUE }}
            />
            Blue hour
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: GOLD }}
            />
            Golden hour
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: DAY }}
            />
            Daylight
          </span>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {phases.map((phase, index) => (
          <div
            key={phase.title}
            className="rise-in rounded-xl border border-[var(--frame)] p-5"
            style={{ animationDelay: index * 0.06 + "s" }}
          >
            <span
              className="inline-block h-1 w-10 rounded-full"
              style={{ backgroundColor: phase.accent }}
            />
            <h3 className="mt-3 font-display text-lg text-[var(--paper)]">
              {phase.title}
            </h3>
            <p className="mt-1 font-mono-data text-sm text-[var(--safelight)]">
              {phase.window}
            </p>
            <p className="mt-2 text-sm text-[var(--ash)]">{phase.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href={"/locations/" + location.slug}
          className="rounded-lg border border-[var(--frame)] px-5 py-2 text-sm text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-[var(--safelight)]"
        >
          Open {location.name}
        </Link>
        <p className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
          Best time on file: {location.bestTime.replace("_", " ")}
        </p>
      </div>

      <p className="mt-8 max-w-2xl text-xs text-[var(--ash)]">
        Times are computed from the NOAA sunrise equation using each spot&apos;s
        latitude and longitude, then displayed in Dublin local time. Golden hour
        is taken as the sun sitting between 4 degrees below and 6 degrees above
        the horizon; blue hour as 6 to 4 degrees below it. Expect roughly a
        minute of error, and more in unusual atmospheric conditions.
      </p>
    </div>
  );
}
