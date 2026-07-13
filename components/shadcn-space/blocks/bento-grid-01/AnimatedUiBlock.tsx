"use client";

import { motion } from "motion/react";
import {
    ShoppingBag,
    Coffee,
    Pill,
    Package,
    Gift,
    Shirt,
    UtensilsCrossed,
    MapPin,
} from "lucide-react";

// Items yang bisa dititip beli — mengorbit di sekitar ikon tengah (MapPin = lokasi user)
const ORBIT_ITEMS = [
    { icon: ShoppingBag,    label: "Belanja",  delay: 0,    pos: "start-[70%] top-0"              },
    { icon: Coffee,         label: "Kopi",     delay: 0.4,  pos: "start-[91%] top-[28%]",  sm: true },
    { icon: Pill,           label: "Obat",     delay: 0.8,  pos: "start-[78%] top-[61%]"          },
    { icon: Gift,           label: "Hadiah",   delay: 1.2,  pos: "end-[78%] top-0",        sm: true },
    { icon: UtensilsCrossed,label: "Makanan",  delay: 0.3,  pos: "end-[67%] lg:top-[61%] top-[80%]" },
    { icon: Package,        label: "Paket",    delay: 0.6,  pos: "lg:end-[98%] end-[80%] lg:top-0 top-[30%]" },
    { icon: Shirt,          label: "Pakaian",  delay: 1.0,  pos: "end-[95%] top-[67%]",   sm: true },
];

export default function AnimatedUiBlock() {
    return (
        <div className="min-h-[216px] flex items-center justify-center relative">

            {/* Center — lokasi user */}
            <div className="flex flex-col items-center justify-center gap-1.5 z-20">
                <span className="lg:size-20 size-14 flex items-center justify-center rounded-full bg-blue-600 shadow-xl shadow-blue-600/30">
                    <MapPin className="lg:w-9 lg:h-9 w-7 h-7 text-white" strokeWidth={2} />
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground bg-background border border-border rounded-full px-2.5 py-0.5 shadow-sm">
                    Lokasiku
                </span>
            </div>

            {/* Orbiting icons */}
            {ORBIT_ITEMS.map(({ icon: Icon, label, delay, pos, sm }) => (
                <motion.div
                    key={label}
                    className={`absolute ${pos} z-10`}
                    animate={{ y: [delay % 0.5 === 0 ? 15 : -15, delay % 0.5 === 0 ? -15 : 15, delay % 0.5 === 0 ? 15 : -15] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay }}
                >
                    <span
                        aria-label={label}
                        className={`${sm ? "lg:size-12 size-8" : "lg:size-16 size-11"} flex items-center justify-center rounded-full bg-background border border-border shadow-md`}
                    >
                        <Icon className={sm ? "lg:w-5 lg:h-5 w-4 h-4 text-blue-600" : "lg:w-7 lg:h-7 w-5 h-5 text-blue-600"} strokeWidth={1.8} />
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
