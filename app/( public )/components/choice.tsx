"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

const features: FeatureItem[] = [
  {
    id: "Pengguna",
    tag: "Services",
    title: "Panduan Pengguna",
    description:
      "Untuk mendapatkan informasi lebih lanjut tentang cara menggunakan aplikasi Bounty, silakan pilih opsi ini.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", // Ganti dengan path image kamu
    gradient: "from-blue-600/20 via-transparent to-transparent",
  },
  {
    id: "Komunitas",
    tag: "Analytics",
    title: "Panduan Komunitas",
    description:
      "Untuk mendapatkan informasi lebih lanjut tentang cara menggunakan aplikasi Bounty, silakan pilih opsi ini.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", // Ganti dengan path image kamu
    gradient: "from-cyan-600/20 via-transparent to-transparent",
  },
];

export default function FeatureSelection() {
  // Menyimpan ID karakter/fitur yang sedang dipilih/diklik aktif
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section id="layanan" className="py-32 bg-white overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400 block mb-3">
            Layanan
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl max-w-3xl mx-auto leading-tight">
            Informasi Aplikasi dan Layanan Bounty
          </h2>
          <p className="mt-4 text-base text-zinc-500 leading-relaxed">
            Untuk Mengetahui Panduan Lebih lanjut pilih salah satu Opsi dibawah ini
          </p>
        </div>

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {features.map((item) => {
            const isSelected = selectedId === item.id;
            const hasSelection = selectedId !== null;
            const isDimmed = hasSelection && !isSelected;

            return (
              <div
                key={item.id}
                className="flex flex-col cursor-pointer group"
                onClick={() => setSelectedId(isSelected ? null : item.id)}
              >
                {/* Image Container dengan Efek Frame Ala Game Selection */}
                <motion.div
                  animate={{
                    scale: isSelected ? 1.03 : 1,
                    boxShadow: isSelected
                      ? "0 20px 40px -15px rgba(0,0,0,0.15), 0 0 0 3px rgba(9,9,11,1)"
                      : "0 4px 20px -4px rgba(0,0,0,0.05), 0 0 0 1px rgba(228,228,231,0.6)",
                    filter: isDimmed
                      ? "brightness(0.6) grayscale(0.2)"
                      : "brightness(1) grayscale(0)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  }}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-zinc-100"
                >
                  {/* Animasi Zoom Inner Gambar */}
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    animate={{
                      scale: isSelected ? 1.12 : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 1, 0.5, 1], // Custom cubic-bezier untuk feel elastis/smooth
                    }}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay penyeimbang kontras warna saat dipilih */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-80 pointer-events-none`}
                  />

                  {/* Indikator "SELECTED / ACTIVE" ala UI Game */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 right-4 bg-zinc-900 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-zinc-700/50 shadow"
                      >
                        Active Focus
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Text Content Deskripsi di Bawah Gambar */}
                <motion.div
                  animate={{
                    opacity: isDimmed ? 0.4 : 1,
                    y: isSelected ? 4 : 0,
                  }}
                  className="mt-6 transition-all duration-300 pl-1"
                >
                  <h3 className="text-2xl font-light text-zinc-900 tracking-tight mb-2 group-hover:text-black transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-md font-medium">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
