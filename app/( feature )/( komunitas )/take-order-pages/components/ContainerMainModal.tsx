"use client";

import type { SidebarView } from "./Sidebar";
import ViewBounty  from "./modal-menu/DaftarBountyTersedia";
import ViewAktif   from "./ViewAktif";
import ViewStats   from "./modal-menu/StatustikMenu";
import ViewHistory from "./modal-menu/HistoryMenu";
import ViewChat    from "./modal-menu/ChatMenu";

// ── Title map ─────────────────────────────────────────────

const TITLE_MAP: Record<SidebarView, string> = {
    bounty:  "Ambil Bounty",
    aktif:   "Bounty Aktif",
    stats:   "Statistik Saya",
    history: "Riwayat Tugas",
    chat:    "Pesan",
};

const BADGE: Partial<Record<SidebarView, { value: string; color: string }>> = {
    bounty: { value: "5", color: "bg-blue-600"  },
    aktif:  { value: "2", color: "bg-green-500" },
    chat:   { value: "1", color: "bg-blue-600"  },
};

// ── Component ─────────────────────────────────────────────

export default function FloatingBountyCard({ view, onViewChange }: { view: SidebarView; onViewChange: (v: SidebarView) => void }) {
    const badge = BADGE[view];

    return (
        <div className="absolute top-4 left-4 bottom-4 z-1000 w-[360px] flex flex-col rounded-3xl bg-background/96 backdrop-blur-xl shadow-2xl shadow-black/15 border border-border/30 overflow-hidden">

            {/* ── Header ── */}
            <div className="px-5 pt-5 pb-4 border-b border-border/40 shrink-0 bg-background">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-600/30">
                            AF
                        </div>
                        <div>
                            <p className="text-xs font-bold text-foreground leading-none">Ahmad Fauzi</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-[10px] text-green-600 font-semibold">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{TITLE_MAP[view]}</span>
                        {badge && (
                            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${badge.color}`}>
                                {badge.value}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── View router ── */}
            {view === "bounty"  && <ViewBounty  onAmbil={() => onViewChange("chat")} />}
            {view === "aktif"   && <ViewAktif   />}
            {view === "stats"   && <ViewStats   />}
            {view === "history" && <ViewHistory />}
            {view === "chat"    && <ViewChat    />}

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-2.5 border-t border-border/30 flex items-center justify-between bg-background">
                <span className="text-[10px] text-muted-foreground/50">© Bounty</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground/50">Live</span>
                </div>
            </div>
        </div>
    );
}
