"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Icons ─────────────────────────────────────────────────

const workerIcon = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:24px;height:24px;">
            <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;opacity:0.25;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:4px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 12px rgba(59,130,246,0.6);"></div>
        </div>
        <style>@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}</style>
    `,
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -16],
});

const bountyIcon = L.divIcon({
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
                font-size:11px;line-height:1;">⚡</div>
        </div>
    `,
    iconSize: [36, 44], iconAnchor: [18, 44], popupAnchor: [0, -46],
});

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
    emoji: string;
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

            {/* Worker location marker */}
            <Marker position={[lat, lng]} icon={workerIcon}>
                <Popup>
                    <div style={{ minWidth: 160, fontFamily: "inherit" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                            📍 Posisi Kamu
                        </p>
                        <p style={{ fontSize: 11, color: "#6b7280" }}>
                            Menara Cyber 2 Lt. 18, Kuningan
                        </p>
                        <div style={{ marginTop: 6, padding: "4px 8px", background: "#eff6ff", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                            <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a" }}>Online · Siap ambil bounty</span>
                        </div>
                    </div>
                </Popup>
            </Marker>

            {/* Bounty markers — detail popup */}
            {bounties.map((b) => (
                <Marker key={b.id} position={[b.lat, b.lng]} icon={bountyIcon}>
                    <Popup maxWidth={240}>
                        <div style={{ minWidth: 210, fontFamily: "inherit" }}>

                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 18, lineHeight: 1 }}>{b.emoji}</span>
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
                                <button
                                    style={{
                                        background: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "6px 14px",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    Ambil Bounty →
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
