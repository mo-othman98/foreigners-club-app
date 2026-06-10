"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const timers = [0, 100, 400].map((ms) =>
      setTimeout(() => {
        map.invalidateSize();
      }, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [map]);

  return null;
}
