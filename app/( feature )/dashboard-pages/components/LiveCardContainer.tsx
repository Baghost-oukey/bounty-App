"use client";

import { useEffect, useState } from "react";
import { Users, ListChecks, CheckCircle2, Clock } from "lucide-react";

interface LiveStatsProps {
  initialOnline?: number;
  initialWaiting?: number;
  initialCompleted?: number;
  initialInProgress?: number;
}

export default function LiveStats({
  initialOnline = 0,
  initialWaiting = 0,
  initialCompleted = 0,
  initialInProgress = 0,
}: LiveStatsProps) {
  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      label: "Pengguna Online",
      value: initialOnline.toLocaleString("id-ID"),
      sub: "Siap mengambil bounty",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: <ListChecks className="w-5 h-5 text-amber-500" />,
      label: "Permintaan Bounty",
      value: initialWaiting.toLocaleString("id-ID"),
      sub: "Menunggu pekerja",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      label: "Selesai Hari Ini",
      value: initialCompleted.toLocaleString("id-ID"),
      sub: "Berhasil diselesaikan",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      label: "Sedang Dikerjakan",
      value: initialInProgress.toLocaleString("id-ID"),
      sub: "Dalam proses pengerjaan",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="bg-background border border-border/50 rounded-3xl p-5 flex flex-col gap-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Informasi Pengguna</h3>
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
              <p className="text-xs font-semibold text-blue-600 mt-1">{s.label}</p>
              <p className="text-[9px] text-muted-foreground/60">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
