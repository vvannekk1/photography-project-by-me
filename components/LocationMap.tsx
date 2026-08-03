import Link from "next/link";
import { Location } from "@/lib/types";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function LocationMap({ locations }: { locations: Location[] }) {
  const lats = locations.map((l) => l.latitude);
  const lngs = locations.map((l) => l.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const PAD = 8;

  function project(lat: number, lng: number) {
    const xPct = PAD + ((lng - minLng) / (maxLng - minLng || 1)) * (100 - PAD * 2);
    const yPct = PAD + (1 - (lat - minLat) / (maxLat - minLat || 1)) * (100 - PAD * 2);
    return { xPct, yPct };
  }

  return (
    <div className="mb-10 rounded-xl border border-[var(--frame)] bg-black/20 p-4">
      <p className="mb-3 font-mono-data text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">
        Scouting map · {locations.length} pins
      </p>
      <div className="relative h-72 w-full overflow-hidden rounded-lg border border-[var(--frame)]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <line x1="0" y1="25" x2="100" y2="25" stroke="var(--frame)" strokeWidth="0.3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--frame)" strokeWidth="0.3" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="var(--frame)" strokeWidth="0.3" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="var(--frame)" strokeWidth="0.3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="var(--frame)" strokeWidth="0.3" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="var(--frame)" strokeWidth="0.3" />
        </svg>
        <span className="absolute left-1/2 top-1 -translate-x-1/2 font-mono-data text-[9px] text-[var(--ash)]">
          N
        </span>

        {locations.map((loc, i) => {
          const { xPct, yPct } = project(loc.latitude, loc.longitude);
          return (
            <Link
              key={loc.name}
              href={`/locations/${slugify(loc.name)}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              aria-label={`View ${loc.name}`}
            >
              <span className="block h-2.5 w-2.5 rounded-full border border-[var(--ink)] bg-[var(--safelight)] transition-transform group-hover:scale-150 group-focus-visible:scale-150" />
              <span className="pointer-events-none absolute left-1/2 top-[-1.6rem] -translate-x-1/2 whitespace-nowrap rounded bg-[var(--ink)] px-2 py-0.5 font-mono-data text-[10px] text-[var(--paper)] opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {i + 1}. {loc.name}
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-center font-mono-data text-[10px] text-[var(--ash)]">
        Tab or hover a pin to see its name · click to open
      </p>
    </div>
  );
}
