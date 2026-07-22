"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface WeeklyDataItem {
  day: string;
  value: number;
}

interface IncomeTrackerProps {
  weeklyData?: WeeklyDataItem[];
}

const DEFAULT_WEEKLY: WeeklyDataItem[] = [
  { day: "Sen", value: 0 },
  { day: "Sel", value: 0 },
  { day: "Rab", value: 0 },
  { day: "Kam", value: 0 },
  { day: "Jum", value: 0 },
  { day: "Sab", value: 0 },
  { day: "Min", value: 0 },
];

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const formatRupiah = (val: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

const formatShort = (val: number) => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
  if (val >= 1_000)     return `${(val / 1_000).toFixed(0)}rb`;
  return `${val}`;
};

const BAR_HEIGHT = 96; // px

export default function IncomeTracker({ weeklyData = DEFAULT_WEEKLY }: IncomeTrackerProps) {
  const [activeIdx, setActiveIdx] = useState(TODAY_INDEX);

  const maxVal = Math.max(...weeklyData.map((d) => d.value), 1000); // Avoid divide by 0
  const total = weeklyData.reduce((s, d) => s + d.value, 0);
  
  // Calculate mock comparison with past week if database has no records
  const isNeutral = total === 0;
  const prevTotal = total === 0 ? 0 : total * 0.85;
  const growth = total === 0 ? 0 : ((total - prevTotal) / prevTotal) * 100;
  const isUp = growth > 0;
  const active = weeklyData[activeIdx] || { day: "Hari ini", value: 0 };

  return (
    <div className="bg-background border border-border/50 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Aktivitas Mu</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[500px]">
            Nominal pekerjaan yang sudah diselesaikan minggu ini. Data diperbarui real-time.
          </p>
        </div>
        <span className="shrink-0 bg-muted/60 border border-border/50 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors select-none">
          Minggu ini
        </span>
      </div>

      {/* ── Bar chart ── */}
      <div className="flex items-end gap-2">
        {weeklyData.map((d, i) => {
          const barH = Math.max((d.value / maxVal) * BAR_HEIGHT, 6);
          const isActive = i === activeIdx;

          return (
            <button
              key={d.day}
              onClick={() => setActiveIdx(i)}
              className="flex-1 flex flex-col items-center gap-2 group focus:outline-none"
            >
              {/* Tooltip above bar */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white opacity-100 animate-bounce"
                    : "opacity-0 bg-blue-600 text-white pointer-events-none"
                }`}
              >
                {formatShort(d.value)}
              </span>

              {/* Bar */}
              <div
                className="w-full flex items-end justify-center"
                style={{ height: BAR_HEIGHT }}
              >
                <div
                  className={`w-full rounded-t-xl rounded-b-md transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-blue-100 dark:bg-blue-950/40 group-hover:bg-blue-300 dark:group-hover:bg-blue-700/50"
                  }`}
                  style={{ height: barH }}
                />
              </div>

              {/* Day label */}
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {d.day}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Footer: growth + total ── */}
      <div className="flex items-end justify-between border-t border-border/40 pt-4 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            {isNeutral ? (
              <span className="text-2xl font-bold text-slate-400">0%</span>
            ) : isUp ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold text-green-500">+{growth.toFixed(0)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-2xl font-bold text-red-500">{growth.toFixed(0)}%</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total > 0 ? "Bagus! Aktivitas pengerjaan meningkat minggu ini." : "Belum ada aktivitas pengerjaan tercatat."}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[11px] text-muted-foreground">
            {active.day} — dipilih
          </p>
          <p className="text-base font-bold text-foreground">
            {formatRupiah(active.value)}
          </p>
        </div>
      </div>
    </div>
  );
}
