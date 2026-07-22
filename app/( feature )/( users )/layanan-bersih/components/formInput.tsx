"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { type Step } from "./form-input/types";
import { CATEGORIES, DEFAULT_LAT, DEFAULT_LNG, DEFAULT_ADDRESS } from "./form-input/constants";
import CardContent from "./form-input/KontainerCard";
import BottomSheet from "./form-input/DropdownButtom";
import { createBountyTask, getActiveBountyTasks } from "@/app/actions/bounty";
import { getProfileStatus } from "@/app/actions/profile";

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
    const [loading, setLoading]   = useState(false);

    // Dynamic state populated from local storage & database
    const [address, setAddress]   = useState(DEFAULT_ADDRESS);
    const [lat, setLat]           = useState(Number(DEFAULT_LAT));
    const [lng, setLng]           = useState(Number(DEFAULT_LNG));
    const [userName, setUserName] = useState("Pengguna");
    const [activeBounties, setActiveBounties] = useState<any[]>([]);

    const fetchActiveBounties = () => {
        getActiveBountyTasks().then((res) => {
            if (res.success && res.tasks) {
                // Do NOT filter - show all active bounties to make map look busy and active!
                setActiveBounties(res.tasks);
            }
        }).catch((err) => {
            console.error("Error fetching active bounties:", err);
        });
    };

    useEffect(() => {
        setMapReady(true);
        fetchActiveBounties();

        // Load dynamic location from order-pages selections
        const storedAddr = localStorage.getItem("bounty_pickup_address");
        const storedLat = localStorage.getItem("bounty_pickup_lat");
        const storedLng = localStorage.getItem("bounty_pickup_lng");
        if (storedAddr) setAddress(storedAddr);
        if (storedLat) setLat(Number(storedLat));
        if (storedLng) setLng(Number(storedLng));

        // Fetch actual profile name
        getProfileStatus().then((status) => {
            if (status.authenticated && status.dbUser) {
                const name = status.dbUser.profil?.namaLengkap || status.dbUser.username || "Pengguna";
                setUserName(name);
            }
        }).catch((err) => {
            console.error("Error fetching profile name:", err);
        });
    }, []);

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

    // Submits the bounty task to Postgres via Prisma server action
    const handleConfirmPost = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await createBountyTask({
                serviceName: "Layanan Bersih - Bersih",
                categories: selectedLabels,
                date,
                time,
                description,
                price: finalPrice,
                address,
                lat,
                lng,
            });

            if (res.success) {
                fetchActiveBounties(); // Reload list to map
                setStep("done");
            } else {
                alert(res.error || "Gagal memposting bounty. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Error posting bounty:", err);
            alert("Terjadi kesalahan koneksi server.");
        } finally {
            setLoading(false);
        }
    };

    // Generate initials for avatar bubble
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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
        address, loading, onConfirmPost: handleConfirmPost,
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
                {mapReady && (
                    <MapView
                        lat={lat}
                        lng={lng}
                        address={address}
                        activeBounties={activeBounties}
                    />
                )}
            </div>

            {/* Desktop: floating nav */}
            <div className="hidden lg:flex absolute top-4 right-4 z-[1000] items-center gap-3">
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3.5 py-2 shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground">Tenaga tersedia</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {userInitials || "U"}
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-foreground leading-none">{userName}</p>
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
