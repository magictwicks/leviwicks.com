"use client"

import dynamic from "next/dynamic";

const MapPanel = dynamic(() => import("@/components/MapPanel"), { ssr: false });

export default function Home() {
  return (
    <main className="grid p-6">
      <div className="order-1 md:order-2">
        <MapPanel />
      </div>
    </main>
  );
}
