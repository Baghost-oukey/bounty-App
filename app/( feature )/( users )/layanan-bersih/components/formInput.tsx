"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    MapPin,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowLeft,
    X,
} from "lucide-react";
import Link from "next/link";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

// --- Simulated AI ---
function processWithAI(
    raw: string,
    price: number
): Promise<{ cleaned: string; suggestedPrice: number; tooLow: boolean }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const keywords = [
                { pattern: /sapu|menyapu|lantai/i, task: "Menyapu lantai" },
                { pattern: /pel|mengepel/i, task: "Mengepel lantai" },
                { pattern: /cuci|mencuci/i, task: "Mencuci pakaian / piring" },
                { pattern: /kamar mandi|wc|toilet/i, task: "Membersihkan kamar mandi & toilet" },
                { pattern: /kandang|kucing|hewan/i, task: "Membersihkan kandang hewan" },
                { pattern: /dapur|kompor/i, task: "Membersihkan dapur" },
                { pattern: /debu|berdebu|lap/i, task: "Mengelap debu furnitur" },
                { pattern: /sampah|buang/i, task: "Membuang sampah" },
                { pattern: /jendela|kaca/i, task: "Membersihkan kaca & jendela" },
            ];
            const found = keywords.filter((k) => k.pattern.test(raw)).map((k) => k.task);
            const cleaned = found.length > 0 ? found.join(", ") : raw.trim();
            const minPrice = Math.max(found.length * 15000, 30000);
            const tooLow = price < minPrice;
            resolve({ cleaned, suggestedPrice: tooLow ? minPrice : price, tooLow });
        }, 1200);
    });
}

type Step = "input" | "review" | "confirmed";

const DEFAULT_LAT = -6.2297;
const DEFAULT_LNG = 106.8295;
const DEFAULT_ADDRESS = "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan";

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(val);

