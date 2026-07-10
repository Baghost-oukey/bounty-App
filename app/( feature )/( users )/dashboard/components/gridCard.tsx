"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import bersihImages from "@/public/assets/dashboard-imgae/bersih-bersih.jpg";
import antarJemput from "@/public/assets/dashboard-imgae/antar-jemput.jpg";
import bimbinganBelajar from "@/public/assets/dashboard-imgae/bimbingan-belajar.jpg";
import tenagaKerja from "@/public/assets/dashboard-imgae/tenaga-kerja.jpg";
import titipBarang from "@/public/assets/dashboard-imgae/titip-barang.jpg";
import bantuanDigital from "@/public/assets/dashboard-imgae/bantuan-digital.jpg";

interface CardItem {
    id: number;
    title: string;
    description: string;
    category:
        | "Tenaga Kebersihan"
        | "Tenaga Jastip"
        | "Tenaga Antar Jemput"
        | "Tenaga Kerja"
        | "Tenaga Bantuan Digital"
        | "Tenaga Bimbingan Belajar";
    image: StaticImageData;
    href: string;
}

const cardsData: CardItem[] = [
    {
        id: 1,
        title: "Layanan Bersih - Bersih",
        description:
            "Rumah bersih tanpa repot! Pesan jasa kebersihan untuk membantu menyapu, mengepel, mencuci, membersihkan kamar mandi, dapur, dan berbagai pekerjaan rumah tangga lainnya dengan mudah.",
        category: "Tenaga Kebersihan",
        image: bersihImages,
        href: "/layanan/kebersihan",
    },
    {
        id: 2,
        title: "Layanan Jasa Titip Barang",
        description:
            "Butuh sesuatu tapi tidak ingin keluar rumah? Gunakan layanan jasa titip untuk membeli dan mengantarkan barang yang Anda inginkan dengan cepat dan praktis.",
        category: "Tenaga Jastip",
        image: titipBarang,
        href: "/layanan/jastip",
    },
    {
        id: 3,
        title: "Layanan Antar Jemput",
        description:
            "Layanan Antar Jemput menyediakan jasa transportasi dan pengantaran untuk membantu mobilitas Anda, mulai dari mengantar makanan, barang, hingga mengantar penumpang ke tujuan dengan aman dan nyaman.",
        category: "Tenaga Antar Jemput",
        image: antarJemput,
        href: "/layanan/antar-jemput",
    },
    {
        id: 4,
        title: "Layanan Tenaga Kerja",
        description:
            "Layanan Tenaga Kerja membantu Anda menemukan tenaga kerja yang sesuai untuk berbagai kebutuhan, mulai dari pekerjaan harian, bantuan proyek, hingga pekerjaan khusus dengan mudah dan terpercaya.",
        category: "Tenaga Kerja",
        image: tenagaKerja,
        href: "/layanan/tenaga-kerja",
    },
    {
        id: 5,
        title: "Layanan Bantuan Digital",
        description:
            "Layanan Bantuan Digital membantu Anda menemukan tenaga untuk berbagai kebutuhan digital, seperti desain grafis, editing foto dan video, penulisan, pengelolaan media sosial, hingga layanan digital lainnya.",
        category: "Tenaga Bantuan Digital",
        image: bantuanDigital,
        href: "/layanan/bantuan-digital",
    },
    {
        id: 6,
        title: "Layanan Bimbingan Belajar",
        description:
            "Layanan Bimbingan Belajar membantu Anda meningkatkan kemampuan akademik melalui bimbingan dan tutor yang profesional, cocok untuk semua tingkat usia dan kebutuhan belajar.",
        category: "Tenaga Bimbingan Belajar",
        image: bimbinganBelajar,
        href: "/layanan/bimbingan-belajar",
    },
];

export function GridCardArea() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
               
                {cardsData.map((card) => (
                    <Link
                        key={card.id}
                        href={card.href}
                        className="flex flex-col bg-muted/30 hover:bg-background border border-border/50 hover:border-border rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 h-full group cursor-pointer"
                    >
                        {/* Image Container */}
                        <div className="relative w-full aspect-4/3 rounded-2xl mb-6 overflow-hidden border border-border/20">
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug tracking-tight mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {card.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                            {card.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/80 px-3.5 py-1.5 rounded-full select-none">
                                {card.category}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default GridCardArea;