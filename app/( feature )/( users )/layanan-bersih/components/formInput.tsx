"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Edit3, Send } from "lucide-react";
import Link from "next/link";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

// ─── Types ───────────────────────────────────────────────

interface AnalyzeResult {
    tasks: string[];
    suggestedPrice: number;
    tooLow: boolean;
    summary: string;
}

// ─── API call ────────────────────────────────────────────

async function analyzeWithGemini(rawText: string, budget: number): Promise<AnalyzeResult> {
    const res = await fetch("/api/layananbersih/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, budget }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? err.error ?? "Gagal menghubungi AI");
    }
    return res.json();
}

// ─── Helpers ─────────────────────────────────────────────

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

type Step = "input" | "confirm" | "done";

const DEFAULT_LAT = -6.2297;
const DEFAULT_LNG = 106.8295;
const DEFAULT_ADDRESS = "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan";

// ─── Component ───────────────────────────────────────────

export default function FormInput() {
    const [rawText, setRawText] = useState("");
    const [price, setPrice] = useState("");
    const [aiResult, setAiResult] = useState<AnalyzeResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState<string | null>(null);
    const [finalPrice, setFinalPrice] = useState(0);
    const [step, setStep] = useState<Step>("input");
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => { setMapReady(true); }, []);

    const budgetNumber = Number(price.replace(/\D/g, "")) || 0;

    // Daftar tugas final: dari AI atau raw text
    const displayTasks = aiResult?.tasks.length
        ? aiResult.tasks
        : rawText.trim()
            ? [rawText.trim()]
            : [];

    // ── Analisis AI ──
    const handleAnalyze = async () => {
        if (!rawText.trim()) return;
        setAnalyzing(true);
        setAnalyzeError(null);
        try {
            const result = await analyzeWithGemini(rawText, budgetNumber);
            setAiResult(result);
            // Auto-fill harga jika belum diisi atau terlalu rendah
            if (!price || result.tooLow) {
                setPrice(result.suggestedPrice.toLocaleString("id-ID"));
            }
        } catch (err) {
            setAnalyzeError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setAnalyzing(false);
        }
    };

    // ── Posting langsung / ke confirm ──
    const handlePost = () => {
        if (!rawText.trim()) return;
        const numPrice = budgetNumber || aiResult?.suggestedPrice || 30000;
        setFinalPrice(numPrice);
        setStep("confirm");
    };

    const handleConfirm = () => setStep("done");

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRawText(e.target.value);
        // Reset AI ketika teks berubah
        setAiResult(null);
        setAnalyzeError(null);
    };

    return (
        <div className="relative w-full h-full bg-gray-100">

            {/* MAP */}
            <div className="absolute inset-0 z-0">
                {mapReady && <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />}
            </div>

            {/* MINI NAV */}
            <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tenaga tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">AF</div>
                    <div className="hidden sm:block">
                        <p className="text-[11px] font-semibold text-foreground leading-none">Ahmad Fauzi</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* FLOATING CARD */}
            <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] flex flex-col rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 border border-border/40 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <Link href="/dashboard" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Layanan</p>
                        <h1 className="text-base font-bold text-foreground truncate leading-tight">Bersih-Bersih</h1>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-green-600">Live</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto flex flex-col">

                    {/* ── STEP: INPUT ── */}
                    {step === "input" && (
                        <div className="flex flex-col flex-1">

                            {/* Form */}
                            <div className="px-5 py-4 space-y-4 border-b border-border/40">

                                {/* Location */}
                                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-blue-700 flex-1 truncate">{DEFAULT_ADDRESS}</span>
                                    <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</button>
                                </div>

                                {/* Textarea */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-foreground">Ceritakan masalahmu</label>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={!rawText.trim() || analyzing}
                                            title="Analisis dengan AI"
                                            className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {analyzing
                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                : <Sparkles className="w-3.5 h-3.5" />
                                            }
                                            {analyzing ? "Menganalisis..." : "Analisis AI"}
                                        </button>
                                    </div>
                                    <textarea
                                        value={rawText}
                                        onChange={handleTextChange}
                                        placeholder="Ceritakan bebas... misal: aku males banget bersih-bersih, rumah berantakan abis saudara dateng, dapur kotor, kandang kucing bau"
                                        rows={5}
                                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                                    />
                                    {analyzeError && (
                                        <p className="text-[11px] text-red-500 font-medium">{analyzeError}</p>
                                    )}
                                </div>

                                {/* Budget */}
                                <div className="space-y-1.5">
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
                            </div>

                            {/* AI Feedback panel */}
                            <div className="flex-1 flex flex-col px-5 py-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-bold text-foreground">Ringkasan tugas</span>
                                    {aiResult && (
                                        <span className="ml-auto text-[10px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                            Gemini AI ✓
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-h-[120px] bg-muted/30 border border-border/40 rounded-2xl p-4">
                                    {analyzing ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            <p className="text-xs text-muted-foreground">Gemini sedang membaca permintaanmu...</p>
                                        </div>
                                    ) : aiResult ? (
                                        <div className="space-y-3">
                                            {/* Summary */}
                                            <p className="text-xs text-muted-foreground leading-relaxed italic">{aiResult.summary}</p>
                                            {/* Task list */}
                                            <ul className="space-y-1.5">
                                                {aiResult.tasks.map((task, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                                        <span className="font-medium">{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* Price suggestion */}
                                            <div className="border-t border-border/30 pt-3 flex items-center justify-between">
                                                <span className="text-[10px] text-muted-foreground">Harga wajar</span>
                                                <span className={`text-sm font-bold ${aiResult.tooLow ? "text-amber-500" : "text-green-600"}`}>
                                                    {formatRupiah(aiResult.suggestedPrice)}
                                                    {aiResult.tooLow && <span className="text-[10px] font-normal text-amber-500/80 ml-1">(budget rendah)</span>}
                                                </span>
                                            </div>
                                        </div>
                                    ) : rawText.trim() ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Edit3 className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                <p className="text-[10px] text-muted-foreground">Preview permintaan</p>
                                            </div>
                                            <p className="text-xs text-foreground/80 leading-relaxed">{rawText}</p>
                                            <p className="text-[10px] text-muted-foreground/60 pt-1">
                                                Tekan <span className="font-semibold text-blue-600">Analisis AI</span> untuk mengubah jadi daftar tugas yang lebih jelas.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-xs text-muted-foreground/60 max-w-[200px] leading-relaxed">
                                                Ceritakan masalahmu di atas, lalu kamu bisa langsung posting atau gunakan AI dulu.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handlePost}
                                    disabled={!rawText.trim()}
                                    className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Posting Permintaan
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP: CONFIRM ── */}
                    {step === "confirm" && (
                        <div className="flex flex-col flex-1 px-5 py-5 space-y-4">
                            <div>
                                <h2 className="text-sm font-bold text-foreground mb-0.5">Konfirmasi Bounty</h2>
                                <p className="text-[11px] text-muted-foreground">Pastikan detailnya sudah benar sebelum diposting.</p>
                            </div>

                            <div className="bg-muted/30 border border-border/40 rounded-2xl divide-y divide-border/30 text-xs">
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <span className="text-muted-foreground shrink-0">Layanan</span>
                                    <span className="font-semibold text-foreground">Bersih-Bersih</span>
                                </div>
                                <div className="px-4 py-3 flex items-start justify-between gap-3">
                                    <span className="text-muted-foreground shrink-0 mt-0.5">Tugas</span>
                                    <div className="text-right space-y-1">
                                        {displayTasks.map((t, i) => (
                                            <p key={i} className="font-semibold text-foreground leading-snug">{t}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-4 py-3 flex items-start justify-between gap-3">
                                    <span className="text-muted-foreground shrink-0">Lokasi</span>
                                    <span className="font-semibold text-foreground text-right max-w-[55%] leading-snug">{DEFAULT_ADDRESS}</span>
                                </div>
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <span className="text-muted-foreground">Budget</span>
                                    <span className="font-bold text-blue-600 text-sm">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-2">
                                Bounty ini akan terlihat oleh tenaga kebersihan terdekat dan bisa langsung mereka ambil.
                            </p>

                            <div className="flex gap-2 mt-auto">
                                <Button variant="outline" onClick={() => setStep("input")} className="flex-1 h-10 rounded-2xl text-xs font-semibold">
                                    Ubah
                                </Button>
                                <Button onClick={handleConfirm} className="flex-1 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20">
                                    Ya, Pasang Bounty
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP: DONE ── */}
                    {step === "done" && (
                        <div className="flex flex-col flex-1 items-center justify-center px-5 py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Bounty Dipasang!</h2>
                                <p className="text-xs text-muted-foreground mt-1.5 max-w-[240px] mx-auto leading-relaxed">
                                    Permintaanmu sudah aktif. Tenaga kebersihan terdekat akan segera mengambilnya.
                                </p>
                            </div>
                            <div className="bg-muted/40 border border-border/40 rounded-2xl px-4 py-4 w-full space-y-2.5 text-left text-xs">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="text-muted-foreground shrink-0 mt-0.5">Tugas</span>
                                    <div className="text-right space-y-1">
                                        {displayTasks.map((t, i) => (
                                            <p key={i} className="font-semibold text-foreground leading-snug">{t}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between border-t border-border/30 pt-2.5">
                                    <span className="text-muted-foreground">Budget</span>
                                    <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>
                            <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 px-5 py-3 border-t border-border/30 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/60 font-medium">© Bounty · OpenStreetMap</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] text-muted-foreground/60">1 lokasi aktif</span>
                    </div>
                </div>
            </div>
        </div>
    );
}