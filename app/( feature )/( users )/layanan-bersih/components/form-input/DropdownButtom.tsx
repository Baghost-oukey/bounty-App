"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { CardContentProps } from "./types";
import CardContent from "./KontainerCard";

const SNAP_EXPANDED = 0.88;
const SNAP_PEEK     = 0.18;

interface Props extends CardContentProps {
    selectedLabels: string[];
    selectedCategories: string[];
}

export default function BottomSheet(props: Props) {
    const { selectedLabels, selectedCategories } = props;

    const [sheetHeight, setSheetHeight] = useState(SNAP_EXPANDED);
    const [isDragging, setIsDragging]   = useState(false);
    const dragStartY = useRef(0);
    const dragStartH = useRef(SNAP_EXPANDED);

    const isPeek = sheetHeight <= SNAP_PEEK + 0.02;

    const snapTo = useCallback((h: number) => {
        setSheetHeight(h < (SNAP_EXPANDED + SNAP_PEEK) / 2 ? SNAP_PEEK : SNAP_EXPANDED);
    }, []);

    const onDragStart = (clientY: number) => {
        setIsDragging(true);
        dragStartY.current = clientY;
        dragStartH.current = sheetHeight;
    };

    const onDragMove = useCallback((clientY: number) => {
        if (!isDragging) return;
        const delta = (dragStartY.current - clientY) / window.innerHeight;
        setSheetHeight(Math.min(SNAP_EXPANDED, Math.max(SNAP_PEEK, dragStartH.current + delta)));
    }, [isDragging]);

    const onDragEnd = useCallback((clientY: number) => {
        if (!isDragging) return;
        setIsDragging(false);
        snapTo(dragStartH.current + (dragStartY.current - clientY) / window.innerHeight);
    }, [isDragging, snapTo]);

    useEffect(() => {
        if (!isDragging) return;
        const move = (e: MouseEvent) => onDragMove(e.clientY);
        const up   = (e: MouseEvent) => onDragEnd(e.clientY);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    }, [isDragging, onDragMove, onDragEnd]);

    // Expose collapse for map click — accessible via ref pattern via parent
    useEffect(() => {
        const handler = () => { if (!isPeek) setSheetHeight(SNAP_PEEK); };
        window.addEventListener("map:collapse-sheet", handler);
        return () => window.removeEventListener("map:collapse-sheet", handler);
    }, [isPeek]);

    return (
        <div
            className="lg:hidden absolute left-0 right-0 bottom-0 z-[1000] flex flex-col rounded-t-3xl bg-background shadow-2xl border-t border-x border-border/20 overflow-hidden"
            style={{
                height: `${sheetHeight * 100}vh`,
                transition: isDragging ? "none" : "height 0.35s cubic-bezier(0.32,0.72,0,1)",
            }}
        >
            {/* Drag handle + Peek header */}
            <div
                className="shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
                onMouseDown={(e) => onDragStart(e.clientY)}
                onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
                onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
                onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
                onClick={() => { if (isPeek) setSheetHeight(SNAP_EXPANDED); }}
            >
                {/* Pill */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-border/80" />
                </div>

                {/* Peek content */}
                <div
                    className="px-5 pb-4"
                    style={{
                        opacity: isPeek ? 1 : 0,
                        pointerEvents: isPeek ? "auto" : "none",
                        transition: "opacity 0.2s",
                        position: isPeek ? "relative" : "absolute",
                        width: "100%",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard"
                                className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                            </Link>
                            <div>
                                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Layanan</p>
                                <h1 className="text-lg font-bold text-foreground leading-tight">Bersih-Bersih</h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-semibold text-green-600">Tersedia</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                                <ChevronUp className="w-3 h-3" />
                                <span>Geser untuk isi form</span>
                            </div>
                        </div>
                    </div>

                    {/* Mini chips preview */}
                    {selectedCategories.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 overflow-hidden">
                            <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                            <div className="flex gap-1.5 overflow-hidden">
                                {selectedLabels.slice(0, 3).map((l, i) => (
                                    <span key={i} className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">{l}</span>
                                ))}
                                {selectedLabels.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground font-medium self-center">+{selectedLabels.length - 3} lagi</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full card content */}
            <div
                className="flex-1 overflow-hidden flex flex-col"
                style={{ opacity: isPeek ? 0 : 1, transition: "opacity 0.15s", pointerEvents: isPeek ? "none" : "auto" }}
            >
                <CardContent {...props} />
            </div>
        </div>
    );
}
