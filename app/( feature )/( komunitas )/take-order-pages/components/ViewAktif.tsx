"use client";

import { MapPin, Clock, Zap, CheckCircle2, Phone } from "lucide-react";

type AktifStatus = "MENUJU" | "BERJALAN" | "HAMPIR_SELESAI";

const STATUS_AKTIF: Record<AktifStatus, { label: string; color: string; bg: string }> = {
    MENUJU:         { label: "Menuju lokasi",   color: "text-blue-600",  bg: "bg-blue-50 border-blue-100"   },
    BERJALAN:       { label: "Sedang berjalan", color: "text-green-600", bg: "bg-green-50 border-green-100" },
    HAMPIR_SELESAI: { label: "Hampir selesai",  color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
};

const AKTIF = [
    { id: "A001", emoji: "🧹", layanan: "Bersih-Bersih", tugas: "Sapu & Pel, Kamar Mandi, Dapur",  pemesan: "Siti Rahayu",  lokasi: "Kuningan, Jaksel",  mulai: "14:05", estimasi: "16:00", budget: 85000,  status: "BERJALAN" as AktifStatus,       progres: 35 },
    { id: "A002", emoji: "🛍️", layanan: "Jasa Titip",    tugas: "Beli obat apotek + snack",         pemesan: "Budi Santoso", lokasi: "Pancoran, Jaksel",  mulai: "16:20", estimasi: "17:00", budget: 30000,  status: "MENUJU"   as AktifStatus,       progres: 15 },
];

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

export default function ViewAktif() {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 bg-green-50 border-b border-green-100 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">{AKTIF.length} bounty sedang berjalan</span>
                </div>
                <span className="text-[10px] text-green-500 font-medium">Live update</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {AKTIF.map((b) => {
                    const st = STATUS_AKTIF[b.status];
                    return (
                        <div key={b.id} className="bg-background border border-border/50 rounded-2xl overflow-hidden">
                            {/* Top */}
                            <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0">{b.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{b.layanan}</span>
                                    <p className="text-sm font-bold text-foreground mt-0.5 truncate">{b.tugas}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Pemesan: <span className="font-semibold text-foreground">{b.pemesan}</span></p>
                                </div>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold ${st.bg} ${st.color}`}>{st.label}</span>
                            </div>

                            {/* Progress */}
                            <div className="px-4 pb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] text-muted-foreground">Progres</span>
                                    <span className="text-[10px] font-bold text-blue-600">{b.progres}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${b.progres}%` }} />
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="px-4 pb-3 flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-blue-500" />{b.lokasi}</span>
                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />Mulai {b.mulai}</span>
                                <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5 text-amber-500" />Selesai ~{b.estimasi}</span>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-border/30 px-4 py-2.5 flex items-center justify-between bg-muted/20">
                                <span className="text-sm font-bold text-blue-600">{formatRupiah(b.budget)}</span>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border/50 rounded-xl px-2.5 py-1.5 transition-colors">
                                        <Phone className="w-3 h-3" />Hubungi
                                    </button>
                                    <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-2.5 py-1.5 transition-colors">
                                        <CheckCircle2 className="w-3 h-3" />Selesai
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
