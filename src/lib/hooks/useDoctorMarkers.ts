import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Provider {
  id: string;
  name: string;
  type: "doctor" | "center";
  specialty?: string;
  lat: number;
  lng: number;
}

interface Props {
  map: mapboxgl.Map | null;
  providers: Provider[];
  onSelect?: (provider: Provider) => void;
}

export function useDoctorMarkers({ map, providers, onSelect }: Props) {
  useEffect(() => {
    if (!map) return;

    const markers: mapboxgl.Marker[] = [];

    providers.forEach((p) => {
      const marker = new mapboxgl.Marker({
        color: p.type === "doctor" ? "#2563eb" : "#16a34a",
      })
        .setLngLat([p.lng, p.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(`
            <strong>${p.name}</strong><br/>
            ${p.specialty ?? "Centro médico"}<br/>
            <button id="provider-${p.id}">
              Ver detalle
            </button>
          `)
        )
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        onSelect?.(p);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, providers]);
}
