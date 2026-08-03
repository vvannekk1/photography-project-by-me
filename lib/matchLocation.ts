import { Location, Session } from "./types";

export type LocationMatch = {
  name: string;
  avgRating: number;
  sessionCount: number;
};

export function findBestLocation(
  genre: string,
  timeOfDay: string,
  locations: Location[],
  sessions: Session[]
): LocationMatch | null {
  const exact = sessions.filter(
    (s) => s.genre === genre && s.time_of_day === timeOfDay
  );
  const pool = exact.length > 0 ? exact : sessions.filter((s) => s.genre === genre);
  if (pool.length === 0) return null;

  const groups = new Map<string, number[]>();
  for (const s of pool) {
    if (!groups.has(s.location_name)) groups.set(s.location_name, []);
    groups.get(s.location_name)!.push(s.session_rating);
  }

  let best: LocationMatch | null = null;
  for (const [name, ratings] of groups) {
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    if (!best || avgRating > best.avgRating) {
      best = { name, avgRating, sessionCount: ratings.length };
    }
  }
  return best;
}

export function buildLookup(locations: Location[], sessions: Session[]) {
  const genres = ["portrait", "street", "landscape", "architecture"];
  const times = ["golden_hour", "blue_hour", "midday", "night"];
  const lookup: Record<string, LocationMatch | null> = {};
  for (const g of genres) {
    for (const t of times) {
      lookup[`${g}|${t}`] = findBestLocation(g, t, locations, sessions);
    }
  }
  return lookup;
}
