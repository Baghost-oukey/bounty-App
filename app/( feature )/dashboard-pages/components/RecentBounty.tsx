import { CheckCircle2, Clock, XCircle } from "lucide-react";

const RECENT = [
    {
        id: "TGS-001",
        judul: "Bersih-Bersih Rumah",
        layanan: "Kebersihan",
        status: "SELESAI",
        nominal: 85000,
        waktu: "2 jam lalu",
    },
    {
        id: "TGS-002",
        judul: "Antar Dokumen ke Kantor",
        layanan: "Antar Jemput",
        status: "BERJALAN",
        nominal: 45000,
        waktu: "5 jam lalu",
    },
    {
        id: "TGS-003",
        judul: "Desain Logo Kafe",
        layanan: "Bantuan Digital",
        status: "TERBUKA",
        nominal: 150000,
        waktu: "1 hari lalu",
    },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    SELESAI:  { label: "Selesai",  color: "text-green-600 bg-green-50 border-green-200",  icon: <CheckCircle2 className="w-3 h-3" /> },
    BERJALAN: { label: "Berjalan", color: "text-blue-600 bg-blue-50 border-blue-200",     icon: <Clock className="w-3 h-3" /> },
    TERBUKA:  { label: "Terbuka",  color: "text-amber-600 bg-amber-50 border-amber-200",  icon: <Clock className="w-3 h-3" /> },
    DIBATALKAN:{ label: "Batal",   color: "text-red-600 bg-red-50 border-red-200",         icon: <XCircle className="w-3 h-3" /> },
};

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

export default function RecentBounty() {
    return (
        <div className="bg-background border border-border/50 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Bounty Terbaru</h3>
                <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Lihat semua
                </button>
            </div>

            <div className="flex flex-col divide-y divide-border/40">
                {RECENT.map((b) => {
                    const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG["TERBUKA"];
                    return (
                        <div key={b.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center shrink-0 text-base">
                                {b.layanan === "Kebersihan" ? "🧹" : b.layanan === "Antar Jemput" ? "🚗" : "💻"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{b.judul}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{b.waktu}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className={`flex items-center gap-1 text-[10px] font-semibold border px-2 py-0.5 rounded-full ${cfg.color}`}>
                                    {cfg.icon}{cfg.label}
                                </span>
                                <span className="text-xs font-bold text-foreground">{formatRupiah(b.nominal)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
