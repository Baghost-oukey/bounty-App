"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IconSidebar, { type SidebarView } from "./components/Sidebar";
import FloatingBountyCard from "./components/ContainerMainModal";
import MobileBottomSheet from "./components/MobileBottomSheet";
import MobileNavBar from "./components/MobileNavBar";
import type { BountyMarker } from "./components/MapView";
import { getActiveBountyTasks } from "@/app/actions/bounty";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

const DEFAULT_LAT = -6.2297;
const DEFAULT_LNG = 106.8295;

export default function TakeOrderPage() {
  const [mapReady, setMapReady] = useState(false);
  const [view, setView] = useState<SidebarView>("bounty");
  const [bounties, setBounties] = useState<BountyMarker[]>([]);

  const fetchBounties = () => {
    getActiveBountyTasks().then((res) => {
      if (res.success && res.tasks) {
        setBounties(res.tasks);
      }
    }).catch((err) => {
      console.error("Error fetching active bounties:", err);
    });
  };

  useEffect(() => {
    setMapReady(true);
    fetchBounties();
    
    // Poll active bounties every 10 seconds for real-time responsiveness
    const interval = setInterval(fetchBounties, 10000);
    return () => clearInterval(interval);
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
            bounties={bounties}
          />
        )}

        {/* ── DESKTOP: floating left card ── */}
        <div className="hidden lg:block">
          <FloatingBountyCard 
            view={view} 
            onViewChange={setView} 
            bounties={bounties}
            onRefresh={fetchBounties}
          />
        </div>

        {/* Desktop top-right badge */}
        <div className="hidden lg:flex absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl px-3.5 py-2 shadow-lg items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-foreground">
            {bounties.length} bounty di sekitarmu
          </span>
        </div>

        {/* ── MOBILE: bottom sheet + nav bar ── */}
        <div className="lg:hidden">
          {/* Bottom sheet sits above nav bar */}
          <MobileBottomSheet 
            view={view} 
            onViewChange={setView} 
            bounties={bounties}
            onRefresh={fetchBounties}
          />

          {/* Bottom nav bar — always visible, controls view */}
          <MobileNavBar active={view} onChange={setView} />
        </div>

        {/* Mobile top badge */}
        <div className="lg:hidden absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-foreground">
            {bounties.length} bounty
          </span>
        </div>
      </div>
    </div>
  );
}
