// src/components/MapPanel.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import useLeafletDefaultIcon from "./useLeafletDefaultIcon";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import("react-leaflet").then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import("react-leaflet").then(m => m.Popup),        { ssr: false });

type Raw = { slug?: any; title?: any; lat?: any; lng?: any; [k: string]: any };
type Pin = { slug: string; title: string; lat: number; lng: number };

export default function MapPanel() {
  useLeafletDefaultIcon();

  const [pins, setPins] = useState<Pin[]>([]);
  const mapRef = useRef<any>(null);
  const center = useMemo(() => ({ lat: 20, lng: 0 }), []);

  // fetch + normalize
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/posts/index", { cache: "no-store" });
        const data = await res.json();
        const raw: Raw[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        const normalized: Pin[] = raw
          .map((r) => ({
            slug: String(r.slug ?? "").trim(),
            title: String(r.title ?? "").trim(),
            lat: Number(r.lat),
            lng: Number(r.lng),
          }))
          .filter((p) =>
            p.slug &&
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng) &&
            Math.abs(p.lat) <= 90 &&
            Math.abs(p.lng) <= 180
          );

        if (!cancel) {
          console.log("[Map] raw count:", raw.length, "normalized:", normalized.length);
          if (normalized.length === 0) {
            console.warn("[Map] No valid pins. First item was:", raw[0]);
          }
          setPins(normalized);
        }
      } catch (e) {
        console.error("[Map] Failed to fetch index:", e);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // ensure tiles aren’t fragmented
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize?.(true), 120);
    return () => clearTimeout(t);
  }, []);

  // fallback pin so you can confirm markers render at all
  const pinsToRender = pins.length ? pins : [{ slug: "test", title: "Test Pin", lat: 12.73604, lng: 80.00831 }];

  return (
    <div className="map-shell h-[70vh] md:h-[80vh]">
      <MapContainer ref={mapRef} center={center} zoom={2} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          crossOrigin="anonymous"
        />
        {pinsToRender.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]}>
            <Popup><strong>{p.title}</strong></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
