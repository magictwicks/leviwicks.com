// src/components/useLeafletDefaultIcon.ts
"use client";
import { useEffect } from "react";
import L from "leaflet";

export default function useLeafletDefaultIcon() {
  useEffect(() => {
    // Prevent old _getIconUrl logic interfering
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
      iconUrl: "/leaflet/images/marker-icon.png",
      shadowUrl: "/leaflet/images/marker-shadow.png",
    });
  }, []);
}
