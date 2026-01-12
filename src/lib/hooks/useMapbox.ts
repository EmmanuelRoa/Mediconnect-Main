import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface UseMapboxProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  center: [number, number];
  zoom?: number;
}

export function useMapbox({ containerRef, center, zoom = 12 }: UseMapboxProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return mapRef;
}
