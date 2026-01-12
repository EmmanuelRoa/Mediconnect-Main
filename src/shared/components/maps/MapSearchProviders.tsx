import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface Provider {
  id: string;
  name: string;
  type: "doctor" | "center";
  specialty?: string;
  lat: number;
  lng: number;
}

export default function MapSearchProviders({
  providers,
}: {
  providers: Provider[];
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-69.93, 18.48],
      zoom: 12,
    });

    providers.forEach((p) => {
      new mapboxgl.Marker({
        color: p.type === "doctor" ? "#2563eb" : "#16a34a",
      })
        .setLngLat([p.lng, p.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(`
            <strong>${p.name}</strong><br/>
            ${p.specialty ?? "Centro médico"}<br/>
            <button onclick="alert('Agendar ${p.id}')">
              Agendar cita
            </button>
          `)
        )
        .addTo(mapRef.current!);
    });

    return () => mapRef.current?.remove();
  }, [providers]);

  return <div ref={containerRef} className="h-[450px] rounded-xl" />;
}
