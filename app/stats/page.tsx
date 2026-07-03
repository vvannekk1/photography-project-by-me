import { getSessions } from "@/lib/data";

export const metadata = { title: "Statistics — Dublin Photo Spots" };

function avgBy(sessions: ReturnType<typeof getSessions>, key: "time_of_day" | "weather") {
  const groups = new Map<string, number[]>();
  for (const s of sessions) {
    const k = s[key];
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(s.session_rating);
  }
  return [...groups.entries()]
    .map(([label, ratings]) => ({
      label,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      count: ratings.length,
    }))
    .sort((a, b) => b.avg - a.avg);
}

function Bar({ label, value, max, count }: { label: string; value: number; max: number; count: number }) {
  const width = Math.round((value / max) * 100);
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label.replace("_", " ")}</span>
        <span className="text-neutral-400">{value.toFixed(1)} avg · {count} sessions</span>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-800">
        <div
          className="h-3 rounded-full bg-amber-400"
          style={{ width: `${width}%` }}
          role="img"
          aria-label={`${label}: average rating ${value.toFixed(1)} out of 10`}
        />
      </div>
    </div>
  );
}

export default function StatsPage() {
  const sessions = getSessions();
  const byTime = avgBy(sessions, "time_of_day");
  const byWeather = avgBy(sessions, "weather");

  const overallAvg =
    sessions.reduce((sum, s) => sum + s.session_rating, 0) / sessions.length;

  return (
    <div>
      <h1 className="text-3xl font-bold">Session statistics</h1>
      <p className="mt-3 max-w-2xl text-neutral-400">
        Based on {sessions.length} fictional photo session records. Average
        rating across all sessions: {overallAvg.toFixed(1)} / 10.
      </p>

      <section className="mt-10" aria-labelledby="by-time">
        <h2 id="by-time" className="mb-4 text-xl font-semibold text-amber-400">
          Average rating by time of day
        </h2>
        {byTime.map((row) => (
          <Bar key={row.label} label={row.label} value={row.avg} max={10} count={row.count} />
        ))}
        <p className="mt-2 text-sm text-neutral-500">
          Golden hour and blue hour clearly outperform midday — soft directional
          light beats harsh overhead sun.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="by-weather">
        <h2 id="by-weather" className="mb-4 text-xl font-semibold text-amber-400">
          Average rating by weather
        </h2>
        {byWeather.map((row) => (
          <Bar key={row.label} label={row.label} value={row.avg} max={10} count={row.count} />
        ))}
        <p className="mt-2 text-sm text-neutral-500">
          Rain consistently lowers ratings, while fog and overcast conditions
          hold up surprisingly well.
        </p>
      </section>
    </div>
  );
}
