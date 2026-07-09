"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

// --- Premium 3D Isometric SVG Component Illustrations with Tech Blue Accents ---

const SlicedCube = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 35 L150 64 L150 120 L100 149 L50 120 L50 64 Z" className="text-muted-foreground/30" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M100 35 L100 149" className="text-muted-foreground/30" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M50 64 L100 93 L150 64" className="text-muted-foreground/30" strokeWidth="1" strokeDasharray="3 3" />
        {/* Sliced Vertical Blocks */}
        <path d="M70 65 L70 110" className="text-foreground" strokeWidth="4.5" />
        <path d="M85 58 L85 124" className="text-foreground" strokeWidth="4.5" />
        <path d="M100 53 L100 130" className="text-blue-600 dark:text-blue-400" strokeWidth="5" />
        <path d="M115 58 L115 124" className="text-foreground" strokeWidth="4.5" />
        <path d="M130 65 L130 110" className="text-foreground" strokeWidth="4.5" />
    </svg>
);

const NestedCube = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Wireframe */}
        <path d="M100 40 L160 75 L160 140 L100 175 L40 140 L40 75 Z" />
        <path d="M100 40 L100 175" />
        <path d="M40 75 L100 110 L160 75" />
        {/* Inner Glowing Blue Cube */}
        <path d="M100 70 L135 90 L135 125 L100 145 L65 125 L65 90 Z" className="text-blue-600 dark:text-blue-400" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M100 70 L100 145" className="text-blue-600 dark:text-blue-400" strokeWidth="2" />
        <path d="M65 90 L100 110 L135 90" className="text-blue-600 dark:text-blue-400" strokeWidth="2" />
        {/* Connecting Nodes */}
        <path d="M40 75 L65 90" className="text-muted-foreground/40" />
        <path d="M160 75 L135 90" className="text-muted-foreground/40" />
        <path d="M100 40 L100 70" className="text-muted-foreground/40" />
        <path d="M100 175 L100 145" className="text-muted-foreground/40" />
        <path d="M40 140 L65 125" className="text-muted-foreground/40" />
        <path d="M160 140 L135 125" className="text-muted-foreground/40" />
    </svg>
);

const SolidFaceCube = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 text-foreground" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Blue Glass Top Surface */}
        <polygon points="100,45 155,77 100,109 45,77" className="text-blue-500/10 fill-blue-500/20 dark:text-blue-400/10 dark:fill-blue-400/20" />
        <polygon points="100,45 155,77 100,109 45,77" className="text-blue-600 dark:text-blue-400" strokeWidth="2" />
        {/* Base Wireframe */}
        <path d="M100 45 L155 77 L155 137 L100 169 L45 137 L45 77 Z" />
        <path d="M100 45 L100 169" />
        <path d="M45 77 L100 109 L155 77" />
        {/* Accent Node */}
        <circle cx="100" cy="109" r="4.5" className="text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
    </svg>
);

const HexagonGrid = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Hex */}
        <path d="M100 35 L155 67 L155 133 L100 165 L45 133 L45 67 Z" />
        {/* Mid Hex */}
        <path d="M100 60 L137 81 L137 124 L100 145 L63 124 L63 81 Z" className="text-muted-foreground/60" />
        {/* Inner Blue Hex */}
        <path d="M100 85 L118 95 L118 115 L100 125 L82 115 L82 95 Z" className="text-blue-600 dark:text-blue-400" strokeWidth="3" />
        {/* Spokes */}
        <path d="M100 35 L100 85" className="text-muted-foreground/40" />
        <path d="M100 165 L100 125" className="text-muted-foreground/40" />
        <path d="M45 67 L82 95" className="text-muted-foreground/40" />
        <path d="M155 133 L118 115" className="text-muted-foreground/40" />
        <path d="M45 133 L82 115" className="text-muted-foreground/40" />
        <path d="M155 67 L118 95" className="text-muted-foreground/40" />
    </svg>
);

const ColumnsStack = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Center Blue Column */}
        <path d="M100 60 L125 74 L125 140 L100 154 L75 140 L75 74 Z" className="text-blue-500/5 fill-blue-500/10 dark:text-blue-400/5 dark:fill-blue-400/10" />
        <path d="M100 60 L125 74 L125 140 L100 154 L75 140 L75 74 Z" className="text-blue-600 dark:text-blue-400" strokeWidth="3" />
        <path d="M100 60 L100 154" className="text-blue-600 dark:text-blue-400" strokeWidth="3" />
        <path d="M75 74 L100 88 L125 74" className="text-blue-600 dark:text-blue-400" strokeWidth="3" />

        {/* Left Column (shorter) */}
        <path d="M60 90 L80 102 L80 145 L60 155 L40 145 L40 102 Z" />
        <path d="M60 90 L60 155" />
        <path d="M40 102 L60 114 L80 102" />

        {/* Right Column (shorter) */}
        <path d="M140 90 L160 102 L160 145 L140 155 L120 145 L120 102 Z" />
        <path d="M140 90 L140 155" />
        <path d="M120 102 L140 114 L160 102" />
    </svg>
);

