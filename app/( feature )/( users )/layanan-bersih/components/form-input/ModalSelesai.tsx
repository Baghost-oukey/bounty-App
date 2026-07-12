"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDate, formatRupiah } from "./constants";

interface Props {
    selectedLabels: string[];
    date: string;
    time: string;
    finalPrice: number;
}

export default function StepDone({ selectedLabels, date, time, finalPrice }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-full px-5 py-8 text-center space-y-4">
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
                    <span className="text-muted-foreground shrink-0 mt-0.5">Yang dibersihkan</span>
                    <div className="flex flex-wrap justify-end gap-1">
                        {selectedLabels.map((l, i) => (
                            <span key={i} className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                    <span className="text-muted-foreground">Jadwal</span>
                    <span className="font-semibold text-foreground text-right">{formatDate(date)}, {time}</span>
                </div>
                {finalPrice > 0 && (
                    <div className="flex justify-between border-t border-border/30 pt-2.5">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-bold text-blue-600">{formatRupiah(finalPrice)}</span>
                    </div>
                )}
            </div>

            <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Kembali ke Dashboard
            </Link>
        </div>
    );
}
