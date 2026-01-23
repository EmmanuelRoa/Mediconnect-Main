import React, { useState } from "react";
import { Star, MapPin, Globe, Heart, Building2, Video } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { type Doctor } from "@/data/providers";

type DoctorPopupProps = {
  provider: Doctor;
};

const DoctorPopup: React.FC<DoctorPopupProps> = ({ provider }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Manejo de ubicaciones
  const locations =
    Array.isArray(provider.address) && provider.address.length > 0
      ? provider.address
      : [typeof provider.address === "string" ? provider.address : ""];

  // Modalidad
  const modalities = provider.modality.map((m) => m.toLowerCase());

  // Disponibilidad simplificada para slots
  const slots =
    provider.availability?.map((slot) => ({
      day: slot.dayName,
      date: slot.date,
      count: slot.slots,
    })) ?? [];

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 border border-border max-w-xs">
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Favorito */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-card transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "fill-destructive text-destructive"
                : "text-muted-foreground hover:text-destructive"
            }`}
          />
        </button>
        {/* Modalidad */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {modalities.includes("presencial") && (
            <div
              className="w-6 h-6 rounded bg-card/95 flex items-center justify-center shadow"
              title="Presencial"
            >
              <Building2 className="w-3 h-3 text-foreground" />
            </div>
          )}
          {modalities.includes("virtual") && (
            <div
              className="w-6 h-6 rounded bg-success/90 flex items-center justify-center shadow"
              title="Virtual"
            >
              <Video className="w-3 h-3 text-success-foreground" />
            </div>
          )}
        </div>
      </div>
      {/* Contenido */}
      <div className="p-2 space-y-2">
        {/* Nombre y especialidad */}
        <div>
          <Badge className="text-[10px] mb-1">{provider.specialty}</Badge>
          <h3 className="text-base font-semibold text-foreground leading-tight">
            {provider.name}
          </h3>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-rating text-rating" />
          <span className="text-xs font-bold text-foreground">
            {provider.rating}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ({provider.reviewCount ?? 0})
          </span>
        </div>
        {/* Ubicación */}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-medical" />
          <span className="line-clamp-1">{locations[0]}</span>
          {locations.length > 1 && (
            <span className="text-medical font-medium flex-shrink-0">
              +{locations.length - 1}
            </span>
          )}
        </div>
        {/* Idiomas */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="w-3 h-3 flex-shrink-0 text-medical" />
          <span>{provider.languages.join(", ")}</span>
        </div>
        {/* Seguros */}
        <div className="pt-1 border-t border-border">
          <p className="text-[10px] text-muted-foreground mb-1">Seguros:</p>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {provider.insurances.map((insurance, idx) => (
              <Badge key={idx} className="text-[10px] whitespace-nowrap">
                {insurance}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPopup;
