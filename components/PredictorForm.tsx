"use client";

import { useState } from "react";
import Link from "next/link";
import { predictRating, explainPrediction, MODEL_INFO } from "@/lib/predict";
import type { LocationMatch } from "@/lib/matchLocation";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const GENRES = ["portrait", "street", "landscape", "architecture"];
const TIMES = ["golden_hour", "blue_hour", "midday", "night"];
const WEATHER = ["sunny", "overcast", "rain", "fog"];

export default function PredictorForm({
  lookup,
}: {
  lookup: Record<string, LocationMatch | null>;
}) {
  const [genre, setGenre] = useState("landscape");
  const [timeOfDay, setTimeOfDay] = useState("golden_hour");
  const [weather, setWeather] = useState("overcast");
  const [crowdLevel, setCrowdLevel] = useState(2);

  const input = { genre, timeOfDay, weather, crowdLevel };
  const rating = predictRating(input);
  const factors = explainPrediction(input);
  const match = lookup[`${genre}|${timeOfDay}`] ?? null;

  let verdict = "Poor conditions";
  if (rating >= 7.5) verdict = "Excellent conditions";
  else if (rating >= 6) verdict = "Good conditions";
  else if (rating >= 4.5) verdict = "Average conditions";

  return (
    <div>
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        Exposure forecast
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">
        Session rating predictor
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--ash)]">
        A linear regression model trained on 220 fictional session records
        estimates how a shoot is likely to score before you head out.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="p-genre" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
              Genre
            </label>
            <select
              id="p-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
            >
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-time" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
              Time of day
            </label>
            <select
              id="p-time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
            >
              {TIMES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-weather" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
              Weather
            </label>
            <select
              id="p-weather"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
            >
              {WEATHER.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-crowd" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
              Crowd level: {crowdLevel}
            </label>
            <input
              id="p-crowd"
              type="range"
              min={1}
              max={5}
              step={1}
              value={crowdLevel}
              onChange={(e) => setCrowdLevel(Number(e.target.value))}
              className="w-full accent-[var(--safelight)]"
            />
            <div className="flex justify-between font-mono-data text-[10px] uppercase text-[var(--ash)]">
              <span>1 quiet</span>
              <span>5 packed</span>
            </div>
          </div>

          {match && (
            <div className="rounded-lg border border-[var(--frame)] bg-black/20 p-4">
              <p className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
                Closest real match in the dataset
              </p>
              <Link
                href={`/locations/${slugify(match.name)}`}
                className="mt-1 inline-block font-display text-lg text-[var(--safelight)] hover:underline"
              >
                {match.name}
              </Link>
              <p className="mt-1 text-xs text-[var(--ash)]">
                {match.avgRating.toFixed(1)} avg · {match.sessionCount} recorded sessions
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-xl border border-[var(--frame)] bg-black/30 p-8 text-center">
            <p className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[var(--ash)]">
              Predicted rating
            </p>
            <p className="mt-2 font-display text-6xl text-[var(--safelight)]" aria-live="polite">
              {rating.toFixed(1)}
            </p>
            <p className="mt-2 text-sm text-[var(--ash)]">out of 10</p>
            <p className="mt-4 font-semibold text-[var(--paper)]">{verdict}</p>
          </div>

          <h2 className="mt-8 mb-3 font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            What drives this score
          </h2>
          <ul className="flex flex-col gap-2">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between rounded-lg border border-[var(--frame)] px-4 py-2 text-sm">
                <span className="text-[var(--ash)]">
                  {f.label}: <span className="text-[var(--paper)]">{f.value}</span>
                </span>
                <span className={f.effect >= 0 ? "text-[var(--meter-green)]" : "text-[var(--safelight)]"}>
                  {f.effect >= 0 ? "+" : ""}{f.effect.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-14 rounded-xl border border-[var(--frame)] p-6">
        <h2 className="font-display text-lg text-[var(--safelight)]">Model evaluation</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">R² (test)</p>
            <p className="mt-1 font-semibold text-[var(--paper)]">{MODEL_INFO.r2Test}</p>
          </div>
          <div>
            <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">R² (train)</p>
            <p className="mt-1 font-semibold text-[var(--paper)]">{MODEL_INFO.r2Train}</p>
          </div>
          <div>
            <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Mean abs. error</p>
            <p className="mt-1 font-semibold text-[var(--paper)]">{MODEL_INFO.mae}</p>
          </div>
          <div>
            <p className="font-mono-data text-[10px] uppercase text-[var(--ash)]">Train / test split</p>
            <p className="mt-1 font-semibold text-[var(--paper)]">
              {MODEL_INFO.trainingRows} / {MODEL_INFO.testRows}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--ash)]">
          Linear regression was chosen because the target is a continuous
          numeric value and the relationships between lighting, weather and
          crowding are close to additive. The high R² reflects that the dataset
          is synthetic with deliberately embedded correlations; real-world
          session data would be considerably noisier.
        </p>
      </section>
    </div>
  );
}
