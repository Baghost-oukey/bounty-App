"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Pulse marker icon (blue)
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
}

export default function MapView({ lat, lng, address }: MapViewProps) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ width: "100%", height: "100%" }}
        >
            {/* CartoDB Positron — clean, minimal, light tile */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
            />
            <RecenterMap lat={lat} lng={lng} />
            <Marker position={[lat, lng]} icon={pulseIcon}>
                <Popup>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{address}</span>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
