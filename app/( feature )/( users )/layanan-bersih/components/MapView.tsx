"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Blue pulse — lokasi user
const pulseIcon = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:24px;height:24px;">
            <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;opacity:0.25;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:4px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 12px rgba(59,130,246,0.6);"></div>
        </div>
        <style>@keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}</style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
});

// Orange bounty marker — visible to workers
const bountyIcon = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:36px;height:44px;">
            <!-- Pin shape -->
            <div style="
                position:absolute;top:0;left:50%;transform:translateX(-50%);
                width:36px;height:36px;
                background:linear-gradient(135deg,#f97316,#ea580c);
                border-radius:50% 50% 50% 0;
                transform:translateX(-50%) rotate(-45deg);
                border:3px solid white;
                box-shadow:0 4px 16px rgba(249,115,22,0.5);
            "></div>
            <!-- Inner icon -->
            <div style="
                position:absolute;top:5px;left:50%;transform:translateX(-50%);
                width:22px;height:22px;
                background:white;border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                font-size:12px;line-height:1;
            ">🧹</div>
            <!-- Outer ring pulse -->
            <div style="
                position:absolute;top:-4px;left:50%;transform:translateX(-50%);
                width:44px;height:44px;
                background:#f97316;border-radius:50%;
                opacity:0.2;
                animation:bouncePing 2s ease-in-out infinite;
            "></div>
        </div>
        <style>
            @keyframes bouncePing {
                0%,100%{transform:translateX(-50%) scale(0.8);opacity:0.2}
                50%{transform:translateX(-50%) scale(1.1);opacity:0.1}
            }
        </style>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15, { animate: true });
    }, [lat, lng, map]);
    return null;
}

interface MapViewProps {
    lat: number;
    lng: number;
    address: string;
    bountyActive?: boolean;
    bountyLabel?: string;
}

export default function MapView({ lat, lng, address, bountyActive = false, bountyLabel }: MapViewProps) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
            />
            <RecenterMap lat={lat} lng={lng} />

            {/* Lokasi user — blue pulse */}
            {!bountyActive && (
                <Marker position={[lat, lng]} icon={pulseIcon}>
                    <Popup>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{address}</span>
                    </Popup>
                </Marker>
            )}

            {/* Bounty marker — orange pin, visible after posting */}
            {bountyActive && (
                <Marker position={[lat, lng]} icon={bountyIcon}>
                    <Popup>
                        <div style={{ minWidth: 160 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#ea580c", marginBottom: 2 }}>
                                 Bounty Aktif
                            </p>
                            <p style={{ fontSize: 11, color: "#374151", marginBottom: 2 }}>{address}</p>
                            {bountyLabel && (
                                <p style={{ fontSize: 11, color: "#6b7280" }}>{bountyLabel}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
