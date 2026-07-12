"use client";

import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import KategoriInput   from "./KategoriInput";
import WaktuInput      from "./WaktuInput";
import ModalKonfirmasi from "./ModalKonfirmasi";
import ModalSelesai    from "./ModalSelesai";
import { DEFAULT_ADDRESS } from "./constants";
import { CardContentProps } from "./types";

export default function CardContent({
    step, setStep,
    selectedCategories, setSelectedCategories,
    customCategory, setCustomCategory,
    description, setDescription,
    date, setDate,
    time, setTime,
    price, handlePriceInput,
    selectedLabels, finalPrice,
    canPost, handlePost,
}: CardContentProps) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-4 border-b border-border/40 shrink-0">
                <Link href="/dashboard" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                    <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </Link>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Layanan</p>
                    <h1 className="text-base font-bold text-foreground truncate">Bersih-Bersih</h1>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-green-600">Tersedia</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
                {step === "input" && (
                    <div className="px-5 py-5 space-y-5 pb-10">
                        {/* Lokasi */}
                        <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="text-xs text-blue-700 flex-1 truncate">{DEFAULT_ADDRESS}</span>
                            <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</button>
                        </div>

                        <KategoriInput
                            selected={selectedCategories}
                            customText={customCategory}
                            onChange={setSelectedCategories}
                            onCustomChange={setCustomCategory}
                        />

                        <WaktuInput date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

                        {/* Keterangan */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">
                                Keterangan tambahan
                                <span className="text-[11px] font-normal text-muted-foreground ml-1.5">(opsional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Misal: ada 2 kamar, lantai keramik, ada hewan peliharaan..."
                                rows={3}
                                className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Budget kamu</label>
                            <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <span className="text-xs font-bold text-muted-foreground shrink-0">Rp</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={price} onChange={handlePriceInput}
                                    placeholder="50.000"
                                    className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handlePost} disabled={!canPost}
                            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Posting Permintaan
                        </Button>

                        {!canPost && (
                            <p className="text-[11px] text-center text-muted-foreground/60">
                                Pilih kategori, tanggal, dan jam terlebih dahulu
                            </p>
                        )}
                    </div>
                )}

                {step === "confirm" && (
                    <ModalKonfirmasi
                        selectedLabels={selectedLabels} date={date} time={time}
                        description={description} finalPrice={finalPrice}
                        onBack={() => setStep("input")} onConfirm={() => setStep("done")}
                    />
                )}

                {step === "done" && (
                    <ModalSelesai selectedLabels={selectedLabels} date={date} time={time} finalPrice={finalPrice} />
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-3 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">© Bounty · OpenStreetMap</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-muted-foreground/60">1 lokasi aktif</span>
                </div>
            </div>
        </>
    );
}
