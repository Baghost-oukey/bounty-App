"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const WEEKLY_DATA = [
    { day: "Sen", value: 120000 },
    { day: "Sel", value: 85000  },
    { day: "Rab", value: 210000 },
    { day: "Kam", value: 175000 },
    { day: "Jum", value: 310000 },
    { day: "Sab", value: 95000  },
    { day: "Min", value: 140000 },
];

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

const formatShort = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000)     return `${(val / 1_000).toFixed(0)}rb`;
    return `${val}`;
};

const BAR_HEIGHT = 96; // px — fixed container height for bars

export default function IncomeTracker() {
    const [activeIdx, setActiveIdx] = useState(TODAY_INDEX);

    const maxVal    = Math.max(...WEEKLY_DATA.map((d) => d.value));
    const total     = WEEKLY_DATA.reduce((s, d) => s + d.value, 0);
    const prevTotal = total * 0.82;
    const growth    = ((total - prevTotal) / prevTotal) * 100;
    const isUp      = growth > 0;
    const active    = WEEKLY_DATA[activeIdx];

    return (
        <div className="bg-background border border-border/50 rounded-3xl p-6 flex flex-col gap-6">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">Aktivitas Mu</h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[500px]">
                        Nominal yang sudah kamu kerjakan untuk menyelesaikan masalah nih. dan akan di reset setiap minggunya
                    </p>
                </div>
                <span className="shrink-0 bg-muted/60 border border-border/50 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-muted transition-colors select-none">
                    Minggu ini
                </span>
            </div>

            {/* ── Bar chart ── */}
            <div className="flex items-end gap-2">
                {WEEKLY_DATA.map((d, i) => {
                    const barH    = Math.max((d.value / maxVal) * BAR_HEIGHT, 6);
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
                                        ? "bg-blue-600 text-white opacity-100"
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
                                            ? "bg-blue-600"
                                            : "bg-blue-100 dark:bg-blue-950/40 group-hover:bg-blue-300 dark:group-hover:bg-blue-700/50"
                                    }`}
                                    style={{ height: barH }}
                                />
                            </div>

                            {/* Day label */}
                            <span
                                className={`text-[11px] font-semibold transition-colors ${
                                    isActive
                                        ? "text-blue-600"
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
                        {isUp
                            ? <TrendingUp  className="w-4 h-4 text-green-500" />
                            : <TrendingDown className="w-4 h-4 text-red-500" />
                        }
                        <span className={`text-2xl font-bold ${isUp ? "text-green-500" : "text-red-500"}`}>
                            {isUp ? "+" : ""}{growth.toFixed(0)}%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Minggu ini lebih {isUp ? "tinggi" : "rendah"} dari minggu lalu
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
