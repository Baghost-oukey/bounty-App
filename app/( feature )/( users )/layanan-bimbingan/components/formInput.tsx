"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, ChevronRight, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

const SUBJECTS = [
    { id: "matematika", label: "Matematika", icon: "🔢" },
    { id: "fisika", label: "Fisika", icon: "⚛️" },
    { id: "kimia", label: "Kimia", icon: "🧪" },
    { id: "biologi", label: "Biologi", icon: "🧬" },
    { id: "bahasa_inggris", label: "Bahasa Inggris", icon: "🌐" },
    { id: "bahasa_indo", label: "Bahasa Indonesia", icon: "📝" },
    { id: "pemrograman", label: "Pemrograman", icon: "💻" },
    { id: "lainnya", label: "Mata pelajaran lain", icon: "📚" },
];

const LEVELS = ["SD", "SMP", "SMA", "Mahasiswa", "Umum / Profesional"];
const SESSION_OPTIONS = ["1x pertemuan", "2x per minggu", "3x per minggu", "Setiap hari"];
const MODE_OPTIONS = ["Tatap muka", "Online (video call)", "Keduanya bisa"];

function processWithAI(
    raw: string,
    subject: string,
    level: string,
    price: number
): Promise<{ cleaned: string; suggestedPrice: number; tooLow: boolean }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label ?? subject;
            const parts: string[] = [];
            if (subjectLabel) parts.push(`Bimbingan ${subjectLabel}`);
            if (level) parts.push(`untuk tingkat ${level}`);

            const keywords = [
                { pattern: /ujian|ulangan|uts|uas|try.?out/i, extra: "persiapan ujian" },
                { pattern: /pr|tugas|homework/i, extra: "bantu mengerjakan tugas" },
                { pattern: /les|privat|intensif/i, extra: "les privat intensif" },
                { pattern: /dasar|pemula|belum bisa/i, extra: "dari dasar" },
                { pattern: /nilai|remedial|perbaikan/i, extra: "perbaikan nilai" },
            ];
            keywords.forEach((k) => {
                if (k.pattern.test(raw)) parts.push(k.extra);
            });

            const cleaned = parts.length > 0 ? parts.join(", ") : raw.trim();
            const minPrice = level === "Mahasiswa" || level === "Umum / Profesional" ? 100000 : 75000;
            const tooLow = price < minPrice;
            resolve({ cleaned, suggestedPrice: tooLow ? minPrice : price, tooLow });
        }, 1200);
    });
}

type Step = "input" | "confirmed";

const DEFAULT_LAT = -6.2297;
const DEFAULT_LNG = 106.8295;
const DEFAULT_ADDRESS = "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan";

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

