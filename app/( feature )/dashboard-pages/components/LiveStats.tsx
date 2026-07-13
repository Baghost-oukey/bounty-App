"use client";

import { useEffect, useState } from "react";
import { Users, ListChecks, CheckCircle2, Clock } from "lucide-react";

export default function LiveStats() {
    const [online,   setOnline]   = useState(142);
    const [bounty,   setBounty]   = useState(37);
    const [selesai,  setSelesai]  = useState(218);
    const [berjalan, setBerjalan] = useState(14);

    useEffect(() => {
        const t = setInterval(() => {
            setOnline((v)   => Math.max(100, v + Math.floor(Math.random() * 3) - 1));
            setBounty((v)   => Math.max(30,  v + Math.floor(Math.random() * 3) - 1));
            setSelesai((v)  => v + (Math.random() > 0.7 ? 1 : 0));
            setBerjalan((v) => Math.max(5,   v + Math.floor(Math.random() * 3) - 1));
        }, 4000);
        return () => clearInterval(t);
    }, []);

    const stats = [
        {
            icon: <Users className="w-5 h-5 text-blue-500" />,
            label: "Pekerja online",
            value: online.toLocaleString("id-ID"),
            sub: "Siap mengambil bounty",
            bg: "bg-blue-50 dark:bg-blue-950/20",
        },
        {
            icon: <ListChecks className="w-5 h-5 text-amber-500" />,
            label: "Bounty aktif",
            value: bounty.toLocaleString("id-ID"),
            sub: "Menunggu pekerja",
            bg: "bg-amber-50 dark:bg-amber-950/20",
        },
        {
            icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
            label: "Tugas selesai hari ini",
            value: selesai.toLocaleString("id-ID"),
            sub: "Berhasil diselesaikan",
            bg: "bg-green-50 dark:bg-green-950/20",
        },
        {
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            label: "Sedang dikerjakan",
            value: berjalan.toLocaleString("id-ID"),
            sub: "Dalam proses pengerjaan",
            bg: "bg-orange-50 dark:bg-orange-950/20",
        },
    ];

    return (
        <div className="bg-background border border-border/50 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Statistik Live</h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-green-600">Langsung</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-3.5 flex flex-col gap-2`}>
                        <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-background/60 rounded-xl flex items-center justify-center">
                                {s.icon}
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-foreground leading-none">{s.value}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
                            <p className="text-[9px] text-muted-foreground/60">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
