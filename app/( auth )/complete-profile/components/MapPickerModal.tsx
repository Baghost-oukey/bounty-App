"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, X, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom pin icon matching the Bounty App theme (teal gradient)
const pinIcon = typeof window !== "undefined" ? L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:36px;height:44px;">
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%) rotate(-45deg);
            width:32px;height:32px;background:linear-gradient(135deg,#0d9488,#0f766e);
            border-radius:50% 50% 50% 0;border:3px solid white;
            box-shadow:0 4px 14px rgba(13,148,136,0.45);"></div>
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
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh browser Anda.");
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
        console.error("GPS retrieval error:", err);
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  // Sync position with initial values and request auto-GPS on open
  useEffect(() => {
    if (isOpen) {
      setPosition([initialLat, initialLng]);
      setSelectedAddress(null);
      setSearchQuery("");
      setSearchResults([]);
      
      // Auto-grab GPS coordinates immediately on open to center the map on the user's location
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
      console.error("Reverse geocoding error:", err);
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
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pilih Lokasi Alamat</h3>
              <p className="text-[10px] text-slate-400 font-medium">Geser pin atau klik pada peta untuk menetapkan alamat tinggal Anda.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
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
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 font-medium shadow-sm transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={searching}
              className="h-[38px] px-4 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-1.5 shrink-0"
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
            className="h-[38px] px-4 rounded-2xl text-xs font-bold border-teal-200 text-teal-600 hover:bg-teal-50 shrink-0 flex items-center gap-1.5"
          >
            {locatingGps ? (
              <Loader2 size={14} className="animate-spin text-teal-500" />
            ) : (
              <Navigation size={14} />
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
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors font-medium flex items-start gap-2"
                >
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Container - using explicit height to prevent render bugs in modals */}
        <div className="w-full relative bg-slate-100 border-b border-slate-100 z-10" style={{ height: "360px" }}>
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
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Terpilih</span>
              {reverseGeocoding ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Loader2 size={12} className="animate-spin text-teal-500" />
                  Mencari alamat detail...
                </div>
              ) : selectedAddress ? (
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {selectedAddress.alamatLengkap}
                </p>
              ) : (
                <p className="text-xs text-slate-400 font-medium">Klik pada peta untuk mengambil detail alamat.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
            <div className="text-[10px] font-mono text-slate-400">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 rounded-2xl text-xs font-bold text-slate-500 border-slate-200 hover:bg-slate-100"
              >
                Batal
              </Button>
              <Button
                disabled={!selectedAddress || reverseGeocoding}
                onClick={() => selectedAddress && onConfirm(selectedAddress)}
                className="h-10 px-5 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/15 disabled:opacity-50"
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
