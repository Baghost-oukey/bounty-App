"use client";

import { Calendar, Clock } from "lucide-react";

interface Props {
    date: string;
    time: string;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

export default function WaktuInput({ date, time, onDateChange, onTimeChange }: Props) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-4">
            {/* Tanggal */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Tanggal
                </label>
                <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Jam mulai — native time picker, support 24 jam */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    Jam mulai
                </label>
                <div className="flex items-center gap-3 bg-muted/50 border border-border/50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => onTimeChange(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-sm text-foreground focus:outline-none"
                    />
                    {time && (
                        <span className="text-[11px] font-semibold text-blue-600 shrink-0">
                            {(() => {
                                const [h] = time.split(":").map(Number);
                                if (h >= 5  && h < 12) return "Pagi";
                                if (h >= 12 && h < 15) return "Siang";
                                if (h >= 15 && h < 18) return "Sore";
                                return "Malam";
                            })()}
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-muted-foreground/60">
                    Tersedia 24 jam — pilih jam sesuai kebutuhanmu
                </p>
            </div>
        </div>
    );
}
