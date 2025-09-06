"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import L from "leaflet";

function useLeafletDefaultIcon() {
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);
}

useLeafletDefaultIcon();

// react-leaflet needs window → dynamic import to avoid SSR
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker       = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup        = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type PostPin = {
  slug: string;
  title: string;
  lat: number;
  lng: number;
  cover_image?: string;
  // cover_signed?: string; // if you generate signed URLs
};

export default function MapPanel() {
  const router = useRouter();
  const [pins, setPins] = useState<PostPin[]>([]);
  const center = useMemo(() => ({ lat: 20.0, lng: 0.0 }), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/posts/index", { cache: "no-store" });
      const data = await res.json();
      if (!cancelled) setPins(data.items || []);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="h-[80vh] w-full rounded-xl overflow-hidden">
      <MapContainer center={center} zoom={2} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]}>
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-semibold mb-2">{p.title}</h3>
                {/* If public images or signed URLs available */}
                {/* <img src={p.cover_signed || p.cover_image} alt="" className="mb-2 rounded" /> */}
                <button
                  className="underline"
                  onClick={() => router.push(`/posts/${p.slug}`)}
                >
                  Read post →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
