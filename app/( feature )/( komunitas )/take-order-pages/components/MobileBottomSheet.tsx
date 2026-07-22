"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronUp } from "lucide-react";
import type { SidebarView } from "./Sidebar";
import FloatingBountyCard from "./ContainerMainModal";

// Two snap points: expanded (form visible) and peek (just handle + title)
const SNAP_EXPANDED = 0.82;
const SNAP_PEEK = 0.12;

interface Props {
    view: SidebarView;
    onViewChange: (v: SidebarView) => void;
    bounties?: any[];
    onRefresh?: () => void;
}

export default function MobileBottomSheet({ view, onViewChange, bounties, onRefresh }: Props) {
    const [sheetHeight, setSheetHeight] = useState(SNAP_EXPANDED);
    const [isDragging, setIsDragging] = useState(false);
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
        const up = (e: MouseEvent) => onDragEnd(e.clientY);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    }, [isDragging, onDragMove, onDragEnd]);

    // Collapse on map tap
    useEffect(() => {
        const handler = () => { if (!isPeek) setSheetHeight(SNAP_PEEK); };
        window.addEventListener("map:collapse-sheet", handler);
        return () => window.removeEventListener("map:collapse-sheet", handler);
    }, [isPeek]);

    // Expand when view changes
    useEffect(() => {
        setSheetHeight(SNAP_EXPANDED);
    }, [view]);

    const TITLE_MAP: Record<SidebarView, string> = {
        bounty: "Ambil Bounty",
        aktif: "Bounty Aktif",
        stats: "Statistik Saya",
        history: "Riwayat Tugas",
        chat: "Pesan",
    };

    return (
        <div
            className="absolute left-0 right-0 z-[500] flex flex-col rounded-t-3xl bg-background shadow-2xl border-t border-x border-border/20 overflow-hidden"
            style={{
                bottom: 56, // sits above bottom nav bar (h-14 = 56px)
                height: `${sheetHeight * 100}vh`,
                transition: isDragging ? "none" : "height 0.35s cubic-bezier(0.32,0.72,0,1)",
            }}
        >
            {/* ── Drag handle ── */}
            <div
                className="shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
                onMouseDown={(e) => onDragStart(e.clientY)}
                onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
                onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
                onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
                onClick={() => { if (isPeek) setSheetHeight(SNAP_EXPANDED); }}
            >
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-border/70" />
                </div>

                {/* Peek header */}
                <div
                    style={{
                        opacity: isPeek ? 1 : 0,
                        pointerEvents: isPeek ? "auto" : "none",
                        transition: "opacity 0.2s",
                        position: isPeek ? "relative" : "absolute",
                        width: "100%",
                    }}
                    className="px-5 pb-3 flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs text-muted-foreground">Pekerja · Online</p>
                        <h2 className="text-sm font-bold text-foreground">{TITLE_MAP[view]}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Buka</span>
                    </div>
                </div>
            </div>

            {/* ── Full content ── */}
            <div
                className="flex-1 overflow-hidden flex flex-col"
                style={{
                    opacity: isPeek ? 0 : 1,
                    transition: "opacity 0.15s",
                    pointerEvents: isPeek ? "none" : "auto",
                }}
            >
                <FloatingBountyCard view={view} onViewChange={onViewChange} bounties={bounties} onRefresh={onRefresh} />
            </div>
        </div>
    );
}
