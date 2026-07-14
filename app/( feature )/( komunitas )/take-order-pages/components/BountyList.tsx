"use client";

import { useState } from "react";
import { MapPin, Clock, Zap, ChevronRight, Star, Filter } from "lucide-react";

// ── Types ──────────────────────────────────────────────────

type BountyStatus = "TERBUKA" | "HAMPIR_PENUH";

interface Bounty {
    id: string;
    layanan: string;
    emoji: string;
    tugas: string;
    lokasi: string;
    jarak: string;
    jadwal: string;
    budget: number;
    status: BountyStatus;
    rating: number;
    pesaing: number;
}

// ── Mock data ──────────────────────────────────────────────

const BOUNTIES: Bounty[] = [
    {
        id: "BNT-001",
        layanan: "Bersih-Bersih",
        emoji: "🧹",
        tugas: "Sapu & Pel, Kamar Mandi, Dapur",
        lokasi: "Kuningan, Jakarta Selatan",
        jarak: "0.8 km",
        jadwal: "Hari ini, 14:00",
        budget: 85000,
        status: "TERBUKA",
        rating: 4.9,
        pesaing: 2,
    },
    {
        id: "BNT-002",
        layanan: "Antar Jemput",
        emoji: "🚗",
        tugas: "Antar ke bandara Soekarno-Hatta",
        lokasi: "Senayan, Jakarta Pusat",
        jarak: "2.1 km",
        jadwal: "Besok, 06:00",
        budget: 120000,
        status: "TERBUKA",
        rating: 4.7,
        pesaing: 4,
    },
    {
        id: "BNT-003",
        layanan: "Bantuan Digital",
        emoji: "💻",
        tugas: "Desain logo minimalis untuk brand kopi",
        lokasi: "Remote",
        jarak: "—",
        jadwal: "Deadline 3 hari",
        budget: 200000,
        status: "HAMPIR_PENUH",
        rating: 5.0,
        pesaing: 7,
    },
    {
        id: "BNT-004",
        layanan: "Jasa Titip",
        emoji: "🛍️",
        tugas: "Beli obat di apotek + snack Indomaret",
        lokasi: "Pancoran, Jakarta Selatan",
        jarak: "1.4 km",
        jadwal: "Hari ini, 16:30",
        budget: 30000,
        status: "TERBUKA",
        rating: 4.8,
        pesaing: 1,
    },
    {
        id: "BNT-005",
        layanan: "Bimbingan Belajar",
        emoji: "📚",
        tugas: "Les matematika SMA — persiapan UN",
        lokasi: "Kebayoran Baru, Jakarta Selatan",
        jarak: "3.2 km",
        jadwal: "Sabtu, 09:00",
        budget: 150000,
        status: "TERBUKA",
        rating: 4.6,
        pesaing: 3,
    },
];

const STATUS_CONFIG: Record<BountyStatus, { label: string; className: string }> = {
    TERBUKA:      { label: "Terbuka",      className: "text-green-700 bg-green-50 border-green-200"  },
    HAMPIR_PENUH: { label: "Hampir penuh", className: "text-amber-700 bg-amber-50 border-amber-200"  },
};

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

// ── Component ──────────────────────────────────────────────

export default function BountyList() {
    const [filter, setFilter] = useState("Semua");
    const FILTERS = ["Semua", "Bersih-Bersih", "Antar Jemput", "Bantuan Digital", "Jasa Titip", "Bimbingan Belajar"];

    const filtered = filter === "Semua"
        ? BOUNTIES
        : BOUNTIES.filter((b) => b.layanan === filter);

    return (
        <div className="flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Ambil Bounty</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {filtered.length} bounty tersedia di sekitarmu
                    </p>
                </div>
                <button className="flex items-center gap-2 border border-border/60 bg-background rounded-2xl px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                </button>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                            filter === f
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                                : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                {filtered.map((b) => {
                    const cfg = STATUS_CONFIG[b.status];
                    return (
                        <div
                            key={b.id}
                            className="group bg-background border border-border/50 hover:border-blue-300 rounded-3xl p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-11 h-11 rounded-2xl bg-muted/60 border border-border/40 flex items-center justify-center text-xl shrink-0">
                                    {b.emoji}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-semibold text-blue-600">{b.layanan}</span>
                                                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${cfg.className}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground leading-snug">{b.tugas}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-base font-bold text-foreground">{formatRupiah(b.budget)}</p>
                                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[11px] font-semibold text-muted-foreground">{b.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <MapPin className="w-3 h-3 text-blue-500" />
                                            {b.lokasi}
                                            {b.jarak !== "—" && (
                                                <span className="text-blue-600 font-semibold ml-0.5">· {b.jarak}</span>
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {b.jadwal}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Zap className="w-3 h-3 text-amber-500" />
                                            {b.pesaing} pekerja minat
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
