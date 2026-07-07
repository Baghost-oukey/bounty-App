"use client";
import Home from "@/app/( public )/page";
import { BadgeCheck, BarChart3, Check, CirclePlay, Diamond, FormInput, HomeIcon, LayoutGrid, LucideIcon, Route, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  icon: LucideIcon;
};

const DATA: Item[] = [
   {
    id: "1",
    title: "Menyapu Rumah",
    icon: HomeIcon,
  },
  {
    id: "2",
    title: "Mengepel Lantai",
    icon: Sparkles,
  },
  {
    id: "3",
    title: "Membersihkan Kamar",
    icon: BadgeCheck,
  },
  {
    id: "4",
    title: "Mencuci Piring",
    icon: CirclePlay,
  },
  {
    id: "5",
    title: "Mencuci Pakaian",
    icon: Diamond,
  },
  {
    id: "6",
    title: "Menyetrika Pakaian",
    icon: FormInput,
  },
  {
    id: "7",
    title: "Membersihkan Kamar Mandi",
    icon: ShieldCheck,
  },
  {
    id: "8",
    title: "Perawatan Taman",
    icon: Route,
  },
  {
    id: "10",
    title: "Pembersihan Mendalam",
    icon: BarChart3,
  },
  {
    id: "11bun ",
    title: "Paket Lengkap",
    icon: LayoutGrid,
  },
];

export default function ReminderCarousel() {
  const [visible, setVisible] = useState<Item[]>(DATA.slice(0, 3));
  const [pointer, setPointer] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => {
        const nextIndex = (pointer + 1) % DATA.length;
        setPointer(nextIndex);
        return [...prev.slice(1), DATA[nextIndex]];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [pointer]);

  return (
    <div className="relative flex flex-col items-center rounded-2xl h-52 w-full overflow-hidden">
      <AnimatePresence initial={false}>
        {visible.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ y: 215, opacity: 0, scale: 0.9 }}
            animate={{
              y: i * 70,
              scale: i === 1 ? 1 : 0.9,
              opacity: i === 1 ? 1 : 0.5,
            }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute flex items-center justify-between w-full px-5 py-4 rounded-xl bg-background border border-border text-card-foreground">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <item.icon size={20}/>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <Check size={20}/>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
