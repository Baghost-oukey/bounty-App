"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

import KategoriInput   from "./form-input/KategoriInput";
import WaktuInput      from "./form-input/WaktuInput";
import ModalKonfirmasi from "./form-input/ModalKonfirmasi";
import ModalSelesai    from "./form-input/ModalSelesai";
import { CATEGORIES, DEFAULT_ADDRESS, DEFAULT_LAT, DEFAULT_LNG } from "./form-input/constants";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type Step = "input" | "confirm" | "done";

export default function FormInput() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory]         = useState("");
    const [description, setDescription]               = useState("");
    const [date, setDate]         = useState("");
    const [time, setTime]         = useState("");
    const [price, setPrice]       = useState("");
    const [finalPrice, setFinalPrice] = useState(0);
    const [step, setStep]         = useState<Step>("input");
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => { setMapReady(true); }, []);

    const canPost = selectedCategories.length > 0 && !!date && !!time;

    const selectedLabels = [
        ...selectedCategories
            .filter((id) => id !== "lainnya")
            .map((id) => CATEGORIES.find((c) => c.id === id)?.label ?? "")
            .filter(Boolean),
        ...(selectedCategories.includes("lainnya") && customCategory.trim()
            ? [customCategory.trim()]
            : selectedCategories.includes("lainnya") ? ["Lainnya"] : []),
    ];

    const handlePost = () => {
        if (!canPost) return;
        setFinalPrice(Number(price.replace(/\D/g, "")) || 0);
        setStep("confirm");
    };

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    return (
        <div className="relative w-full h-full bg-background">

            {/* ── MAP: desktop background / mobile top strip ── */}
            <div className="
                absolute inset-0 z-0
                lg:block
                hidden
            ">
                {mapReady && <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />}
            </div>

            {/* Mobile map strip — visible only on small screens */}
            <div className="lg:hidden absolute top-0 left-0 right-0 h-44 z-0">
                {mapReady && <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />}
            </div>

            {/* ── MINI NAV — desktop only ── */}
            <div className="hidden lg:flex absolute top-4 right-4 z-[1000] items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tenaga tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">AF</div>
                    <div>
                        <p className="text-[11px] font-semibold text-foreground leading-none">Ahmad Fauzi</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* ── CARD ──
                Mobile  : full screen, starts below map strip (mt-40)
                Desktop : floating left panel
            ── */}
            <div className="
                absolute z-[100]
                /* mobile */
                inset-x-0 bottom-0 top-36 rounded-t-3xl
                /* desktop */
                lg:top-4 lg:left-4 lg:bottom-4 lg:right-auto lg:w-[420px] lg:rounded-3xl
                flex flex-col bg-background shadow-2xl shadow-black/15 border border-border/30
                overflow-hidden
            ">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <Link href="/dashboard" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Layanan</p>
                        <h1 className="text-base font-bold text-foreground truncate">Bersih-Bersih</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Mobile: tenaga pill */}
                        <div className="lg:hidden flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-semibold text-green-600">Tersedia</span>
                        </div>
                        {/* Desktop: live badge */}
                        <div className="hidden lg:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-semibold text-green-600">Live</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain">

                    {/* ── INPUT ── */}
                    {step === "input" && (
                        <div className="px-5 py-5 space-y-5 pb-8">

                            {/* Lokasi */}
                            <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="text-xs text-blue-700 flex-1 truncate">{DEFAULT_ADDRESS}</span>
                                <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</button>
                            </div>

                            {/* Kategori */}
                            <KategoriInput
                                selected={selectedCategories}
                                customText={customCategory}
                                onChange={setSelectedCategories}
                                onCustomChange={setCustomCategory}
                            />

                            {/* Jadwal */}
                            <WaktuInput
                                date={date}
                                time={time}
                                onDateChange={setDate}
                                onTimeChange={setTime}
                            />

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
                                        type="text"
                                        inputMode="numeric"
                                        value={price}
                                        onChange={handlePriceInput}
                                        placeholder="50.000"
                                        className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* CTA */}
                            <Button
                                onClick={handlePost}
                                disabled={!canPost}
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

                    {/* ── CONFIRM ── */}
                    {step === "confirm" && (
                        <ModalKonfirmasi
                            selectedLabels={selectedLabels}
                            date={date}
                            time={time}
                            description={description}
                            finalPrice={finalPrice}
                            onBack={() => setStep("input")}
                            onConfirm={() => setStep("done")}
                        />
                    )}

                    {/* ── DONE ── */}
                    {step === "done" && (
                        <ModalSelesai
                            selectedLabels={selectedLabels}
                            date={date}
                            time={time}
                            finalPrice={finalPrice}
                        />
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
            </div>
        </div>
    );
}
