"use client";

import { useState } from "react";

export default function SuggestPage() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [genre, setGenre] = useState("street");
  const [bestTime, setBestTime] = useState("golden_hour");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim() || !area.trim()) {
      setError("Please fill in the spot name and area.");
      return;
    }
    // Deliberate design decision: suggestions are stored locally in the
    // browser only. No backend, no accounts, no personal data collected.
    const suggestion = { name, area, genre, bestTime, notes, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("suggestions") || "[]");
    localStorage.setItem("suggestions", JSON.stringify([...existing, suggestion]));
    setSubmitted(true);
    setError("");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold text-amber-400">Thank you!</h1>
        <p className="mt-4 text-neutral-400">
          Your suggestion has been recorded. In a production version it would
          be reviewed before publishing.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName(""); setArea(""); setNotes("");
          }}
          className="mt-8 rounded-lg border border-neutral-700 px-5 py-2 hover:border-amber-400"
        >
          Suggest another spot
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Suggest a spot</h1>
      <p className="mt-3 text-sm text-neutral-400">
        No account needed. We don&apos;t collect any personal information —
        just the spot details.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="spot-name" className="mb-1 block text-sm">
            Spot name <span className="text-amber-400">*</span>
          </label>
          <input
            id="spot-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="area" className="mb-1 block text-sm">
            Area / neighbourhood <span className="text-amber-400">*</span>
          </label>
          <input
            id="area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="genre" className="mb-1 block text-sm">Main genre</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          >
            <option value="portrait">portrait</option>
            <option value="street">street</option>
            <option value="landscape">landscape</option>
            <option value="architecture">architecture</option>
          </select>
        </div>
        <div>
          <label htmlFor="best-time" className="mb-1 block text-sm">Best time of day</label>
          <select
            id="best-time"
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          >
            <option value="golden_hour">golden hour</option>
            <option value="midday">midday</option>
            <option value="blue_hour">blue hour</option>
            <option value="night">night</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block text-sm">Notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-amber-300 focus:outline-2 focus:outline-offset-2 focus:outline-amber-400"
        >
          Submit suggestion
        </button>
      </div>
    </div>
  );
}
