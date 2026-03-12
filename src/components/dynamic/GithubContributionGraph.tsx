import { useEffect, useState, useCallback } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: (ContributionDay | null)[];
}

const LEVEL_COLORS = [
  "bg-zinc-800/40",        // level 0 — no contributions
  "bg-emerald-900/60",     // level 1
  "bg-emerald-700/80",     // level 2  
  "bg-emerald-500/90",     // level 3
  "bg-emerald-400",        // level 4
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function groupIntoWeeks(days: ContributionDay[]): ContributionWeek[] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  
  // Get last 26 weeks (6 months) to fit better in available space
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (26 * 7 * 24 * 60 * 60 * 1000));
  const recentDays = sorted.filter(day => new Date(day.date) >= sixMonthsAgo);
  
  if (recentDays.length === 0) return [];
  
  const weeks: ContributionWeek[] = [];
  let currentWeek: (ContributionDay | null)[] = [];

  // Pad the first week with nulls for days before the start
  const firstDow = new Date(recentDays[0].date + "T00:00:00").getDay();
  for (let i = 0; i < firstDow; i++) currentWeek.push(null);

  for (const day of recentDays) {
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
      
      // Calculate total for last 6 months only
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - (26 * 7 * 24 * 60 * 60 * 1000));
      const recentContributions = days.filter(day => new Date(day.date) >= sixMonthsAgo);
      setTotal(recentContributions.reduce((s: number, d: ContributionDay) => s + d.count, 0));
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
    return (
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-24 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
        <div className="h-32 w-full bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed flex items-center justify-center text-zinc-500 text-sm">
          No contribution data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-zinc-300">
          <span className="text-emerald-400 font-semibold">{total.toLocaleString()}</span> commits in last 6 months
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span>Less</span>
          <div className="flex gap-0.5">
            {LEVEL_COLORS.map((color, i) => (
              <span 
                key={i} 
                className={`w-2.5 h-2.5 rounded-sm ${color} border border-zinc-700/30`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative">
        {/* Month labels */}
        <div className="grid grid-cols-[auto_1fr] gap-3 mb-2">
          <div className="w-8" /> {/* Spacer for day labels */}
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((_, w) => {
              const label = monthLabels.find((m) => m.col === w);
              return (
                <div key={w} className="text-center">
                  {label && (
                    <span className="text-xs text-zinc-500 font-medium">{label.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[auto_1fr] gap-3">
          {/* Day labels */}
          <div className="flex flex-col justify-between text-right pr-1" style={{ height: "104px" }}>
            {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
              <span key={i} className="text-xs text-zinc-500 font-medium h-3 flex items-center justify-end">
                {label}
              </span>
            ))}
          </div>

          {/* Contribution grid */}
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, w) => (
              <div key={w} className="flex flex-col gap-1">
                {week.days.map((day, d) => (
                  <div
                    key={d}
                    className={`aspect-square rounded-[2px] border border-zinc-700/30 ${
                      day ? `${LEVEL_COLORS[day.level]} cursor-pointer` : "bg-transparent"
                    } transition-colors duration-200 relative`}
                    style={{ minWidth: '14px', minHeight: '14px' }}
                    onMouseEnter={(e) => {
                      if (!day) return;
                      console.log('Hover on day:', {
                        date: day.date,
                        count: day.count,
                        level: day.level
                      });
                      const rect = e.currentTarget.getBoundingClientRect();
                      const label = day.count === 0
                        ? `No commits on ${formatDate(day.date)}`
                        : `${day.count} commit${day.count !== 1 ? "s" : ""} on ${formatDate(day.date)}`;
                      console.log('Setting tooltip:', label);
                      setTooltip({ 
                        x: rect.left + rect.width / 2, 
                        y: rect.top - 5, 
                        text: label 
                      });
                    }}
                    onMouseLeave={() => {
                      console.log('Mouse leave, clearing tooltip');
                      setTooltip(null);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[99999] px-2 py-1 text-xs font-medium text-white bg-black border border-gray-600 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { 
    weekday: "short",
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}
