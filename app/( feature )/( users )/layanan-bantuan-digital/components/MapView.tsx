"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Emerald Green pulse — lokasi user (GPS)
const pulseIcon = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:24px;height:24px;">
            <div style="position:absolute;inset:0;background:#10b981;border-radius:50%;opacity:0.25;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:4px;background:#10b981;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 12px rgba(16,185,129,0.6);"></div>
        </div>
        <style>@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}</style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
});

// Modern Blue-600 dynamic bounty marker creator
const createBountyIcon = (emoji: string) => {
    return L.divIcon({
        className: "",
        html: `
            <div style="position:relative;width:40px;height:40px;">
                <div style="
                    position:absolute;inset:-8px;
                    background:rgba(37,99,235,0.18);
                    border-radius:50%;
                    animation:modPulse 2s cubic-bezier(0.16,1,0.3,1) infinite;
                "></div>
                <div style="
                    position:absolute;inset:0;
                    background:linear-gradient(135deg,#3b82f6,#2563eb);
                    border-radius:50%;
                    border:2.5px solid #ffffff;
                    box-shadow:0 6px 20px rgba(37,99,235,0.45), inset 0 2px 4px rgba(255,255,255,0.3);
                    display:flex;align-items:center;justify-content:center;
                    transition:transform 0.2s ease;
                " class="bounty-marker-body">
                    <div style="
                        width:24px;height:24px;
                        background:rgba(255,255,255,0.95);
                        border-radius:50%;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;
                        box-shadow:0 2px 6px rgba(0,0,0,0.06);
                    ">${emoji}</div>
                </div>
                <div style="
                    position:absolute;bottom:-4px;left:50%;transform:translateX(-50%) rotate(45deg);
                    width:8px;height:8px;
                    background:#2563eb;
                    border-right:2px solid #ffffff;
                    border-bottom:2px solid #ffffff;
                "></div>
            </div>
            <style>
                @keyframes modPulse {
                    0%{transform:scale(0.85);opacity:0.8}
                    100%{transform:scale(1.4);opacity:0}
                }
                .bounty-marker-body:hover {
                    transform:scale(1.1);
                }
            </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

const getServiceEmoji = (layanan: string) => {
    const l = layanan.toLowerCase();
    if (l.includes("bersih")) return "🧹";
    if (l.includes("antar") || l.includes("jemput")) return "🚗";
    if (l.includes("titip") || l.includes("jastip")) return "🛍️";
    if (l.includes("digital") || l.includes("bantuan")) return "💻";
    if (l.includes("bimbingan") || l.includes("belajar")) return "📚";
    if (l.includes("kerja") || l.includes("tenaga")) return "🛠️";
    return "⚡";
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15, { animate: true });
    }, [lat, lng, map]);
    return null;
}

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

interface ActiveBountyMarker {
    id: string;
    lat: number;
    lng: number;
    tugas: string;
    lokasi: string;
    budget: number;
    layanan: string;
}

interface MapViewProps {
    lat: number;
    lng: number;
    address: string;
    activeBounties: ActiveBountyMarker[];
}

export default function MapView({ lat, lng, address, activeBounties = [] }: MapViewProps) {
    return (
        <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom zoomControl={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
            />
            <RecenterMap lat={lat} lng={lng} />

            {/* GPS User Pin */}
            <Marker position={[lat, lng]} icon={pulseIcon}>
                <Popup><span style={{ fontSize: 12, fontWeight: 600 }}>{address}</span></Popup>
            </Marker>

            {/* Active Pins */}
            {activeBounties.map((b) => (
                <Marker key={b.id} position={[b.lat, b.lng]} icon={createBountyIcon(getServiceEmoji(b.layanan || ""))}>
                    <Popup>
                        <div style={{ minWidth: 160 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>
                                 Bounty Aktif ({b.layanan})
                            </p>
                            <p style={{ fontSize: 11, color: "#374151", marginBottom: 2 }}>{b.lokasi}</p>
                            <p style={{ fontSize: 11, color: "#6b7280" }}>{b.tugas}</p>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginTop: 4 }}>
                                {formatRupiah(b.budget)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
