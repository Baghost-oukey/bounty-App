"use client";

import { ListChecks, BarChart2, Clock, MessageCircle, Zap } from "lucide-react";
import type { SidebarView } from "../Sidebar";

const TABS: { view: SidebarView; icon: React.ElementType; label: string }[] = [
    { view: "bounty",  icon: ListChecks,    label: "Bounty"  },
    { view: "aktif",   icon: Zap,           label: "Aktif"   },
    { view: "stats",   icon: BarChart2,     label: "Statistik"},
    { view: "history", icon: Clock,         label: "Riwayat" },
    { view: "chat",    icon: MessageCircle, label: "Chat"    },
];

interface Props {
    active: SidebarView;
    onChange: (v: SidebarView) => void;
}

export default function MobileNavBar({ active, onChange }: Props) {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-[700] h-14 bg-background/95 backdrop-blur-sm border-t border-border/40 flex items-center">
            {TABS.map(({ view, icon: Icon, label }) => {
                const isActive = active === view;
                return (
                    <button
                        key={view}
                        onClick={() => onChange(view)}
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-all"
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isActive ? "bg-blue-600 shadow-md shadow-blue-600/30" : ""
                        }`}>
                            <Icon
                                className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-muted-foreground"}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </div>
                        <span className={`text-[9px] font-semibold transition-colors ${isActive ? "text-blue-600" : "text-muted-foreground"}`}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
