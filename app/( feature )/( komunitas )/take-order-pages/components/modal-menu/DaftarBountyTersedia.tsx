"use client";

import { useState } from "react";
import { MapPin, Clock, Zap, Star, ChevronRight, Filter, X, CheckCircle2 } from "lucide-react";

interface Bounty {
    id: string; layanan: string; tugas: string;
    jarak: string; jadwal: string; budget: number;
    pesaing: number; rating: number;
}

const BOUNTIES: Bounty[] = [
    { id:"B001", layanan:"Bersih-Bersih",     tugas:"Sapu & Pel, Kamar Mandi, Dapur",    jarak:"0.8 km", jadwal:"Hari ini, 14:00", budget:85000,  pesaing:2, rating:4.9 },
    { id:"B002", layanan:"Antar Jemput",      tugas:"Antar ke Bandara Soekarno-Hatta",   jarak:"2.1 km", jadwal:"Besok, 06:00",    budget:120000, pesaing:4, rating:4.7 },
    { id:"B003", layanan:"Jasa Titip",        tugas:"Beli obat apotek + snack Indomaret",jarak:"1.4 km", jadwal:"Hari ini, 16:30", budget:30000,  pesaing:1, rating:4.8 },
    { id:"B004", layanan:"Bantuan Digital",   tugas:"Desain logo brand kopi — minimalis",jarak:"—",      jadwal:"Deadline 3 hari", budget:200000, pesaing:7, rating:5.0 },
    { id:"B005", layanan:"Bimbingan Belajar", tugas:"Les matematika SMA — persiapan UN", jarak:"3.2 km", jadwal:"Sabtu, 09:00",    budget:150000, pesaing:3, rating:4.6 },
];

const FILTERS = ["Semua","Terdekat","Tertinggi","Terbaru"];

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

interface Props {
    onAmbil?: () => void;
}

export default function ViewBounty({ onAmbil }: Props) {
    const [filter,   setFilter]   = useState("Semua");
    const [confirm,  setConfirm]  = useState<Bounty | null>(null);
    const [success,  setSuccess]  = useState(false);

    const filtered = filter === "Tertinggi"
        ? [...BOUNTIES].sort((a, b) => b.budget - a.budget)
        : filter === "Terdekat"
            ? [...BOUNTIES].sort((a, b) => parseFloat(a.jarak) - parseFloat(b.jarak))
            : BOUNTIES;

    const handleKonfirmasi = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setConfirm(null);
            onAmbil?.();          // → pindah ke tab Chat
        }, 1200);
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden relative">

            {/* Filter bar */}
            <div className="flex gap-1.5 px-5 py-3 border-b border-border/30 shrink-0 items-center">
                <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all ${
                                filter === f
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-border/60 text-muted-foreground hover:border-blue-300 hover:text-blue-600"
                            }`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {filtered.map(b => (
                    <button
                        key={b.id}
                        onClick={() => setConfirm(b)}
                        className="w-full group flex gap-3 p-3.5 rounded-2xl border border-border/50 hover:border-blue-300 hover:bg-blue-50/30 bg-background cursor-pointer transition-all text-left"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{b.layanan}</span>
                                    <p className="text-xs font-semibold text-foreground truncate mt-1">{b.tugas}</p>
                                </div>
                                <p className="text-sm font-bold text-blue-600 shrink-0">{formatRupiah(b.budget)}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {b.jarak !== "—" && <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><MapPin className="w-2.5 h-2.5 text-blue-500" />{b.jarak}</span>}
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Clock className="w-2.5 h-2.5" />{b.jadwal}</span>
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Zap className="w-2.5 h-2.5 text-amber-500" />{b.pesaing} minat</span>
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-auto"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />{b.rating}</span>
                            </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-blue-600 shrink-0 mt-1 transition-colors" />
                    </button>
                ))}
            </div>

            {/* ── Modal konfirmasi ── */}
            {confirm && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm">
                    <div className="w-full bg-background rounded-t-3xl p-5 space-y-4 shadow-2xl">

                        {success ? (
                            /* Success state */
                            <div className="flex flex-col items-center py-6 gap-3 text-center">
                                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Bounty Diambil!</p>
                                    <p className="text-xs text-muted-foreground mt-1">Mengarahkan ke chat dengan pemesan...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Konfirmasi Ambil Bounty</p>
                                        <p className="text-base font-bold text-foreground mt-0.5">{confirm.tugas}</p>
                                    </div>
                                    <button onClick={() => setConfirm(null)} className="p-1.5 hover:bg-muted rounded-xl transition-colors">
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Detail */}
                                <div className="bg-muted/30 border border-border/40 rounded-2xl divide-y divide-border/30 text-xs">
                                    <div className="px-4 py-2.5 flex justify-between">
                                        <span className="text-muted-foreground">Layanan</span>
                                        <span className="font-semibold text-blue-600">{confirm.layanan}</span>
                                    </div>
                                    {confirm.jarak !== "—" && (
                                        <div className="px-4 py-2.5 flex justify-between">
                                            <span className="text-muted-foreground">Jarak</span>
                                            <span className="font-semibold text-foreground">{confirm.jarak}</span>
                                        </div>
                                    )}
                                    <div className="px-4 py-2.5 flex justify-between">
                                        <span className="text-muted-foreground">Jadwal</span>
                                        <span className="font-semibold text-foreground">{confirm.jadwal}</span>
                                    </div>
                                    <div className="px-4 py-2.5 flex justify-between">
                                        <span className="text-muted-foreground">Budget</span>
                                        <span className="font-bold text-blue-600">{formatRupiah(confirm.budget)}</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-center text-muted-foreground">
                                    Setelah mengambil bounty, kamu akan langsung terhubung ke chat dengan pemesan.
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button onClick={() => setConfirm(null)}
                                        className="flex-1 h-11 rounded-2xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                        Batal
                                    </button>
                                    <button onClick={handleKonfirmasi}
                                        className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-colors">
                                        Ya, Ambil Bounty
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
