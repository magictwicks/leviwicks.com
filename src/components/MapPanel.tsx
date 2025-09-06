// src/components/MapPanel.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import useLeafletDefaultIcon from "./useLeafletDefaultIcon";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import("react-leaflet").then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import("react-leaflet").then(m => m.Popup),        { ssr: false });

type Pin = { lat: number; lng: number; title: string; slug: string };

export default function MapPanel({ pins = [] as Pin[] }) {
  useLeafletDefaultIcon();
  const mapRef = useRef<any>(null);

  // Fragmented tiles fix: ensure the container has height and invalidate after mount
  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.invalidateSize?.(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="map-shell">
      <MapContainer
        ref={mapRef}
        center={{ lat: 20, lng: 0 }}
        zoom={2}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          crossOrigin="anonymous"
        />
        {pins.map(p => (
          <Marker key={p.slug} position={[p.lat, p.lng]}>
            <Popup><b>{p.title}</b></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
