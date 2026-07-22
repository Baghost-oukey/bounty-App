"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Rocket, Cpu, Target, Flag, LucideIcon } from "lucide-react";

interface TimelineItem {
  phaseNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  glowColor: string; // Pendaran warna halus di latar belakang
}

const items: TimelineItem[] = [
  {
    phaseNumber: "01",
    title: "Langkah Pertama",
    description: "Daftarkan diri Anda ke sistem kami dan buat pengajuan.",
    icon: Rocket,
    color: "from-blue-500 to-indigo-600",
    glowColor: "rgba(59,130,246,0.06)", // Pendaran biru halus
  },
  {
    phaseNumber: "02",
    title: "Langkah Kedua",
    description: "Masukkan apa kendala Anda yang mungkin bisa kami bantu.",
    icon: Cpu,
    color: "from-purple-500 to-pink-600",
    glowColor: "rgba(59,130,246,0.06)", // Pendaran biru halus
  },
  {
    phaseNumber: "03",
    title: "Langkah Ketiga",
    description: "Komunitas akan mengambil tindakan terhadap pengajuan Anda.",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    glowColor: "rgba(59,130,246,0.06)", // Pendaran biru halus
  },
  {
    phaseNumber: "04",
    title: "Langkah Keempat",
    description: "Kesepakatan akan dicapai dan masalah Anda akan diselesaikan.",
    icon: Flag,
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(59,130,246,0.06)", // Pendaran biru halus
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, {
    once: false,
    amount: 0.1,
  });

  return (
    <section id="panduan" ref={sectionRef} className="relative bg-white overflow-hidden py-20 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-16 md:mb-24 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">
            Panduan
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-zinc-900 leading-tight">
            Panduan Penggunaan
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed font-light">
            Panduan lengkap untuk mulai menggunakan sistem kami. Silakan ikuti langkah-langkah di bawah ini.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Horizontal Track Line: Only visible on Desktop (lg) */}
          <div className="hidden lg:block absolute top-6 left-0 h-0.5 w-full bg-zinc-100 rounded-full" />

          {/* Horizontal Progress Segments: Only on Desktop (lg) */}
          <div className="hidden lg:block">
            {items.map((_, index) => {
              if (index === items.length - 1) return null;
              return (
                <motion.div
                  key={`line-segment-${index}`}
                  initial={{ width: "0%" }}
                  animate={{ width: inView ? "25%" : "0%" }}
                  transition={{
                    duration: 1.4,
                    delay: index * 1.5,
                    ease: "linear",
                  }}
                  className="absolute top-6 h-[2px] bg-blue-600 z-10"
                  style={{ left: `${index * 25}%` }}
                />
              );
            })}
          </div>

          {/* Vertical Track Line: Only visible on Mobile & Tablet (below lg) */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-zinc-150 lg:hidden rounded-full" />

          {/* Cards layout - Stacks vertically below lg, row grid on lg */}
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10 md:gap-12 relative z-20">
            {items.map((item, index) => (
              <TimelineCard 
                key={item.title} 
                item={item} 
                index={index} 
                inView={inView} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  item: TimelineItem;
  index: number;
  inView: boolean;
}

function TimelineCard({ item, index, inView }: CardProps) {
  const Icon = item.icon;
  const baseDelay = index * 0.4; // Softer delay cascade

  const iconVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 12, delay: baseDelay },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 15, delay: baseDelay + 0.15 },
    },
  };

  return (
    <div className="group flex flex-row lg:flex-col items-start gap-5 lg:gap-0 w-full relative">
      
      {/* Ambient Glow Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: baseDelay + 0.2 }}
        className="absolute -inset-4 rounded-3xl pointer-events-none blur-2xl transition-all duration-500 group-hover:scale-105"
        style={{ backgroundColor: item.glowColor }}
      />

      {/* Checkpoint Icon Indicator */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="lg:mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm relative z-10 transition-all duration-300 group-hover:border-zinc-400 group-hover:shadow shrink-0"
      >
        <Icon size={18} />
      </motion.div>

      {/* Premium Content Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="flex-1 lg:w-full relative rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] z-10 transition-all duration-500 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)]"
      >
        {/* Top Gradient Highlight Bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl bg-gradient-to-r ${item.color}`} />

        {/* Info Atas: Tanggal & Badge Angka Fase */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold tracking-tight text-zinc-300 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100 group-hover:text-zinc-500 group-hover:bg-zinc-100 transition-colors duration-300">
            {item.phaseNumber}
          </span>
        </div>
        
        {/* Judul Fase */}
        <h3 className="mb-2 text-xl font-extrabold text-zinc-900 tracking-tight">
          {item.title}
        </h3>
        
        {/* Deskripsi */}
        <p className="text-sm text-zinc-500 leading-relaxed font-normal">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}