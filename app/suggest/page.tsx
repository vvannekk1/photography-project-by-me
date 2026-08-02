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
    const suggestion = { name, area, genre, bestTime, notes, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("suggestions") || "[]");
    localStorage.setItem("suggestions", JSON.stringify([...existing, suggestion]));
    setSubmitted(true);
    setError("");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-display text-3xl text-[var(--safelight)]">Thank you!</h1>
        <p className="mt-4 text-[var(--ash)]">
          Your suggestion has been recorded. In a production version it would
          be reviewed before publishing.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName(""); setArea(""); setNotes("");
          }}
          className="mt-8 rounded-lg border border-[var(--frame)] px-5 py-2 text-[var(--paper)] hover:border-[var(--safelight)]"
        >
          Suggest another spot
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        Add a frame
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">Suggest a spot</h1>
      <p className="mt-3 text-sm text-[var(--ash)]">
        No account needed. We don&apos;t collect any personal information —
        just the spot details.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="spot-name" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Spot name <span className="text-[var(--safelight)]">*</span>
          </label>
          <input
            id="spot-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="area" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Area / neighbourhood <span className="text-[var(--safelight)]">*</span>
          </label>
          <input
            id="area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="genre" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Main genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          >
            <option value="portrait">portrait</option>
            <option value="street">street</option>
            <option value="landscape">landscape</option>
            <option value="architecture">architecture</option>
          </select>
        </div>
        <div>
          <label htmlFor="best-time" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Best time of day
          </label>
          <select
            id="best-time"
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          >
            <option value="golden_hour">golden hour</option>
            <option value="midday">midday</option>
            <option value="blue_hour">blue hour</option>
            <option value="night">night</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block font-mono-data text-xs uppercase tracking-wide text-[var(--ash)]">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--frame)] bg-black/30 px-4 py-2 text-[var(--paper)] focus:border-[var(--safelight)] focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-[var(--safelight)]">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="rounded-md bg-[var(--safelight)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-110 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
        >
          Submit suggestion
        </button>
      </div>
    </div>
  );
}
