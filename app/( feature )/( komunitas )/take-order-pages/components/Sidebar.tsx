"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard, ListChecks, Star, Wallet,
    Settings, ChevronDown, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";

// ── Mock worker stats ──────────────────────────────────────
const STATS = [
    { label: "Tugas Selesai",   value: "24",   icon: CheckCircle2, color: "text-green-500"  },
    { label: "Sedang Berjalan", value: "2",    icon: Clock,        color: "text-blue-500"   },
    { label: "Rating",          value: "4.9",  icon: Star,         color: "text-amber-500"  },
    { label: "Pendapatan",      value: "1.2jt",icon: TrendingUp,   color: "text-purple-500" },
];

const NAV_ITEMS = [
    { label: "Ambil Bounty",  href: "/take-order-pages", icon: ListChecks     },
    { label: "Riwayat Tugas", href: "#",                 icon: Clock          },
    { label: "Dompet",        href: "#",                 icon: Wallet         },
    { label: "Pengaturan",    href: "#",                 icon: Settings       },
];

export default function Sidebar() {
    const [statsOpen, setStatsOpen] = useState(true);

    return (
        <aside className="w-64 shrink-0 flex flex-col bg-background border-r border-border/50 h-full overflow-y-auto">

            {/* Profile section */}
            <div className="px-5 pt-6 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        AF
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Ahmad Fauzi</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[11px] text-green-600 font-medium">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats accordion */}
            <div className="px-3 pt-4">
                <button
                    onClick={() => setStatsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                >
                    <span>Statistik Saya</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statsOpen ? "rotate-180" : ""}`} />
                </button>

                {statsOpen && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {STATS.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-muted/40 border border-border/40 rounded-2xl p-3 flex flex-col gap-1.5">
                                <Icon className={`w-3.5 h-3.5 ${color}`} />
                                <p className="text-base font-bold text-foreground leading-none">{value}</p>
                                <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="px-3 pt-5 flex flex-col gap-1">
                <p className="px-2 mb-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Menu
                </p>
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = label === "Ambil Bounty";
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto px-5 py-4 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground/50 text-center">© Bounty Platform</p>
            </div>
        </aside>
    );
}
