import { getSessions } from "@/lib/data";

export const metadata = { title: "Statistics — Dublin Photo Spots" };

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

function avgByMonth(sessions: ReturnType<typeof getSessions>) {
  const groups = new Map<number, number[]>();
  for (const s of sessions) {
    if (!groups.has(s.month)) groups.set(s.month, []);
    groups.get(s.month)!.push(s.session_rating);
  }
  return MONTH_NAMES.map((label, idx) => {
    const ratings = groups.get(idx + 1) ?? [];
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return { label, avg, count: ratings.length };
  });
}

function Bar({ label, value, max, count }: { label: string; value: number; max: number; count: number }) {
  const width = Math.round((value / max) * 100);
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-[var(--paper)]">{label.replace("_", " ")}</span>
        <span className="font-mono-data text-[var(--ash)]">{value.toFixed(1)} avg · {count} sessions</span>
      </div>
      <div className="h-3 w-full rounded-full bg-black/40">
        <div
          className="h-3 rounded-full bg-[var(--safelight)]"
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
  const byMonth = avgByMonth(sessions);

  const overallAvg =
    sessions.reduce((sum, s) => sum + s.session_rating, 0) / sessions.length;

  return (
    <div>
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        Contact sheet data
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">
        Session statistics
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--ash)]">
        Based on {sessions.length} fictional photo session records. Average
        rating across all sessions: {overallAvg.toFixed(1)} / 10.
      </p>

      <section className="mt-10" aria-labelledby="by-time">
        <h2 id="by-time" className="mb-4 font-display text-xl text-[var(--safelight)]">
          Average rating by time of day
        </h2>
        {byTime.map((row) => (
          <Bar key={row.label} label={row.label} value={row.avg} max={10} count={row.count} />
        ))}
        <p className="mt-2 text-sm text-[var(--ash)]">
          Golden hour and blue hour clearly outperform midday — soft directional
          light beats harsh overhead sun.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="by-weather">
        <h2 id="by-weather" className="mb-4 font-display text-xl text-[var(--safelight)]">
          Average rating by weather
        </h2>
        {byWeather.map((row) => (
          <Bar key={row.label} label={row.label} value={row.avg} max={10} count={row.count} />
        ))}
        <p className="mt-2 text-sm text-[var(--ash)]">
          Rain consistently lowers ratings, while fog and overcast conditions
          hold up surprisingly well.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="by-month">
        <h2 id="by-month" className="mb-4 font-display text-xl text-[var(--safelight)]">
          Average rating by month
        </h2>
        <div className="flex items-end gap-2">
          {byMonth.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-[120px] w-full items-end">
                <div
                  className="w-full rounded-t bg-[var(--safelight)]"
                  style={{ height: `${Math.max((m.avg / 10) * 100, m.count ? 4 : 0)}%` }}
                  role="img"
                  aria-label={`${m.label}: average rating ${m.avg.toFixed(1)} out of 10, ${m.count} sessions`}
                />
              </div>
              <span className="font-mono-data text-[9px] text-[var(--ash)]">{m.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-[var(--ash)]">
          Ratings shift across the year as daylight hours and typical weather
          change with the seasons.
        </p>
      </section>
    </div>
  );
}
