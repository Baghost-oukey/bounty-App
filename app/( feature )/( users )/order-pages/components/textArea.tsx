"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  X,
  Home,
  Briefcase,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapPickerModal = dynamic(
  () => import("@/app/( auth )/complete-profile/components/Map"),
  { ssr: false }
);

interface SavedAddress {
  id: string;
  label: string;
  alamatLengkap: string;
  catatan: string;
  latitude: string;
  longitude: string;
  isUtama: boolean;
}

interface TextAreaProps {
  userName: string;
  savedAddresses: SavedAddress[];
  initialAddress: SavedAddress | null;
}

export default function TextArea({ userName, savedAddresses, initialAddress }: TextAreaProps) {
  const [address, setAddress] = useState(initialAddress?.alamatLengkap || "");
  const [lat, setLat] = useState(initialAddress?.latitude || "-6.2297");
  const [lng, setLng] = useState(initialAddress?.longitude || "106.8295");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Sync state if initialAddress is loaded later or changes
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress.alamatLengkap);
      setLat(initialAddress.latitude);
      setLng(initialAddress.longitude);
    }
  }, [initialAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setError(null);

    // Save current pickup location to localStorage so services page can access it
    localStorage.setItem("bounty_pickup_address", address);
    localStorage.setItem("bounty_pickup_lat", lat);
    localStorage.setItem("bounty_pickup_lng", lng);

    setLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSelectLocationFromMap = (data: any) => {
    setAddress(data.alamatLengkap);
    setLat(String(data.latitude));
    setLng(String(data.longitude));
    setError(null);
    setIsMapModalOpen(false);
  };

  const getIcon = (label: string) => {
    const lbl = label.toLowerCase();
    if (lbl.includes("rumah")) return <Home size={13} />;
    if (lbl.includes("kantor") || lbl.includes("kerja")) return <Briefcase size={13} />;
    if (lbl.includes("kampus") || lbl.includes("sekolah")) return <GraduationCap size={13} />;
    return <MapPin size={13} />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">

      {/* Hero Greeting */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 select-none">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Layanan Tersedia di Sekitarmu
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 mb-3 select-none">
          Hallo Tuan{" "}
          <span className="text-blue-600 dark:text-blue-400">{userName}</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed select-none font-medium">
          Bounty akan membantu mencarikan orang untuk menyelesaikan pekerjaanmu — tanpa repot mencari sendiri.
        </p>
      </div>

      {/* Modern Alert Error Message Banner */}
      {error && (
        <div className="mb-6 w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-650 text-left animate-in fade-in duration-200">
          <AlertCircle className="shrink-0 mt-0.5 text-red-500" size={16} />
          <div className="flex-1 flex justify-between items-center">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 shrink-0 cursor-pointer p-0.5 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-background border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden"
      >
        <div className="p-6 space-y-5">

          {/* Location Picker Trigger (No manual text input) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
              Alamat Penjemputan / Pelaksanaan
            </label>
            <div 
              onClick={() => setIsMapModalOpen(true)}
              className="flex items-center gap-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-blue-400/80 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 group active:scale-[0.995]"
            >
              <MapPin size={18} className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div className="flex-1 min-w-0">
                {address ? (
                  <p className="text-sm text-slate-800 font-semibold truncate leading-tight">{address}</p>
                ) : (
                  <p className="text-sm text-slate-400 font-medium leading-tight">Pilih lokasi pada peta...</p>
                )}
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100 shrink-0 transition-colors">
                Buka Peta
              </span>
            </div>
          </div>

          {/* Saved Addresses Favorites */}
          {savedAddresses.length > 0 && (
            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
                Alamat Tersimpan Saya
              </label>
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => {
                      setAddress(fav.alamatLengkap);
                      setLat(fav.latitude);
                      setLng(fav.longitude);
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 hover:bg-blue-50 hover:border-blue-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
                  >
                    {getIcon(fav.label)}
                    <span>{fav.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Submit Footer */}
        <div className="px-6 pb-6">
          <Button
            type="submit"
            disabled={!address.trim() || loading}
            className="w-full h-12 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15 hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaved ? (
              <span className="flex items-center gap-2 justify-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={16} />
                Lokasi & Koordinat Ditetapkan!
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Navigation size={16} />
                Tetapkan Lokasi Pelaksanaan
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Map Picker Modal Dialog */}
      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={handleSelectLocationFromMap}
        initialLat={Number(lat) || -6.2297}
        initialLng={Number(lng) || 106.8295}
      />
    </div>
  );
}