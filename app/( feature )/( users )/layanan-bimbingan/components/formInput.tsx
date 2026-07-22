"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBountyTask, getActiveBountyTasks } from "@/app/actions/bounty";
import { getProfileStatus } from "@/app/actions/profile";

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
    const [posting, setPosting] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    // Dynamic state populated from local storage & database
    const [address, setAddress]   = useState(DEFAULT_ADDRESS);
    const [lat, setLat]           = useState(Number(DEFAULT_LAT));
    const [lng, setLng]           = useState(Number(DEFAULT_LNG));
    const [userName, setUserName] = useState("Pengguna");
    const [activeBounties, setActiveBounties] = useState<any[]>([]);

    const fetchActiveBounties = () => {
        getActiveBountyTasks().then((res) => {
            if (res.success && res.tasks) {
                // Do NOT filter - show all active bounties to make map look busy and active!
                setActiveBounties(res.tasks);
            }
        }).catch((err) => {
            console.error("Error fetching active bounties:", err);
        });
    };

    useEffect(() => {
        setMapReady(true);
        fetchActiveBounties();

        const storedAddr = localStorage.getItem("bounty_pickup_address");
        const storedLat = localStorage.getItem("bounty_pickup_lat");
        const storedLng = localStorage.getItem("bounty_pickup_lng");
        if (storedAddr) setAddress(storedAddr);
        if (storedLat) setLat(Number(storedLat));
        if (storedLng) setLng(Number(storedLng));

        getProfileStatus().then((status) => {
            if (status.authenticated && status.dbUser) {
                const name = status.dbUser.profil?.namaLengkap || status.dbUser.username || "Pengguna";
                setUserName(name);
            }
        }).catch((err) => {
            console.error("Error profile status:", err);
        });
    }, []);

    const canPost = subject !== "" && level !== "" && session !== "" && mode !== "" && rawText.trim() !== "" && price !== "";
    const finalPrice = Number(price.replace(/\D/g, "")) || 0;

    const handleConfirmPost = async () => {
        if (!canPost || posting) return;
        setPosting(true);
        try {
            const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label || "Bimbingan Belajar";
            const res = await createBountyTask({
                serviceName: "Layanan Bimbingan Belajar",
                categories: [`${subjectLabel} (${level})`],
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                description: rawText + (session ? ` | Frekuensi Sesi: ${session}` : "") + (mode ? ` | Metode: ${mode}` : ""),
                price: finalPrice,
                address,
                lat,
                lng,
            });

            if (res.success) {
                fetchActiveBounties();
                setStep("confirmed");
            } else {
                alert(res.error || "Gagal memposting bounty. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Error posting bounty:", err);
            alert("Terjadi kesalahan server.");
        } finally {
            setPosting(false);
        }
    };

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="relative w-full h-full bg-gray-100">
            <div className="absolute inset-0 z-0">
                {mapReady && (
                    <MapView 
                        lat={lat} 
                        lng={lng} 
                        address={address} 
                        activeBounties={activeBounties} 
                    />
                )}
            </div>

            {/* Mini nav */}
            <div className="absolute top-4 right-4 z-[1000] flex items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tutor tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {userInitials || "U"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[11px] font-semibold text-foreground leading-none">{userName}</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* Floating card */}
            <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] flex flex-col rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 border border-border/40 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40 shrink-0">
                    <Link href="/order-pages" className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
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
                <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                    {step === "input" && (
                        <div className="flex flex-col flex-1 px-5 py-5 space-y-4 justify-between">
                            <div className="space-y-4">
                                {/* Location address */}
                                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="text-xs text-blue-700 flex-1 truncate">{address}</span>
                                    <Link href="/order-pages" className="text-[10px] font-bold text-blue-500 hover:text-blue-600 shrink-0">Ubah</Link>
                                </div>

                                {/* Subject selection */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Mata Pelajaran</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SUBJECTS.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setSubject(s.id)}
                                                className={`flex items-center gap-2 p-2.5 border rounded-2xl text-xs font-semibold transition-all ${subject === s.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-border/50 text-muted-foreground hover:bg-muted/50"}`}
                                            >
                                                <span>{s.icon}</span>
                                                <span className="truncate">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Academic Level & Session Frequency */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground">Tingkatan Sekolah</label>
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">Pilih tingkat...</option>
                                            {LEVELS.map((l) => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground">Frekuensi Sesi</label>
                                        <select
                                            value={session}
                                            onChange={(e) => setSession(e.target.value)}
                                            className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            <option value="">Pilih jadwal...</option>
                                            {SESSION_OPTIONS.map((so) => (
                                                <option key={so} value={so}>{so}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Mode */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Metode Pembelajaran</label>
                                    <select
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value)}
                                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-3 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Pilih metode...</option>
                                        {MODE_OPTIONS.map((mo) => (
                                            <option key={mo} value={mo}>{mo}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Details description */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Detail Bimbingan</label>
                                    <textarea
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                        placeholder="Kebutuhan khusus siswa... misal: persiapan UTS, butuh diajarkan rumus kalkulus dasar"
                                        rows={3}
                                        className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Budget per session */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Budget per sesi (Rp)</label>
                                    <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
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
                                </div>
                            </div>

                            <Button
                                onClick={handleConfirmPost}
                                disabled={!canPost || posting}
                                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed mt-6"
                            >
                                {posting ? (
                                    <span className="flex items-center gap-1.5 justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Memproses Posting...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1">
                                        Posting Permintaan <ChevronRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
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
                                    Tutor terdekat akan segera mengambil orderanmu.
                                </p>
                            </div>
                            <div className="bg-muted/40 border border-border/40 rounded-2xl px-4 py-4 w-full space-y-2.5 text-left text-xs">
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Bimbingan</span>
                                    <span className="font-semibold text-foreground text-right leading-snug max-w-[55%] truncate">{rawText}</span>
                                </div>
                                {session && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Jadwal</span>
                                        <span className="font-semibold text-foreground text-right">{session}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-border/30 pt-2.5">
                                    <span className="text-muted-foreground">Budget / sesi</span>
                                    <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                                </div>
                            </div>
                            <Link href="/dashboard-pages" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </div>

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
