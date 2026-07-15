"use client";

import { CheckCircle2, Star, TrendingUp } from "lucide-react";

const WEEK_DATA = [2, 5, 3, 7, 4, 6, 3];
const DAYS      = ["S","S","R","K","J","S","M"];
const maxWeek   = Math.max(...WEEK_DATA);

export default function ViewStats() {
    return (
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label:"Selesai",    value:"24",    icon:CheckCircle2, color:"text-green-500", bg:"bg-green-50",  border:"border-green-100"  },
                    { label:"Rating",     value:"4.9",   icon:Star,         color:"text-amber-500", bg:"bg-amber-50",  border:"border-amber-100"  },
                    { label:"Pendapatan", value:"1.2jt", icon:TrendingUp,   color:"text-blue-600",  bg:"bg-blue-50",   border:"border-blue-100"   },
                ].map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-3.5 flex flex-col gap-2`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                        <p className="text-xl font-bold text-foreground leading-none">{value}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div className="bg-background border border-border/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">Tugas minggu ini</p>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {WEEK_DATA.reduce((a, b) => a + b, 0)} total
                    </span>
                </div>
                <div className="flex items-end gap-2" style={{ height: 72 }}>
                    {WEEK_DATA.map((v, i) => {
                        const isToday = i === 4;
                        const h = Math.max((v / maxWeek) * 56, 6);
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className={`w-full rounded-t-xl ${isToday ? "bg-blue-600 shadow-sm shadow-blue-600/30" : "bg-blue-100"}`} style={{ height: h }} />
                                <span className={`text-[9px] font-semibold ${isToday ? "text-blue-600" : "text-muted-foreground"}`}>{DAYS[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Earnings card */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -right-2 top-8 w-14 h-14 bg-white/10 rounded-full" />
                <p className="text-[11px] font-semibold opacity-75 mb-1 relative z-10">Pendapatan minggu ini</p>
                <p className="text-2xl font-bold relative z-10">Rp 485.000</p>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block relative z-10">↑ 18% dari minggu lalu</span>
            </div>

            {/* Trust score */}
            <div className="bg-background border border-border/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-foreground">Trust Score</p>
                    <span className="text-sm font-bold text-blue-600">87 / 100</span>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "87%" }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Kamu termasuk pekerja terpercaya 🏅</p>
            </div>
        </div>
    );
}
