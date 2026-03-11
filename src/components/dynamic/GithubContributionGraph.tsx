import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: (ContributionDay | null)[];
}

const LEVEL_COLORS = [
  "bg-zinc-800/60",        // level 0 — no contributions
  "bg-emerald-900/70",     // level 1
  "bg-emerald-700/80",     // level 2
  "bg-emerald-500",        // level 3
  "bg-emerald-400",        // level 4
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function groupIntoWeeks(days: ContributionDay[]): ContributionWeek[] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: ContributionWeek[] = [];
  let currentWeek: (ContributionDay | null)[] = [];

  // Pad the first week with nulls for days before the start
  const firstDow = new Date(sorted[0].date + "T00:00:00").getDay();
  for (let i = 0; i < firstDow; i++) currentWeek.push(null);

  for (const day of sorted) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
  }

  // Pad last partial week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push({ days: currentWeek });
  }

  return weeks;
}

function getMonthLabels(weeks: ContributionWeek[]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks.length; w++) {
    // Find the first non-null day in this week
    const day = weeks[w].days.find((d) => d !== null);
    if (!day) continue;
    const month = new Date(day.date + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTH_LABELS[month], col: w });
      lastMonth = month;
    }
  }

  return labels;
}

export const GithubContributionGraph = ({
  username = "mqverk",
}: {
  username?: string;
}) => {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/github-contributions?username=${encodeURIComponent(username)}`);
      if (!res.ok) return;
      const json = await res.json();
      const days: ContributionDay[] = json.contributions || [];
      setWeeks(groupIntoWeeks(days));
      setTotal(json.total || days.reduce((s: number, d: ContributionDay) => s + d.count, 0));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthLabels = getMonthLabels(weeks);

  if (loading) {
    return <div className="h-[130px] w-full bg-zinc-900 rounded-lg animate-pulse" />;
  }

  if (weeks.length === 0) {
    return (
      <div className="h-[130px] w-full bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed flex items-center justify-center text-zinc-500 text-xs">
        No contribution data
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Total count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-500">
          <span className="text-zinc-300 font-semibold">{total.toLocaleString()}</span> contributions in the last year
        </span>
        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <span key={i} className={`w-[10px] h-[10px] rounded-sm ${color}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-fit">
          {/* Month labels row */}
          <div className="flex mb-1 ml-[28px]" style={{ gap: "3px" }}>
            {weeks.map((_, w) => {
              const label = monthLabels.find((m) => m.col === w);
              return (
                <div key={w} className="flex-shrink-0" style={{ width: 11 }}>
                  {label && (
                    <span className="text-[10px] text-zinc-500 leading-none">{label.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid: day labels + cells */}
          <div className="flex gap-0">
            {/* Day labels column */}
            <div className="flex flex-col justify-between pr-1.5 shrink-0" style={{ gap: "3px", height: `${7 * 11 + 6 * 3}px` }}>
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                <span key={i} className="text-[10px] text-zinc-500 leading-none h-[11px] flex items-center" style={{ width: 22 }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Contribution cells */}
            <div className="flex" style={{ gap: "3px" }}>
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col" style={{ gap: "3px" }}>
                  {week.days.map((day, d) => (
                    <div
                      key={d}
                      className={`w-[11px] h-[11px] rounded-sm ${day ? LEVEL_COLORS[day.level] : "bg-transparent"} ${day ? "cursor-pointer hover:ring-1 hover:ring-zinc-500" : ""} transition-all duration-100`}
                      onMouseEnter={(e) => {
                        if (!day) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const label = day.count === 0
                          ? `No contributions on ${formatDate(day.date)}`
                          : `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${formatDate(day.date)}`;
                        setTooltip({ x: rect.left + rect.width / 2, y: rect.top, text: label });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-[11px] text-zinc-200 bg-zinc-800 border border-zinc-700 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </motion.div>
  );
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
