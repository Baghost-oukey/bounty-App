"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { DEFAULT_ADDRESS, formatDate, formatRupiah } from "./constants";

interface Props {
    selectedLabels: string[];
    date: string;
    time: string;
    description: string;
    finalPrice: number;
    onBack: () => void;
    onConfirm: () => void;
}

export default function StepConfirm({
    selectedLabels, date, time, description, finalPrice, onBack, onConfirm,
}: Props) {
    return (
        <div className="px-5 py-5 space-y-4">
            <div>
                <h2 className="text-sm font-bold text-foreground mb-0.5">Konfirmasi Bounty</h2>
                <p className="text-[11px] text-muted-foreground">Pastikan detailnya sudah benar sebelum diposting.</p>
            </div>

            <div className="bg-muted/30 border border-border/40 rounded-2xl divide-y divide-border/30 text-xs">
                <Row label="Layanan" value="Bersih-Bersih" />

                <div className="px-4 py-3 flex items-start justify-between gap-3">
                    <span className="text-muted-foreground shrink-0 mt-0.5">Yang dibersihkan</span>
                    <div className="flex flex-wrap justify-end gap-1">
                        {selectedLabels.map((l, i) => (
                            <span key={i} className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                {l}
                            </span>
                        ))}
                    </div>
                </div>

                <Row label="Jadwal" value={`${formatDate(date)}, ${time}`} />
                <Row label="Lokasi" value={DEFAULT_ADDRESS} />
                {description && <Row label="Keterangan" value={description} />}
                {finalPrice > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-bold text-blue-600 text-sm">{formatRupiah(finalPrice)}</span>
                    </div>
                )}
            </div>

            <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-2">
                Bounty ini akan terlihat oleh tenaga kebersihan terdekat dan bisa langsung mereka ambil.
            </p>

            <div className="flex gap-2">
                <Button variant="outline" onClick={onBack} className="flex-1 h-10 rounded-2xl text-xs font-semibold">
                    Ubah
                </Button>
                <Button onClick={onConfirm} className="flex-1 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20">
                    Ya, Pasang Bounty
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-3 flex items-start justify-between gap-3">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-semibold text-foreground text-right max-w-[55%] leading-snug">{value}</span>
        </div>
    );
}
