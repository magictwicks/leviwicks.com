// src/components/MapPanel.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import useLeafletDefaultIcon from "./useLeafletDefaultIcon";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import("react-leaflet").then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import("react-leaflet").then(m => m.Popup),        { ssr: false });

type Raw = { slug?: any; title?: any; lat?: any; lng?: any; summary?: any; cover_image?: any };
type Pin = { slug: string; title: string; lat: number; lng: number; summary?: string; cover?: string };

function imgUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  // GCS is private → proxy through your API
  return `/api/image?path=${encodeURIComponent(path)}`;
}

export default function MapPanel() {
  useLeafletDefaultIcon();

  const [pins, setPins] = useState<Pin[]>([]);
  const mapRef = useRef<any>(null);
  const center = useMemo(() => ({ lat: 20, lng: 0 }), []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const res = await fetch("/api/posts/index", { cache: "no-store" });
      const data = await res.json();
      const raw: Raw[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const normalized: Pin[] = raw
        .map(r => ({
          slug: String(r.slug ?? "").trim(),
          title: String(r.title ?? "").trim(),
          summary: r.summary ? String(r.summary) : undefined,
          lat: Number(r.lat),
          lng: Number(r.lng),
          cover: r.cover_image ? imgUrl(String(r.cover_image)) : undefined,
        }))
        .filter(p =>
          p.slug &&
          Number.isFinite(p.lat) &&
          Number.isFinite(p.lng) &&
          Math.abs(p.lat) <= 90 &&
          Math.abs(p.lng) <= 180
        );

      if (!cancel) setPins(normalized);
    })();
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize?.(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="map-shell h-[70vh] md:h-[80vh]">
      <MapContainer ref={mapRef} center={center} zoom={2} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          crossOrigin="anonymous"
        />
        {pins.map(p => (
          <Marker key={p.slug} position={[p.lat, p.lng]}>
            <Popup>
              <div className="min-w-[200px] max-w-[260px] space-y-2">
                {p.cover && (
                  <img
                    src={p.cover}
                    alt=""
                    className="block w-full h-auto rounded"
                    loading="lazy"
                  />
                )}
                <h3 className="m-0 font-semibold text-base">{p.title}</h3>
                {p.summary && (
                  <p className="m-0 text-sm opacity-80 line-clamp-3">{p.summary}</p>
                )}
                <a href={`/posts/${p.slug}`} className="inline-block text-sm underline">
                  Read post →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
