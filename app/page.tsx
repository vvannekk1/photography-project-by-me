import Link from "next/link";
import type { CSSProperties } from "react";

// Needle angle computed from the real golden_hour average rating (6.5 / 10)
// on a -85deg to +85deg sweep: -85 + (6.5/10)*170 = 25.5deg
const NEEDLE_STYLE = {
  transformOrigin: "100px 108px",
  "--needle-angle": "25.5deg",
} as CSSProperties;

export default function Home() {
  return (
    <div>
      <section className="grid gap-14 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div className="rise-in">
          <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
            A light-first guide to Dublin
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-[var(--paper)] sm:text-6xl">
            Shoot Dublin
            <br />
            at its <span className="italic text-[var(--safelight)]">best light</span>
          </h1>
          <p className="mt-6 max-w-md text-[var(--ash)]">
            Fifteen locations, filtered by genre, best time of day and access
            difficulty — backed by data from 220 photo sessions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/locations"
              className="rounded-md bg-[var(--safelight)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-110 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
            >
              Browse locations
            </Link>
            <Link
              href="/predict"
              className="rounded-md border border-[var(--frame)] px-6 py-3 text-sm font-semibold text-[var(--paper)] transition hover:border-[var(--safelight)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]"
            >
              Predict a session
            </Link>
          </div>
        </div>

        <div
          className="rise-in rounded-2xl border border-[var(--frame)] bg-black/30 p-8"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="text-center font-mono-data text-[10px] uppercase tracking-[0.25em] text-[var(--ash)]">
            Light reading
          </p>
          <svg
            viewBox="0 0 200 120"
            className="mx-auto mt-4 w-full max-w-xs"
            role="img"
            aria-label="Gauge showing the golden hour average session rating of 6.5 out of 10"
          >
            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="var(--frame)" strokeWidth="2" />
            <line x1="22" y1="101" x2="10" y2="100" stroke="var(--ash)" strokeWidth="2" />
            <line x1="47" y1="50" x2="39" y2="42" stroke="var(--ash)" strokeWidth="2" />
            <line x1="100" y1="30" x2="100" y2="18" stroke="var(--ash)" strokeWidth="2" />
            <line x1="153" y1="50" x2="161" y2="42" stroke="var(--ash)" strokeWidth="2" />
            <line x1="178" y1="101" x2="190" y2="100" stroke="var(--ash)" strokeWidth="2" />
            <text x="6" y="114" fontSize="7" fill="var(--ash)">0</text>
            <text x="97" y="15" fontSize="7" fill="var(--ash)">5</text>
            <text x="182" y="114" fontSize="7" fill="var(--ash)">10</text>
            <g className="meter-needle" style={NEEDLE_STYLE}>
              <line x1="100" y1="108" x2="100" y2="28" stroke="var(--safelight)" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="100" cy="108" r="5" fill="var(--safelight)" />
          </svg>
          <p className="mt-2 text-center font-display text-4xl text-[var(--paper)]">
            6.5<span className="text-lg text-[var(--ash)]"> / 10</span>
          </p>
          <p className="text-center font-mono-data text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
            Golden hour avg · 220 sessions
          </p>
        </div>
      </section>

      <section className="grid gap-6 border-t border-[var(--frame)] pt-14 sm:grid-cols-3">
        <div className="rise-in" style={{ animationDelay: "0.05s" }}>
          <p className="font-mono-data text-xs text-[var(--safelight)]">N°01</p>
          <h2 className="mt-2 font-display text-lg text-[var(--paper)]">Curated spots</h2>
          <p className="mt-2 text-sm text-[var(--ash)]">
            From Ha&apos;penny Bridge to Howth Cliffs — genre, light and access
            info for every location.
          </p>
        </div>
        <div className="rise-in" style={{ animationDelay: "0.12s" }}>
          <p className="font-mono-data text-xs text-[var(--safelight)]">N°02</p>
          <h2 className="mt-2 font-display text-lg text-[var(--paper)]">Data-driven</h2>
          <p className="mt-2 text-sm text-[var(--ash)]">
            220 fictional session records show how time of day, weather and
            crowds affect results.
          </p>
        </div>
        <div className="rise-in" style={{ animationDelay: "0.19s" }}>
          <p className="font-mono-data text-xs text-[var(--safelight)]">N°03</p>
          <h2 className="mt-2 font-display text-lg text-[var(--paper)]">Community input</h2>
          <p className="mt-2 text-sm text-[var(--ash)]">
            Know a hidden gem? Suggest a new spot — no account or personal
            data required.
          </p>
        </div>
      </section>
    </div>
  );
}
