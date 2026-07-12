"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { type Step } from "./form-input/types";
import { CATEGORIES, DEFAULT_LAT, DEFAULT_LNG, DEFAULT_ADDRESS } from "./form-input/constants";
import CardContent from "./form-input/KontainerCard";
import BottomSheet from "./form-input/DropdownButtom";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export default function FormInput() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory]         = useState("");
    const [description, setDescription]               = useState("");
    const [date, setDate]         = useState("");
    const [time, setTime]         = useState("");
    const [price, setPrice]       = useState("");
    const [finalPrice, setFinalPrice] = useState(0);
    const [step, setStep]         = useState<Step>("input");
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => { setMapReady(true); }, []);

    const canPost = selectedCategories.length > 0 && !!date && !!time;

    const selectedLabels = [
        ...selectedCategories
            .filter((id) => id !== "lainnya")
            .map((id) => CATEGORIES.find((c) => c.id === id)?.label ?? "")
            .filter(Boolean),
        ...(selectedCategories.includes("lainnya") && customCategory.trim()
            ? [customCategory.trim()]
            : selectedCategories.includes("lainnya") ? ["Lainnya"] : []),
    ];

    const handlePost = () => {
        if (!canPost) return;
        setFinalPrice(Number(price.replace(/\D/g, "")) || 0);
        setStep("confirm");
    };

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setPrice(digits ? Number(digits).toLocaleString("id-ID") : "");
    };

    const cardProps = {
        step, setStep,
        selectedCategories, setSelectedCategories,
        customCategory, setCustomCategory,
        description, setDescription,
        date, setDate,
        time, setTime,
        price, handlePriceInput,
        selectedLabels, finalPrice,
        canPost, handlePost,
    };

    return (
        <div className="relative w-full h-full bg-background">

            {/* MAP — full screen, collapses sheet on click */}
            <div
                className="absolute inset-0 z-0"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest(".leaflet-control") || target.closest(".leaflet-popup")) return;
                    setTimeout(() => window.dispatchEvent(new Event("map:collapse-sheet")), 300);
                }}
            >
                {mapReady && <MapView lat={DEFAULT_LAT} lng={DEFAULT_LNG} address={DEFAULT_ADDRESS} />}
            </div>

            {/* Desktop: floating nav */}
            <div className="hidden lg:flex absolute top-4 right-4 z-[1000] items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tenaga tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">AF</div>
                    <div>
                        <p className="text-[11px] font-semibold text-foreground leading-none">Ahmad Fauzi</p>
                        <p className="text-[9px] text-blue-600 font-medium mt-0.5">Premium Member</p>
                    </div>
                </div>
            </div>

            {/* Desktop: floating left card */}
            <div className="hidden lg:flex absolute top-4 left-4 bottom-4 z-[1000] w-[420px] flex-col rounded-3xl bg-background shadow-2xl shadow-black/15 border border-border/30 overflow-hidden">
                <CardContent {...cardProps} />
            </div>

            {/* Mobile: draggable bottom sheet */}
            <BottomSheet {...cardProps} selectedLabels={selectedLabels} selectedCategories={selectedCategories} />
        </div>
    );
}
