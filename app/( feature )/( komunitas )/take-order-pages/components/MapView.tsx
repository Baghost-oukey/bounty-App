"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Icons ─────────────────────────────────────────────────

// Emerald green marker for worker position (GPS location)
const workerIcon = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:24px;height:24px;">
            <div style="position:absolute;inset:0;background:#10b981;border-radius:50%;opacity:0.25;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:4px;background:#10b981;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 12px rgba(16,185,129,0.6);"></div>
        </div>
        <style>@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}</style>
    `,
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -16],
});

// Modern Blue-600 bounty marker creator
const createBountyIcon = (emoji: string) => {
    return L.divIcon({
        className: "",
        html: `
            <div style="position:relative;width:40px;height:40px;">
                <!-- Outer glowing pulse ring -->
                <div style="
                    position:absolute;inset:-8px;
                    background:rgba(37,99,235,0.18);
                    border-radius:50%;
                    animation:modPulse 2s cubic-bezier(0.16,1,0.3,1) infinite;
                "></div>
                
                <!-- Main circular body with gradient border -->
                <div style="
                    position:absolute;inset:0;
                    background:linear-gradient(135deg,#3b82f6,#2563eb);
                    border-radius:50%;
                    border:2.5px solid #ffffff;
                    box-shadow:0 6px 20px rgba(37,99,235,0.45), inset 0 2px 4px rgba(255,255,255,0.3);
                    display:flex;align-items:center;justify-content:center;
                    transition:transform 0.2s ease;
                " class="bounty-marker-body">
                    
                    <!-- Inner circle with mini-icon -->
                    <div style="
                        width:24px;height:24px;
                        background:rgba(255,255,255,0.95);
                        border-radius:50%;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;
                        box-shadow:0 2px 6px rgba(0,0,0,0.06);
                    ">${emoji}</div>
                </div>
                
                <!-- Small pointer tip at bottom -->
                <div style="
                    position:absolute;bottom:-4px;left:50%;transform:translateX(-50%) rotate(45deg);
                    width:8px;height:8px;
                    background:#2563eb;
                    border-right:2px solid #ffffff;
                    border-bottom:2px solid #ffffff;
                    box-shadow:2px 2px 4px rgba(37,99,235,0.2);
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

// ── Map helpers ───────────────────────────────────────────

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => { map.setView([lat, lng], 14, { animate: true }); }, [lat, lng, map]);
    return null;
}

// ── Types ─────────────────────────────────────────────────

export interface BountyMarker {
    id: string;
    lat: number;
    lng: number;
    emoji?: string;
    layanan: string;
    tugas: string;
    lokasi: string;
    jadwal: string;
    budget: number;
    pesaing: number;
    jarak: string;
}

interface MapViewProps {
    lat: number;
    lng: number;
    bounties?: BountyMarker[];
}

const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

// ── Component ─────────────────────────────────────────────

export default function MapView({ lat, lng, bounties = [] }: MapViewProps) {
    return (
        <MapContainer
            center={[lat, lng]} zoom={14}
            scrollWheelZoom zoomControl={false}
            attributionControl={false}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd" maxZoom={20}
            />
            <RecenterMap lat={lat} lng={lng} />

            {/* Worker location marker — emerald green pulse */}
            <Marker position={[lat, lng]} icon={workerIcon}>
                <Popup>
                    <div style={{ minWidth: 160, fontFamily: "inherit" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                            📍 Posisi Kamu
                        </p>
                        <p style={{ fontSize: 11, color: "#6b7280" }}>
                            Menara Cyber 2 Lt. 18, Kuningan
                        </p>
                        <div style={{ marginTop: 6, padding: "4px 8px", background: "#f0fdf4", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                            <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a" }}>Online · Siap ambil bounty</span>
                        </div>
                    </div>
                </Popup>
            </Marker>

            {/* Bounty markers — dynamic emoji blue pins */}
            {bounties.map((b) => {
                const emoji = b.emoji || getServiceEmoji(b.layanan);
                return (
                    <Marker key={b.id} position={[b.lat, b.lng]} icon={createBountyIcon(emoji)}>
                        <Popup maxWidth={240}>
                            <div style={{ minWidth: 210, fontFamily: "inherit" }}>

                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
                                    <div>
                                        <p style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                            {b.layanan}
                                        </p>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>
                                            Bounty Tersedia
                                        </p>
                                    </div>
                                </div>

                                {/* Task description */}
                                <p style={{ fontSize: 12, color: "#374151", marginBottom: 8, lineHeight: 1.5, borderLeft: "3px solid #2563eb", paddingLeft: 8 }}>
                                    {b.tugas}
                                </p>

                                {/* Detail rows */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "#6b7280", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span>📍</span>
                                        <span>{b.lokasi}</span>
                                        {b.jarak !== "—" && (
                                            <span style={{ color: "#2563eb", fontWeight: 700, marginLeft: 2 }}>· {b.jarak}</span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span>🕐</span>
                                        <span>{b.jadwal}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span>⚡</span>
                                        <span>{b.pesaing} pekerja lain sedang minat</span>
                                    </div>
                                </div>

                                {/* Budget + CTA */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
                                    <div>
                                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Budget</p>
                                        <p style={{ fontSize: 15, fontWeight: 700, color: "#2563eb", margin: 0 }}>
                                            {formatRupiah(b.budget)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
