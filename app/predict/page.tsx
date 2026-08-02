"use client";

import { useState } from "react";
import { predictRating, explainPrediction, MODEL_INFO } from "@/lib/predict";

const GENRES = ["portrait", "street", "landscape", "architecture"];
const TIMES = ["golden_hour", "blue_hour", "midday", "night"];
const WEATHER = ["sunny", "overcast", "rain", "fog"];

export default function PredictPage() {
  const [genre, setGenre] = useState("landscape");
  const [timeOfDay, setTimeOfDay] = useState("golden_hour");
  const [weather, setWeather] = useState("overcast");
  const [crowdLevel, setCrowdLevel] = useState(2);

  const input = { genre, timeOfDay, weather, crowdLevel };
  const rating = predictRating(input);
  const factors = explainPrediction(input);

  let verdict = "Poor conditions";
  if (rating >= 7.5) verdict = "Excellent conditions";
  else if (rating >= 6) verdict = "Good conditions";
  else if (rating >= 4.5) verdict = "Average conditions";

  return (
    <div>
      <h1 className="text-3xl font-bold">Session rating predictor</h1>
      <p className="mt-3 max-w-2xl text-neutral-400">
        A linear regression model trained on 220 fictional session records
        estimates how a shoot is likely to score before you head out.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="p-genre" className="mb-1 block text-sm">Genre</label>
            <select
              id="p-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
            >
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-time" className="mb-1 block text-sm">Time of day</label>
            <select
              id="p-time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
            >
              {TIMES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-weather" className="mb-1 block text-sm">Weather</label>
            <select
              id="p-weather"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
            >
              {WEATHER.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="p-crowd" className="mb-1 block text-sm">
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
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>1 quiet</span>
              <span>5 packed</span>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-neutral-800 p-8 text-center">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Predicted rating
            </p>
            <p
              className="mt-2 text-6xl font-bold text-amber-400"
              aria-live="polite"
            >
              {rating.toFixed(1)}
            </p>
            <p className="mt-2 text-sm text-neutral-400">out of 10</p>
            <p className="mt-4 font-semibold">{verdict}</p>
          </div>

          <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            What drives this score
          </h2>
          <ul className="flex flex-col gap-2">
            {factors.map((f) => (
              <li
                key={f.label}
                className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-2 text-sm"
              >
                <span className="text-neutral-400">
                  {f.label}: <span className="text-neutral-200">{f.value}</span>
                </span>
                <span className={f.effect >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {f.effect >= 0 ? "+" : ""}{f.effect.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-14 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-lg font-semibold text-amber-400">Model evaluation</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-neutral-500">R² (test)</p>
            <p className="mt-1 font-semibold">{MODEL_INFO.r2Test}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">R² (train)</p>
            <p className="mt-1 font-semibold">{MODEL_INFO.r2Train}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Mean abs. error</p>
            <p className="mt-1 font-semibold">{MODEL_INFO.mae}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Train / test split</p>
            <p className="mt-1 font-semibold">
              {MODEL_INFO.trainingRows} / {MODEL_INFO.testRows}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-neutral-500">
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