"use client"

import dynamic from "next/dynamic";

const MapPanel = dynamic(() => import("@/components/MapPanel"), { ssr: false });

export default function Home() {
  return (
    <main className="grid p-6">
      <div className="map-shell h-[70vh] md:h-[80vh]">
        <MapPanel/>
      </div>
    </main>
  );
}