const MeshCube = () => (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 40 L160 75 L160 140 L100 175 L40 140 L40 75 Z" />
        <path d="M100 40 L100 175" />
        <path d="M40 75 L100 110 L160 75" />
        {/* Blue Diagonal Mesh Lines */}
        <path d="M40 95 L100 130" className="text-blue-500/80 dark:text-blue-400/80" strokeWidth="1.5" />
        <path d="M40 115 L100 150" className="text-blue-500/80 dark:text-blue-400/80" strokeWidth="1.5" />
        <path d="M100 130 L160 95" className="text-blue-500/80 dark:text-blue-400/80" strokeWidth="1.5" />
        <path d="M100 150 L160 115" className="text-blue-500/80 dark:text-blue-400/80" strokeWidth="1.5" />
        {/* Back-slash grids */}
        <path d="M70 57.5 L70 157.5" className="text-muted-foreground/30" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M130 57.5 L130 157.5" className="text-muted-foreground/30" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
);

// --- Card Data Setup ---

interface CardItem {
    id: number;
    title: string;
    description: string;
    category: "Tenaga Kebersihan" | "Tenaga Jastip" | "Tenaga Antar Jemput" | "Tenaga Kerja" | "Tenaga Bantuan Digital" | "Tenaga Bimbingan Belajar";
    illustration: React.ReactNode;
}

const cardsData: CardItem[] = [
    {
        id: 1,
        title: "Layanan Bersih - Bersih",
        description: "Rumah bersih tanpa repot! Pesan jasa kebersihan untuk membantu menyapu, mengepel, mencuci, membersihkan kamar mandi, dapur, dan berbagai pekerjaan rumah tangga lainnya dengan mudah.",
        category: "Tenaga Kebersihan",
        illustration: <SlicedCube />,
    },
    {
        id: 2,
        title: "Layanan Jasa Titip Barang",
        description: "Butuh sesuatu tapi tidak ingin keluar rumah? Gunakan layanan jasa titip untuk membeli dan mengantarkan barang yang Anda inginkan dengan cepat dan praktis.",
        category: "Tenaga Jastip",
        illustration: <NestedCube />,
    },
    {
        id: 3,
        title: "Layanan Antar Jemput",
        description: "Layanan Antar Jemput menyediakan jasa transportasi dan pengantaran untuk membantu mobilitas Anda, mulai dari mengantar makanan, barang, hingga mengantar penumpang ke tujuan dengan aman dan nyaman.",
        category: "Tenaga Antar Jemput",
        illustration: <SolidFaceCube />,
    },
    {
        id: 4,
        title: "Layanan Tenaga Kerja",
        description: "Layanan Tenaga Kerja membantu Anda menemukan tenaga kerja yang sesuai untuk berbagai kebutuhan, mulai dari pekerjaan harian, bantuan proyek, hingga pekerjaan khusus dengan mudah dan terpercaya.",
        category: "Tenaga Kerja",
        illustration: <HexagonGrid />,
    },
    {
        id: 5,
        title: "Layanan Bantuan Digital",
        description: "Layanan Bantuan Digital membantu Anda menemukan tenaga untuk berbagai kebutuhan digital, seperti desain grafis, editing foto dan video, penulisan, pengelolaan media sosial, hingga layanan digital lainnya.",
        category: "Tenaga Bantuan Digital",
        illustration: <ColumnsStack />,
    },
    {
        id: 6,
        title: "Layanan Bimbingan Belajar",
        description: "Layanan Bimbingan Belajar membantu Anda meningkatkan kemampuan akademik melalui bimbingan dan tutor yang profesional, cocok untuk semua tingkat usia dan kebutuhan belajar.",
        category: "Tenaga Bimbingan Belajar",
        illustration: <MeshCube />,
    },
];

export function GridCardArea() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredCards = cardsData.filter((card) => {
        if (selectedCategory === "All") return true;
        return card.category === selectedCategory.toLowerCase();
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Dropdown Selector */}
            <div className="flex justify-start mb-8">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="outline"
                                className="rounded-xl border-border px-4 py-2 flex items-center gap-2 hover:bg-muted text-sm font-semibold tracking-wide cursor-pointer transition-colors shadow-sm bg-background"
                            />
                        }
                    >
                        <SlidersHorizontal size={15} className="text-muted-foreground" />
                        <span>Categories: {selectedCategory}</span>
                        <ChevronDown size={14} className="text-muted-foreground ml-1" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-48 rounded-xl p-1.5 mt-1.5 bg-background border border-border">
                        <DropdownMenuItem onClick={() => setSelectedCategory("All")} className="rounded-lg cursor-pointer">
                            All Categories
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedCategory("Design")} className="rounded-lg cursor-pointer">
                            Design
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedCategory("Technology")} className="rounded-lg cursor-pointer">
                            Technology
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedCategory("Development")} className="rounded-lg cursor-pointer">
                            Development
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredCards.map((card) => (
                    <div
                        key={card.id}
                        className="flex flex-col bg-muted/30 hover:bg-background border border-border/50 hover:border-border/100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 h-full group"
                    >
                        {/* Top Gray Box Container with Custom Gradient + Centered Accent SVG */}
                        <div className="w-full aspect-[4/3] bg-gradient-to-tr from-blue-500/5 via-muted/50 to-indigo-500/5 dark:from-blue-950/10 dark:via-muted/20 dark:to-indigo-950/10 rounded-2xl flex items-center justify-center mb-6 overflow-hidden select-none transition-all group-hover:bg-muted/40 border border-border/20">
                            <div className="transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500">
                                {card.illustration}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug tracking-tight mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {card.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                            {card.description}
                        </p>

                        {/* Category Tag */}
                        <div className="mt-auto pt-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/80 px-3.5 py-1.5 rounded-full select-none">
                                {card.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GridCardArea;