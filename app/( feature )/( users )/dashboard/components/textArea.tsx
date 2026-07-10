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
  Sliders,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function TextArea() {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("-6.2297");
  const [lng, setLng] = useState("106.8295");
  const [showCoords, setShowCoords] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const favorites = [
    { label: "Rumah", address: "Jl. Kemang Raya No. 10, Jakarta Selatan", lat: "-6.2514", lng: "106.8158", icon: <Home size={13} /> },
    { label: "Kantor", address: "Menara Cyber 2 Lt. 18, Kuningan, Jakarta Selatan", lat: "-6.2297", lng: "106.8295", icon: <Briefcase size={13} /> },
    { label: "Kampus", address: "Universitas Indonesia, Depok, Jawa Barat", lat: "-6.3682", lng: "106.8248", icon: <GraduationCap size={13} /> },
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
    }, 800);
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
    <div className="w-full max-w-2xl mx-auto py-12 px-4">

      {/* Hero Greeting */}
      <div className="text-center mb-5F">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 select-none">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Layanan Tersedia di Sekitarmu
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 select-none">
          Hallo Tuan{" "}
          <span className="text-blue-600 dark:text-blue-400">Ahmad Fauzi</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed select-none">
          Bounty akan membantu mencarikan orang untuk menyelesaikan pekerjaanmu — tanpa repot mencari sendiri.
        </p>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-background border border-border/60 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden"
      >
        <div className="p-6 space-y-5">

          {/* Location Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest select-none">
              Alamat Penjemputan
            </label>
            <div className="flex items-center gap-3 bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200">
              <MapPin size={18} className="text-blue-500 shrink-0 animate-pulse" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat atau cari lokasi..."
                className="flex-1 bg-transparent border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none text-foreground font-sans"
              />
              {address && (
                <button
                  type="button"
                  onClick={() => setAddress("")}
                  className="p-1 hover:bg-muted rounded-full text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={handleLocateMe}
                className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 border border-blue-100 dark:border-blue-900/50"
                title="Gunakan Lokasi GPS"
              >
                <Locate size={13} />
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>
          </div>

          {/* Recent History */}
          {!address && !showCoords && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest select-none">
                <History size={11} />
                <span>Riwayat Terakhir</span>
              </div>
              <div className="bg-muted/30 border border-border/40 rounded-2xl divide-y divide-border/40 overflow-hidden">
                {recents.map((recent, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setAddress(recent.address);
                      setLat(recent.lat);
                      setLng(recent.lng);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                  >
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                      <MapPin size={11} className="text-muted-foreground group-hover:text-blue-500" />
                    </div>
                    <span className="text-xs text-foreground/70 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-sans">
                      {recent.address}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Manual Coordinates */}
          <div className="border-t border-border/40 pt-4">
            <button
              type="button"
              onClick={() => setShowCoords(!showCoords)}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer select-none"
            >
              <Sliders size={13} />
              <span>{showCoords ? "Sembunyikan Koordinat GPS" : "Sesuaikan Koordinat Manual"}</span>
            </button>

            {showCoords && (
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 border border-border/40 p-4 rounded-2xl animate-in fade-in duration-200">
                {/* Latitude */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest select-none">
                    Latitude
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[10px] font-bold text-muted-foreground/50 select-none">LAT</span>
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="-6.2297"
                      className="w-full bg-background border border-border/60 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Longitude */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest select-none">
                    Longitude
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[10px] font-bold text-muted-foreground/50 select-none">LNG</span>
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="106.8295"
                      className="w-full bg-background border border-border/60 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Telemetry */}
                <div className="sm:col-span-2 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/30 pt-2.5 select-none">
                  <span className="flex items-center gap-1.5">
                    <Compass size={11} className="animate-spin text-blue-500" style={{ animationDuration: "6s" }} />
                    DISPATCH COORDINATES ACTIVE
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">ACCURACY: ±5M</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Footer */}
        <div className="px-6 pb-6">
          <Button
            type="submit"
            disabled={!address.trim() || loading}
            className="w-full h-12 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses Lokasi...
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-2 justify-center">
                <CheckCircle2 size={16} />
                Lokasi Ditetapkan!
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
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