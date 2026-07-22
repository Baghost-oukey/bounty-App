"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import bersihImages from "@/public/assets/dashboard-imgae/bersih-bersih.jpg";
import antarJemput from "@/public/assets/dashboard-imgae/antar-jemput.jpg";
import bimbinganBelajar from "@/public/assets/dashboard-imgae/bimbingan-belajar.jpg";
import tenagaKerja from "@/public/assets/dashboard-imgae/tenaga-kerja.jpg";
import titipBarang from "@/public/assets/dashboard-imgae/titip-barang.jpg";
import bantuanDigital from "@/public/assets/dashboard-imgae/bantuan-digital.jpg";

const imageMap: Record<string, any> = {
  bersih: bersihImages,
  jastip: titipBarang,
  antarJemput: antarJemput,
  tenagaKerja: tenagaKerja,
  bantuanDigital: bantuanDigital,
  bimbingan: bimbinganBelajar,
};

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageKey: string;
}

interface GridCardAreaProps {
  services: ServiceItem[];
}

export default function GridCardArea({ services }: GridCardAreaProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {services.map((card) => {
          const serviceImage = imageMap[card.imageKey] || bersihImages;

          return (
            <Link
              key={card.id}
              href={card.href}
              className="flex flex-col bg-slate-50/50 hover:bg-background border border-slate-200/60 hover:border-slate-300 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-300 h-full group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl mb-6 overflow-hidden border border-slate-200/40">
                <Image
                  src={serviceImage}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Text Container */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-semibold mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>Pesan Sekarang</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
        
      </div>
    </div>
  );
}