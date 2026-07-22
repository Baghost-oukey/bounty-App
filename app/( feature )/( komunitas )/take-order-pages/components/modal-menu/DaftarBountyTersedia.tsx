"use client";

import { useState } from "react";
import { MapPin, Clock, Zap, Star, ChevronRight, Filter, X, CheckCircle2 } from "lucide-react";
import { claimBountyTask } from "@/app/actions/bounty";
import { Button } from "@/components/ui/button";

interface Bounty {
    id: string;
    layanan: string;
    tugas: string;
    jarak: string;
    jadwal: string;
    budget: number;
    pesaing: number;
    rating: number;
    lokasi: string;
    deskripsi?: string;
}

const FILTERS = ["Semua","Terdekat","Tertinggi","Terbaru"];

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

interface Props {
    onAmbil?: () => void;
    bounties?: Bounty[];
    onRefresh?: () => void;
}

export default function ViewBounty({ onAmbil, bounties = [], onRefresh }: Props) {
    const [filter, setFilter] = useState("Semua");
    const [confirm, setConfirm] = useState<Bounty | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const filtered = filter === "Tertinggi"
        ? [...bounties].sort((a, b) => b.budget - a.budget)
        : bounties;

    const handleKonfirmasi = async () => {
        if (!confirm || loading) return;
        setLoading(true);
        try {
            const res = await claimBountyTask(confirm.id);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setConfirm(null);
                    onRefresh?.();        // Refresh list
                    onAmbil?.();          // Pindah ke tab Chat
                }, 1200);
            } else {
                alert(res.error || "Gagal mengambil bounty.");
            }
        } catch (err) {
            console.error("Error claiming bounty:", err);
            alert("Terjadi kesalahan server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden relative">

            {/* Filter bar */}
            <div className="flex gap-1.5 px-5 py-3 border-b border-border/30 shrink-0 items-center bg-background">
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
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] select-none">
                        <p className="text-xs font-bold text-muted-foreground">Tidak ada bounty aktif</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">Semua pengajuan telah diambil oleh pekerja lain.</p>
                    </div>
                ) : (
                    filtered.map(b => (
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
                    ))
                )}
            </div>

            {/* ── Modal konfirmasi ── */}
            {confirm && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
                    <div className="w-full bg-background rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-250">
                        
                        {success ? (
                            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={32} className="animate-bounce" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Bounty Berhasil Diambil!</p>
                                    <p className="text-[10px] text-muted-foreground">Hubungi pembuat tugas lewat chat untuk koordinasi.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{confirm.layanan}</span>
                                        <h3 className="text-sm font-bold text-foreground mt-1.5">{confirm.tugas}</h3>
                                    </div>
                                    <button onClick={() => setConfirm(null)} className="p-1 hover:bg-muted rounded-full transition-colors">
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="bg-muted/30 border border-border/40 rounded-2xl p-4 space-y-3 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lokasi</span>
                                        <span className="font-semibold text-foreground text-right truncate max-w-[200px]">{confirm.lokasi}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Jadwal</span>
                                        <span className="font-semibold text-foreground">{confirm.jadwal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Keterangan</span>
                                        <span className="font-semibold text-foreground text-right max-w-[200px] break-words">{confirm.deskripsi || "Tidak ada keterangan tambahan."}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/30 pt-2.5">
                                        <span className="text-muted-foreground">Pendapatan Anda</span>
                                        <span className="font-bold text-blue-600 text-sm">{formatRupiah(confirm.budget)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" disabled={loading} onClick={() => setConfirm(null)} className="flex-1 h-10 rounded-2xl text-xs font-semibold">
                                        Kembali
                                    </Button>
                                    <Button disabled={loading} onClick={handleKonfirmasi} className="flex-1 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20">
                                        {loading ? (
                                            <span className="flex items-center gap-1.5 justify-center">
                                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Memproses...
                                            </span>
                                        ) : (
                                            <span>Ambil Pekerjaan Ini</span>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}