export default function FormInput() {
    const [rawText, setRawText] = useState("");
    const [price, setPrice] = useState("");
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [session, setSession] = useState("");
    const [mode, setMode] = useState("");
    const [step, setStep] = useState<Step>("input");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ cleaned: string; suggestedPrice: number; tooLow: boolean } | null>(null);
    const [finalPrice, setFinalPrice] = useState(0);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => { setMapReady(true); }, []);

    const handleProcess = async () => {
        if (!rawText.trim() || !price) return;
        setLoading(true);
        const res = await processWithAI(rawText, subject, level, Number(price.replace(/\D/g, "")));
        setResult(res);
        setFinalPrice(res.suggestedPrice);
        setLoading(false);
    };

    const handleConfirm = () => setStep("confirmed");

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    return (
        <div className="relative w-full h-full bg-gray-100">
            <div className="absolute inset-0 z-0">
                {mapReady && <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />}
            </div>

            {/* Mini nav */}
            <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tutor tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">AF</div>
                    <div className="hidden sm:block">
                        <p className="text-[11px] font-semibold text-foreground leading-none">Ahmad Fauzi</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* Floating card */}
            <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] flex flex-col rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 border border-border/40 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <Link href="/dashboard" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Layanan</p>
                        <h1 className="text-base font-bold text-foreground truncate leading-tight">Bimbingan Belajar</h1>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-green-600">Live</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    {step === "input" && (
                        <div className="flex flex-col flex-1">
                            <div className="px-5 py-4 space-y-4 border-b border-border/40">

                                {/* Location */}
                                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-blue-700 flex-1 truncate">{DEFAULT_ADDRESS}</span>
                                    <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</button>
                                </div>

                                {/* Subject picker */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Mata pelajaran</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SUBJECTS.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSubject(s.id)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-xs font-semibold transition-all text-left ${
                                                    subject === s.id
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                                                        : "bg-muted/50 border-border/50 text-foreground hover:border-blue-300 hover:bg-blue-50"
                                                }`}
                                            >
                                                <span className="text-base leading-none">{s.icon}</span>
                                                <span className="leading-snug">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Level + Mode */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground">Tingkat</label>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Pilih tingkat</option>
                                            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground">Mode belajar</label>
                                        <select
                                            value={mode}
                                            onChange={(e) => setMode(e.target.value)}
                                            className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Pilih mode</option>
                                            {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Session frequency */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Frekuensi sesi</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SESSION_OPTIONS.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSession(s)}
                                                className={`py-2 px-3 rounded-2xl border text-xs font-semibold transition-all text-left ${
                                                    session === s
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-muted/50 border-border/50 text-foreground hover:border-blue-300 hover:bg-blue-50"
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Keterangan tambahan</label>
                                    <textarea
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                        placeholder="Misal: perlu persiapan ujian nasional, nilai matematika jelek, mau belajar dari dasar..."
                                        rows={3}
                                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Budget + AI */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Budget per sesi</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                            <span className="text-xs font-bold text-muted-foreground shrink-0">Rp</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={price}
                                                onChange={handlePriceInput}
                                                placeholder="75.000"
                                                className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleProcess}
                                            disabled={!rawText.trim() || !price || loading}
                                            title="Proses dengan AI"
                                            className="w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors shadow-md shadow-blue-600/20"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* AI Feedback */}
                            <div className="flex-1 flex flex-col px-5 py-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-bold text-foreground">Ringkasan AI</span>
                                    <span className="text-[10px] text-muted-foreground ml-auto">Otomatis diperbarui</span>
                                </div>

                                <div className="flex-1 min-h-[100px] bg-muted/30 border border-border/40 rounded-2xl p-4">
                                    {loading ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            <p className="text-xs text-muted-foreground">AI sedang menganalisis...</p>
                                        </div>
                                    ) : result ? (
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Kebutuhan belajar</p>
                                                <p className="text-foreground font-medium leading-relaxed">{result.cleaned}</p>
                                            </div>
                                            <div className="border-t border-border/30 pt-3">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tarif wajar per sesi</p>
                                                <p className={`font-bold text-sm ${result.tooLow ? "text-amber-500" : "text-green-600"}`}>
                                                    {formatRupiah(result.suggestedPrice)}
                                                    {result.tooLow && <span className="text-[10px] font-normal text-amber-500/80 ml-1.5">(budget terlalu rendah)</span>}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-xs text-muted-foreground/60 max-w-[200px] leading-relaxed">
                                                Isi form lalu tekan <span className="font-semibold">ikon bintang</span> untuk analisis AI
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {result?.tooLow && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setFinalPrice(Number(price.replace(/\D/g, "")))} className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${finalPrice === Number(price.replace(/\D/g, "")) ? "bg-foreground text-background border-foreground" : "border-border/60 text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
                                            Tetap {formatRupiah(Number(price.replace(/\D/g, "")))}
                                        </button>
                                        <button onClick={() => setFinalPrice(result.suggestedPrice)} className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${finalPrice === result.suggestedPrice ? "bg-blue-600 text-white border-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}>
                                            Pakai {formatRupiah(result.suggestedPrice)}
                                        </button>
                                    </div>
                                )}

                                <Button onClick={handleConfirm} disabled={!result} className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed mt-auto">
                                    <ChevronRight className="w-4 h-4 mr-1" />
                                    Posting Permintaan
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "confirmed" && (
                        <div className="flex flex-col flex-1 items-center justify-center px-5 py-8 text-center space-y-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Bounty Dipasang!</h2>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[240px] mx-auto leading-relaxed">
                                    Tutor terdekat akan segera menghubungimu.
                                </p>
                            </div>
                            <div className="bg-muted/40 border border-border/40 rounded-2xl px-4 py-4 w-full space-y-2.5 text-left text-xs">
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Kebutuhan</span>
                                    <span className="font-semibold text-foreground text-right leading-snug max-w-[55%]">{result?.cleaned}</span>
                                </div>
                                {mode && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mode</span>
                                        <span className="font-semibold text-foreground">{mode}</span>
                                    </div>
                                )}
                                {session && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Frekuensi</span>
                                        <span className="font-semibold text-foreground">{session}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-border/30 pt-2.5">
                                    <span className="text-muted-foreground">Budget / sesi</span>
                                    <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>
                            <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                <div className="shrink-0 px-5 py-3 border-t border-border/30 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/60 font-medium">© Bounty · OpenStreetMap</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] text-muted-foreground/60">Tutor online</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