export default function FormInput() {
    const [rawText, setRawText] = useState("");
    const [price, setPrice] = useState("");
    const [step, setStep] = useState<Step>("input");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        cleaned: string;
        suggestedPrice: number;
        tooLow: boolean;
    } | null>(null);
    const [finalPrice, setFinalPrice] = useState(0);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => { setMapReady(true); }, []);

    const handleProcess = async () => {
        if (!rawText.trim() || !price) return;
        setLoading(true);
        const res = await processWithAI(rawText, Number(price.replace(/\D/g, "")));
        setResult(res);
        setFinalPrice(res.suggestedPrice);
        setLoading(false);
        setStep("review");
    };

    const handleConfirm = () => setStep("confirmed");

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    return (
        /* Full-screen container — map as background */
        <div className="relative w-full h-full bg-gray-100">

            {/* ── MAP — fills entire screen ── */}
            <div className="absolute inset-0 z-0">
                {mapReady && (
                    <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />
                )}
            </div>

            {/* ── MINI NAV — floating top right ── */}
            <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tenaga tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        AF
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[11px] font-semibold text-foreground leading-none">Ahmad Fauzi</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* ── FLOATING CARD ── */}
            <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] flex flex-col rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 border border-border/40 overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <Link href="/dashboard" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Layanan</p>
                        <h1 className="text-base font-bold text-foreground truncate leading-tight">Bersih-Bersih</h1>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-full px-2.5 py-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">Live</span>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto flex flex-col">

                    {/* STEP: INPUT */}
                    {step === "input" && (
                        <div className="flex flex-col flex-1">

                            {/* ── TOP: Form inputs ── */}
                            <div className="px-5 py-4 space-y-4 border-b border-border/40">

                                {/* Location row */}
                                <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl px-4 py-3">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-blue-700 dark:text-blue-300 flex-1 truncate leading-snug">
                                        {DEFAULT_ADDRESS}
                                    </span>
                                    <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</button>
                                </div>

                                {/* Textarea */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Apa yang perlu dikerjakan?</label>
                                    <textarea
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                        placeholder="Ceritakan bebas... misal: males nyapu, kandang kucing kotor, dapur berantakan"
                                        rows={4}
                                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Budget + AI icon button */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Budget kamu</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
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
                                        {/* AI process — icon only */}
                                        <button
                                            onClick={handleProcess}
                                            disabled={!rawText.trim() || !price || loading}
                                            title="Proses dengan AI"
                                            className="w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors shadow-md shadow-blue-600/20"
                                        >
                                            {loading
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Sparkles className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── BOTTOM: AI Feedback panel ── */}
                            <div className="flex-1 flex flex-col px-5 py-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-bold text-foreground">Ringkasan AI</span>
                                    <span className="text-[10px] text-muted-foreground ml-auto">Otomatis diperbarui</span>
                                </div>

                                {/* AI preview box — grows to fill space */}
                                <div className="flex-1 min-h-[120px] bg-muted/30 border border-border/40 rounded-2xl p-4">
                                    {loading ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            <p className="text-xs">AI sedang menganalisis permintaanmu...</p>
                                        </div>
                                    ) : result ? (
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Tugas terdeteksi</p>
                                                <p className="text-foreground font-medium leading-relaxed">{result.cleaned}</p>
                                            </div>
                                            <div className="border-t border-border/30 pt-3">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimasi harga wajar</p>
                                                <p className={`font-bold text-sm ${result.tooLow ? "text-amber-500" : "text-green-600"}`}>
                                                    {formatRupiah(result.suggestedPrice)}
                                                    {result.tooLow && <span className="text-[10px] font-normal text-amber-500/80 ml-1.5">(budget kamu terlalu rendah)</span>}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-xs text-muted-foreground/60 max-w-[200px] leading-relaxed">
                                                Isi form di atas lalu tekan <span className="font-semibold">ikon bintang</span> untuk analisis AI
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Price confirmation if tooLow */}
                                {result?.tooLow && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setFinalPrice(Number(price.replace(/\D/g, "")))}
                                            className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                                finalPrice === Number(price.replace(/\D/g, ""))
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "border-border/60 text-muted-foreground hover:border-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Tetap {formatRupiah(Number(price.replace(/\D/g, "")))}
                                        </button>
                                        <button
                                            onClick={() => setFinalPrice(result.suggestedPrice)}
                                            className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                                finalPrice === result.suggestedPrice
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                            }`}
                                        >
                                            Pakai {formatRupiah(result.suggestedPrice)}
                                        </button>
                                    </div>
                                )}

                                {/* Primary CTA */}
                                <Button
                                    onClick={handleConfirm}
                                    disabled={!result}
                                    className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1" />
                                    Posting Permintaan
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP: REVIEW */}
                    {step === "review" && result && (
                        <>
                            {/* AI cleaned result */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-3.5 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Hasil AI</span>
                                </div>
                                <p className="text-xs font-medium text-foreground leading-relaxed">
                                    {result.cleaned}
                                </p>
                            </div>

                            {/* Price check */}
                            {result.tooLow ? (
                                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-3.5 space-y-2.5">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                                                Harga terlalu rendah
                                            </p>
                                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                                                Disarankan minimal {formatRupiah(result.suggestedPrice)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setFinalPrice(Number(price.replace(/\D/g, "")))}
                                            className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${
                                                finalPrice === Number(price.replace(/\D/g, ""))
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "border-border/60 text-muted-foreground hover:border-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Tetap {formatRupiah(Number(price.replace(/\D/g, "")))}
                                        </button>
                                        <button
                                            onClick={() => setFinalPrice(result.suggestedPrice)}
                                            className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${
                                                finalPrice === result.suggestedPrice
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                            }`}
                                        >
                                            Pakai {formatRupiah(result.suggestedPrice)}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-2xl p-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    <p className="text-[11px] text-green-700 dark:text-green-400 font-medium">
                                        Harga {formatRupiah(result.suggestedPrice)} wajar ✓
                                    </p>
                                </div>
                            )}

                            {/* Summary rows */}
                            <div className="bg-muted/40 border border-border/40 rounded-2xl divide-y divide-border/30 text-[11px]">
                                {[
                                    { label: "Layanan", value: "Bersih-Bersih" },
                                    { label: "Tugas", value: result.cleaned },
                                    { label: "Lokasi", value: "Kuningan, Jakarta Selatan" },
                                ].map((row) => (
                                    <div key={row.label} className="px-3.5 py-2.5 flex items-start justify-between gap-3">
                                        <span className="text-muted-foreground shrink-0">{row.label}</span>
                                        <span className="font-semibold text-foreground text-right leading-snug">{row.value}</span>
                                    </div>
                                ))}
                                <div className="px-3.5 py-2.5 flex items-center justify-between">
                                    <span className="text-muted-foreground">Budget</span>
                                    <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-muted-foreground px-2 leading-relaxed">
                                Akan jadi <span className="font-bold text-foreground">bounty</span> — tenaga terdekat bisa langsung ambil orderanmu.
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("input")}
                                    className="flex-1 h-9 rounded-2xl text-[11px] font-semibold"
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 h-9 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shadow-md shadow-blue-600/20"
                                >
                                    Pasang Bounty
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP: CONFIRMED */}
                    {step === "confirmed" && (
                        <div className="flex flex-col items-center py-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-foreground">Bounty Dipasang!</h2>
                                <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px] mx-auto leading-relaxed">
                                    Tenaga kebersihan terdekat akan segera mengambil orderanmu.
                                </p>
                            </div>
                            <div className="bg-muted/40 border border-border/40 rounded-2xl px-4 py-3 w-full space-y-2 text-left text-[11px]">
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Tugas</span>
                                    <span className="font-semibold text-foreground text-right leading-snug max-w-[55%]">{result?.cleaned}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Budget</span>
                                    <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                {/* Card Footer */}
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
