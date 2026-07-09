"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Locate, 
  X, 
  Home, 
  Briefcase, 
  GraduationCap, 
  History,
  Compass,
  Sliders
} from "lucide-react";
import { useState } from "react";

export default function TextArea() {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("-6.2297");
  const [lng, setLng] = useState("106.8295");
  const [showCoords, setShowCoords] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Predefined Mock Locations with Coordinates
  const favorites = [
    { label: "Rumah", address: "Jl. Kemang Raya No. 10, Jakarta Selatan", lat: "-6.2514", lng: "106.8158", icon: <Home size={14} /> },
    { label: "Kantor", address: "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan", lat: "-6.2297", lng: "106.8295", icon: <Briefcase size={14} /> },
    { label: "Kampus", address: "Universitas Indonesia, Depok, Jawa Barat", lat: "-6.3682", lng: "106.8248", icon: <GraduationCap size={14} /> },
  ];

  const recents = [
    { address: "Grand Indonesia Mall, Menteng, Jakarta Pusat", lat: "-6.1952", lng: "106.8203" },
    { address: "Stasiun Gambir, Gambir, Jakarta Pusat", lat: "-6.1767", lng: "106.8306" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800); // 800ms mock delay
  };

  const handleLocateMe = () => {
    setLoading(true);
    setTimeout(() => {
      setAddress("Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan");
      setLat("-6.2297");
      setLng("106.8295");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4 text-center">
      {/* Centered Heading */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2 select-none">
        Hallo Tuan <span className="font-extrabold text-blue-600">Ahmad Fauzi</span>
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 select-none leading-relaxed">
        Apa yang mau kamu lakukan hari ini? Bounty akan membantu mencarikan orang untuk menyelesaikan pekerjaanmu tanpa repot mencari sendiri.
      </p>

      {/* Sleek Ride-Hailing Style Location Input Container */}
      <form onSubmit={handleSubmit} className="w-full space-y-5 text-left bg-muted/20 dark:bg-muted/10 p-6 border border-border/50 rounded-3xl shadow-xs">
        
        {/* Search Bar Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">Alamat Penjemputan</label>
          <div className="bg-background border border-border/80 shadow-md rounded-2xl p-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600">
            <div className="flex items-center gap-3">
              {/* Left Location Indicator Dot/Pin */}
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                <MapPin size={20} className="animate-pulse" />
              </div>

              {/* Compact Sleek Input */}
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat jemput atau cari lokasi..."
                className="flex-1 bg-transparent border-0 p-0 text-base placeholder:text-muted-foreground text-left focus:outline-none focus:ring-0 outline-none text-foreground py-1 font-sans"
              />

              {/* Clear Button */}
              {address && (
                <button
                  type="button"
                  onClick={() => setAddress("")}
                  className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}

              {/* GPS Locate Me Action Button */}
              <button
                type="button"
                onClick={handleLocateMe}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                title="Gunakan Lokasi GPS Saat Ini"
              >
                <Locate size={16} />
                <span className="hidden sm:inline font-sans">GPS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Favorite pill buttons */}
        <div className="flex flex-wrap items-center gap-2 px-1 select-none">
          <span className="text-xs text-muted-foreground font-medium mr-1">Setel Cepat:</span>
          {favorites.map((fav) => (
            <button
              key={fav.label}
              type="button"
              onClick={() => {
                setAddress(fav.address);
                setLat(fav.lat);
                setLng(fav.lng);
              }}
              className="flex items-center gap-1.5 text-xs bg-background hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 dark:hover:border-blue-900 border border-border/80 px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer font-sans shadow-xs"
            >
              {fav.icon}
              <span>{fav.label}</span>
            </button>
          ))}
        </div>

        {/* Toggle Manual Coordinates Option */}
        <div className="border-t border-border/40 pt-4">
          <button
            type="button"
            onClick={() => setShowCoords(!showCoords)}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer select-none"
          >
            <Sliders size={14} />
            <span>{showCoords ? "Sembunyikan Koordinat GPS" : "Sesuaikan Koordinat GPS Manual"}</span>
          </button>

          {/* Collapsible Coordinates Inputs & Telemetry Panel */}
          {showCoords && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background border border-border/40 p-4 rounded-2xl shadow-inner animate-in fade-in duration-200">
              {/* Latitude Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">Latitude (Garis Lintang)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-muted-foreground/60 select-none">LAT</span>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Contoh: -6.2297"
                    className="w-full bg-muted/20 border border-border/60 rounded-xl pl-11 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-foreground font-mono"
                  />
                </div>
              </div>

              {/* Longitude Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">Longitude (Garis Bujur)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-muted-foreground/60 select-none">LNG</span>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Contoh: 106.8295"
                    className="w-full bg-muted/20 border border-border/60 rounded-xl pl-11 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-foreground font-mono"
                  />
                </div>
              </div>

              {/* Telemetry Indicator */}
              <div className="sm:col-span-2 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/30 pt-2.5 mt-1 select-none">
                <span className="flex items-center gap-1">
                  <Compass size={12} className="animate-spin text-blue-600" style={{ animationDuration: '6s' }} />
                  DISPATCH COORDINATES ACTIVE
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">ACCURACY: ±5M</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent History Autocomplete suggestions */}
        {!address && !showCoords && (
          <div className="bg-background border border-border/60 rounded-2xl p-4 space-y-3 select-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <History size={13} />
              <span>Riwayat Lokasi Terakhir</span>
            </div>
            <div className="space-y-2">
              {recents.map((recent, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAddress(recent.address);
                    setLat(recent.lat);
                    setLng(recent.lng);
                  }}
                  className="text-xs sm:text-sm text-foreground/80 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-2 py-1 pl-1 font-sans"
                >
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full shrink-0" />
                  <span className="truncate">{recent.address}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit action button */}
        <div className="flex justify-center items-center pt-2">
          <Button
            type="submit"
            disabled={!address.trim() || loading}
            className="rounded-full px-6 h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-600/90 text-white min-w-[220px] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-200 cursor-pointer font-sans"
          >
            {loading ? (
              <span className="flex items-center gap-1.5 justify-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses Lokasi...
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={16} />
                Lokasi Ditetapkan!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 justify-center">
                <Navigation size={16} />
                Tetapkan Lokasi Penjemputan
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
