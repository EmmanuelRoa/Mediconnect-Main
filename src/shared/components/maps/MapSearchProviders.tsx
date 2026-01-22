import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { type Provider } from "@/data/providers";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapSearchProvidersProps {
  providers: Provider[];
  selectedProviders?: string[];
  onProviderSelect?: (id: string) => void;
}

export default function MapSearchProviders({
  providers,
  selectedProviders = [],
  onProviderSelect,
}: MapSearchProvidersProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-69.93, 18.48], // Santo Domingo, RD
      zoom: 12,
    });

    // Limpiar markers anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    providers.forEach((provider) => {
      const isSelected = selectedProviders.includes(provider.id);

      const marker = new mapboxgl.Marker({
        color: provider.type === "doctor" ? "#2563eb" : "#16a34a",
        scale: isSelected ? 1.2 : 1,
      })
        .setLngLat([provider.coordinates.lng, provider.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(`
            <div class="p-2">
              <div class="flex items-center gap-2 mb-2">
                <img src="${provider.image}" alt="${provider.name}" 
                     class="w-10 h-10 rounded-full object-cover" />
                <div>
                  <strong class="text-sm">${provider.name}</strong><br/>
                  <span class="text-xs text-gray-600">
                    ${provider.type === "doctor" ? (provider as any).specialty : "Centro médico"}
                  </span>
                </div>
              </div>
              <div class="text-xs text-gray-500 mb-2">
                <div>📍 ${provider.address}</div>
                <div>⭐ ${provider.rating} ${provider.reviewCount ? `(${provider.reviewCount} reseñas)` : ""}</div>
              </div>
              <button 
                onclick="window.selectProvider && window.selectProvider('${provider.id}')"
                class="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                ${isSelected ? "Seleccionado" : "Seleccionar"}
              </button>
            </div>
          `),
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Función global para manejar selección desde popup
    (window as any).selectProvider = (id: string) => {
      onProviderSelect?.(id);
    };

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef.current?.remove();
      delete (window as any).selectProvider;
    };
  }, [providers, selectedProviders, onProviderSelect]);

  // Ajustar vista cuando cambian los providers
  useEffect(() => {
    if (!mapRef.current || providers.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    providers.forEach((provider) => {
      bounds.extend([provider.coordinates.lng, provider.coordinates.lat]);
    });

    mapRef.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
    });
  }, [providers]);

  return <div ref={containerRef} className="h-full w-full rounded-xl" />;
}
