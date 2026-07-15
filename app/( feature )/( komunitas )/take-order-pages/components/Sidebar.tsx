"use client";

import Link from "next/link";
import { ListChecks, Clock, BarChart2, Settings, MessageCircle, Zap } from "lucide-react";
import { Logo } from "@/components/logo";

export type SidebarView = "bounty" | "aktif" | "stats" | "history" | "chat";

interface Props {
    active: SidebarView;
    onChange: (view: SidebarView) => void;
}

const NAV: { icon: React.ElementType; view: SidebarView; label: string }[] = [
    { icon: ListChecks,    view: "bounty",  label: "Ambil Bounty" },
    { icon: Zap,           view: "aktif",   label: "Aktif"        },
    { icon: BarChart2,     view: "stats",   label: "Statistik"    },
    { icon: Clock,         view: "history", label: "Riwayat"      },
    { icon: MessageCircle, view: "chat",    label: "Chat"         },
];

export default function IconSidebar({ active, onChange }: Props) {
    return (
        <aside className="w-14 shrink-0 flex flex-col items-center gap-2 bg-background border-r border-border/50 py-4 z-20">
            <Link href="/" className="w-9 h-9 flex items-center justify-center mb-3">
                <Logo className="w-7 h-7 text-blue-600" />
            </Link>

            <nav className="flex flex-col items-center gap-1 flex-1">
                {NAV.map(({ icon: Icon, view, label }) => (
                    <button
                        key={view}
                        title={label}
                        onClick={() => onChange(view)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            active === view
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={active === view ? 2.5 : 2} />
                    </button>
                ))}
            </nav>

            <Link
                href="#"
                title="Pengaturan"
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
                <Settings className="w-[18px] h-[18px]" strokeWidth={2} />
            </Link>
        </aside>
    );
}
