"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IconSidebar, { type SidebarView } from "./components/Sidebar";
import FloatingBountyCard from "./components/tampilan-mobile/ContainerMainModal";
import MobileBottomSheet from "./components/MobileBottomSheet";
import MobileNavBar from "./components/tampilan-mobile/MobileNavBar";
import type { BountyMarker } from "./components/MapView";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

const DEFAULT_LAT = -6.2297;
const DEFAULT_LNG = 106.8295;

const BOUNTY_MARKERS: BountyMarker[] = [
  {
    id: "B001",
    lat: -6.225,
    lng: 106.826,
    layanan: "Bersih-Bersih",
    tugas: "Sapu & Pel, Kamar Mandi, Dapur",
    lokasi: "Kuningan, Jaksel",
    jadwal: "Hari ini, 14:00",
    budget: 85000,
    pesaing: 2,
    jarak: "0.8 km",
  },
  {
    id: "B002",
    lat: -6.218,
    lng: 106.802,
    layanan: "Antar Jemput",
    tugas: "Antar ke Bandara Soekarno-Hatta",
    lokasi: "Senayan, Jakpus",
    jadwal: "Besok, 06:00",
    budget: 120000,
    pesaing: 4,
    jarak: "2.1 km",
  },
  {
    id: "B003",
    lat: -6.232,
    lng: 106.834,
    layanan: "Jasa Titip",
    tugas: "Beli obat apotek + snack Indomaret",
    lokasi: "Pancoran, Jaksel",
    jadwal: "Hari ini, 16:30",
    budget: 30000,
    pesaing: 1,
    jarak: "1.4 km",
  },
  {
    id: "B004",
    lat: -6.245,
    lng: 106.814,
    layanan: "Bantuan Digital",
    tugas: "Desain logo brand kopi — minimalis",
    lokasi: "Remote",
    jadwal: "Deadline 3 hari",
    budget: 200000,
    pesaing: 7,
    jarak: "—",
  },
  {
    id: "B005",
    lat: -6.259,
    lng: 106.821,
    layanan: "Bimbingan Belajar",
    tugas: "Les matematika SMA — persiapan UN",
    lokasi: "Kebayoran Baru",
    jadwal: "Sabtu, 09:00",
    budget: 150000,
    pesaing: 3,
    jarak: "3.2 km",
  },
];

export default function TakeOrderPage() {
  const [mapReady, setMapReady] = useState(false);
  const [view, setView] = useState<SidebarView>("bounty");

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* ── DESKTOP: slim icon sidebar ── */}
      <div className="hidden lg:flex">
        <IconSidebar active={view} onChange={setView} />
      </div>

      {/* ── Map area ── */}
      <div
        className="relative flex-1 overflow-hidden"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(".leaflet-control") ||
            target.closest(".leaflet-popup")
          )
            return;
          setTimeout(
            () => window.dispatchEvent(new Event("map:collapse-sheet")),
            300,
          );
        }}
      >
        {mapReady && (
          <MapView
            lat={DEFAULT_LAT}
            lng={DEFAULT_LNG}
            bounties={BOUNTY_MARKERS}
          />
        )}

        {/* ── DESKTOP: floating left card ── */}
        <div className="hidden lg:block">
          <FloatingBountyCard view={view} onViewChange={setView} />
        </div>

        {/* Desktop top-right badge */}
        <div className="hidden lg:flex absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl px-3.5 py-2 shadow-lg items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-foreground">
            {BOUNTY_MARKERS.length} bounty di sekitarmu
          </span>
        </div>

        {/* ── MOBILE: bottom sheet + nav bar ── */}
        <div className="lg:hidden">
          {/* Bottom sheet sits above nav bar */}
          <MobileBottomSheet view={view} onViewChange={setView} />

          {/* Bottom nav bar — always visible, controls view */}
          <MobileNavBar active={view} onChange={setView} />
        </div>

        {/* Mobile top badge */}
        <div className="lg:hidden absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-foreground">
            {BOUNTY_MARKERS.length} bounty
          </span>
        </div>
      </div>
    </div>
  );
}
