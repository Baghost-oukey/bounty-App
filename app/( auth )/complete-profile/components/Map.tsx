"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, X, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom pin icon matching the Bounty App theme (blue gradient)
const pinIcon = typeof window !== "undefined" ? L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:36px;height:44px;">
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%) rotate(-45deg);
            width:32px;height:32px;background:linear-gradient(135deg,#2563eb,#1d4ed8);
            border-radius:50% 50% 50% 0;border:3px solid white;
            box-shadow:0 4px 14px rgba(37,99,235,0.45);"></div>
        <div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);
            width:20px;height:20px;background:white;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;line-height:1;">📍</div>
    </div>
  `,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
}) : null;

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: GeocodeResult) => void;
  initialLat: number;
  initialLng: number;
}

export interface GeocodeResult {
  alamatLengkap: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
  latitude: number;
  longitude: number;
}

// Recentering map helper
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

// Invalidate Leaflet map size on load to fix the white/empty map container rendering bug
function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MapPickerModal({ isOpen, onClose, onConfirm, initialLat, initialLng }: MapPickerModalProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<GeocodeResult | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);

  // Function to fetch GPS coordinates and update map center
  const locateUserGPS = () => {
    try {
      if (typeof window === "undefined" || !navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }
      setLocatingGps(true);
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setPosition([lat, lon]);
          setLocatingGps(false);
        },
        (err) => {
          console.warn("GPS high accuracy failed, trying fallback...", err.message);
          // Try fallback without high accuracy (much more reliable on desktops/WIFI)
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              setPosition([lat, lon]);
              setLocatingGps(false);
            },
            (err2) => {
              console.warn("GPS fallback also failed:", err2.message);
              setLocatingGps(false);
            },
            { enableHighAccuracy: false, timeout: 5000 }
          );
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } catch (e) {
      console.warn("GPS locate exception caught:", e);
      setLocatingGps(false);
    }
  };

  // Sync position with initial values and request auto-GPS on open
  useEffect(() => {
    if (isOpen) {
      setPosition([initialLat, initialLng]);
      setSelectedAddress(null);
      setSearchQuery("");
      setSearchResults([]);
      locateUserGPS();
    }
  }, [isOpen, initialLat, initialLng]);

  // Reverse geocoding from Nominatim OSM API
  const fetchAddressDetails = async (lat: number, lng: number) => {
    setReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            "User-Agent": "BountyAppOnboardingMapPicker/1.0"
          }
        }
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        
        // Map fields based on Nominatim responses for Indonesia
        const provinsi = addr.state || addr.region || "";
        const kabupaten = addr.city || addr.regency || addr.municipality || addr.county || "";
        const kecamatan = addr.city_district || addr.district || addr.suburb || kabupaten || "-";
        const kelurahan = addr.village || addr.subdistrict || addr.neighbourhood || addr.quarter || kecamatan || "-";
        const kodePos = addr.postcode || "";

        // Formulate a clean full address
        const parts = [
          addr.road,
          addr.residential,
          addr.neighbourhood,
          kelurahan,
          kecamatan,
          kabupaten,
          provinsi
        ].filter(Boolean);
        const alamatLengkap = data.display_name || parts.join(", ");

        setSelectedAddress({
          alamatLengkap,
          provinsi,
          kabupaten,
          kecamatan,
          kelurahan,
          kodePos,
          latitude: lat,
          longitude: lng
        });
      }
    } catch (err) {
      console.warn("Reverse geocoding error:", err);
      // Fallback address so the user can still confirm coordinates even if Nominatim API is down/rate-limited
      setSelectedAddress({
        alamatLengkap: `Lokasi Terpilih (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
        provinsi: "-",
        kabupaten: "-",
        kecamatan: "-",
        kelurahan: "-",
        kodePos: "",
        latitude: lat,
        longitude: lng
      });
    } finally {
      setReverseGeocoding(false);
    }
  };

  // Perform reverse geocode when marker position updates
  useEffect(() => {
    if (isOpen) {
      fetchAddressDetails(position[0], position[1]);
    }
  }, [position, isOpen]);

  // Handle map click to reposition pin
  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    });
    return null;
  }

  // Handle search submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`,
        {
          headers: {
            "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            "User-Agent": "BountyAppOnboardingMapPicker/1.0"
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search geocoding error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setPosition([lat, lon]);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100/80 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Pilih Lokasi Alamat</h3>
              <p className="text-xs text-slate-400 font-light mt-1">Geser pin atau klik pada peta untuk menetapkan alamat tinggal Anda.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-all p-2 rounded-full hover:bg-slate-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & GPS Action Row */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-2 relative z-20">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Cari jalan, kelurahan, atau kecamatan Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold shadow-sm transition-all placeholder-slate-400"
              />
            </div>
            <Button
              type="submit"
              disabled={searching}
              className="h-[38px] px-5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/10 cursor-pointer transition-all"
            >
              {searching ? <Loader2 size={14} className="animate-spin" /> : "Cari"}
            </Button>
          </form>

          {/* Quick GPS locate button */}
          <Button
            type="button"
            onClick={locateUserGPS}
            disabled={locatingGps}
            variant="outline"
            className="h-[38px] px-5 rounded-2xl text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            {locatingGps ? (
              <Loader2 size={14} className="animate-spin text-blue-500" />
            ) : (
              <Navigation size={14} className="transform rotate-45" />
            )}
            GPS Aktif
          </Button>

          {/* Search suggestions */}
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors font-medium flex items-start gap-2 cursor-pointer"
                >
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Container - using explicit height to prevent render bugs in modals */}
        <div className="w-full relative bg-slate-100 border-b border-slate-100 z-10 overflow-hidden" style={{ height: "360px" }}>
          {pinIcon && (
            <MapContainer
              center={position}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <ChangeView center={position} />
              <MapEvents />
              <InvalidateMapSize />
              <Marker 
                position={position} 
                icon={pinIcon}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    setPosition([pos.lat, pos.lng]);
                  }
                }}
                draggable={true}
              />
            </MapContainer>
          )}
        </div>

        {/* Footer Address Info */}
        <div className="p-5 bg-slate-50 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
              <MapPin size={18} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Terpilih</span>
              {reverseGeocoding ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Loader2 size={12} className="animate-spin text-blue-500" />
                  Mencari alamat detail...
                </div>
              ) : selectedAddress ? (
                <p className="text-xs text-slate-700 font-bold leading-relaxed">
                  {selectedAddress.alamatLengkap}
                </p>
              ) : (
                <p className="text-xs text-slate-400 font-semibold">Klik pada peta untuk mengambil detail alamat.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
            <div className="text-[10px] font-mono text-slate-400 font-semibold">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 rounded-2xl text-xs font-bold text-slate-500 border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </Button>
              <Button
                disabled={!selectedAddress || reverseGeocoding}
                onClick={() => selectedAddress && onConfirm(selectedAddress)}
                className="h-10 px-5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15 disabled:opacity-50 transition-all cursor-pointer"
              >
                Gunakan Lokasi Ini
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
