"use client";

const HISTORY = [
    { tugas:"Bersih-Bersih Rumah", waktu:"2 jam lalu",  nominal:85000,  done:true  },
    { tugas:"Antar ke Kantor",      waktu:"Kemarin",     nominal:65000,  done:true  },
    { tugas:"Jasa Titip Makanan",   waktu:"2 hari lalu", nominal:25000,  done:false },
    { tugas:"Les Matematika SMP",   waktu:"3 hari lalu", nominal:100000, done:true  },
];

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

export default function ViewHistory() {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {HISTORY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 bg-background hover:bg-blue-50/30 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{a.tugas}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{a.waktu}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-blue-600">{formatRupiah(a.nominal)}</p>
                        <span className={`text-[10px] font-semibold ${a.done ? "text-green-600" : "text-amber-600"}`}>
                            {a.done ? "✓ Selesai" : "● Proses"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
