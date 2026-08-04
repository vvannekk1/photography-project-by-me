export type HeatCell = {
  genre: string;
  monthIndex: number;
  monthLabel: string;
  avg: number;
  count: number;
};

const CELL_BASE =
  "relative h-11 w-full rounded border border-[var(--frame)] text-center align-middle font-mono-data text-[9px]";

function cellStyle(cell: HeatCell, min: number, max: number) {
  if (cell.count === 0) {
    return { backgroundColor: "transparent" };
  }
  const span = max - min || 1;
  const intensity = Math.min(Math.max((cell.avg - min) / span, 0), 1);
  const percent = Math.round(12 + intensity * 76);
  return {
    backgroundColor:
      "color-mix(in srgb, var(--safelight) " + percent + "%, transparent)",
  };
}

function textColour(cell: HeatCell, min: number, max: number) {
  if (cell.count === 0) return "var(--ash)";
  const span = max - min || 1;
  const intensity = (cell.avg - min) / span;
  return intensity > 0.55 ? "var(--ink)" : "var(--paper)";
}

export default function GenreMonthHeatmap({
  genres,
  months,
  cells,
}: {
  genres: string[];
  months: string[];
  cells: HeatCell[];
}) {
  const filled = cells.filter((cell) => cell.count > 0);
  const values = filled.map((cell) => cell.avg);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 10;

  function findCell(genre: string, monthIndex: number) {
    return cells.find(
      (cell) => cell.genre === genre && cell.monthIndex === monthIndex
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1">
          <caption className="sr-only">
            Average session rating for each genre in each month of the year
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-24 text-left">
                <span className="sr-only">Genre</span>
              </th>
              {months.map((month, index) => (
                <th
                  key={month}
                  scope="col"
                  className="font-mono-data text-[9px] font-normal uppercase tracking-wide text-[var(--ash)]"
                >
                  {month}
                  <span className="sr-only"> (month {index + 1})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr key={genre}>
                <th
                  scope="row"
                  className="pr-2 text-right font-mono-data text-[10px] font-normal uppercase tracking-wide text-[var(--ash)]"
                >
                  {genre}
                </th>
                {months.map((month, monthIndex) => {
                  const cell = findCell(genre, monthIndex);
                  if (!cell) return <td key={month} />;

                  const readable =
                    cell.count === 0
                      ? genre + " in " + month + ": no sessions recorded"
                      : genre +
                        " in " +
                        month +
                        ": average rating " +
                        cell.avg.toFixed(1) +
                        " out of 10 from " +
                        cell.count +
                        " sessions";

                  return (
                    <td key={month} className="p-0">
                      <div
                        className={CELL_BASE}
                        style={{
                          ...cellStyle(cell, min, max),
                          color: textColour(cell, min, max),
                          lineHeight: "2.75rem",
                        }}
                        title={readable}
                        aria-label={readable}
                        role="img"
                      >
                        {cell.count === 0 ? "–" : cell.avg.toFixed(1)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
          {min.toFixed(1)}
        </span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, color-mix(in srgb, var(--safelight) 12%, transparent), color-mix(in srgb, var(--safelight) 88%, transparent))",
          }}
          role="img"
          aria-label={
            "Colour scale from " +
            min.toFixed(1) +
            " to " +
            max.toFixed(1) +
            " average rating"
          }
        />
        <span className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
          {max.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
