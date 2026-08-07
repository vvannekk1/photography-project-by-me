import { getLocations, slugify } from "@/lib/data";
import LightPlanner from "@/components/LightPlanner";
import type { LightLocation } from "@/components/LightPlanner";

export const metadata = { title: "Light Times — Dublin Photo Spots" };

export default function LightPage() {
  const locations: LightLocation[] = getLocations().map((location) => ({
    name: location.name,
    slug: slugify(location.name),
    latitude: location.latitude,
    longitude: location.longitude,
    bestTime: location.best_time,
  }));

  return (
    <div>
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        Plan the light
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">
        Golden hour calculator
      </h1>
      <p className="mt-3 mb-10 max-w-2xl text-[var(--ash)]">
        Pick a spot and a date to see exactly when the light turns. Every time
        below is calculated from the sun&apos;s position for that location, not
        looked up from a table.
      </p>
      <LightPlanner locations={locations} />
    </div>
  );
}
