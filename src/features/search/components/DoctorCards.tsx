import {
  Star,
  MapPin,
  Globe,
  Monitor,
  Shield,
  Calendar,
  Check,
} from "lucide-react";
import { type Doctor } from "@/data/providers";
import { cn } from "@/lib/utils";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import MCBackButton from "@/shared/components/forms/MCBackButton";
import MCButton from "@/shared/components/forms/MCButton";
import { Button } from "@/shared/ui/button";
interface DoctorCardsProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export const DoctorCards = ({
  doctor,
  isSelected,
  onSelect,
  onViewProfile,
}: DoctorCardsProps) => {
  return (
    <div
      className={cn(
        "bg-background p-4 border-b transition-all duration-200",
        isSelected
          ? "border-b-primary border-b-2 bg-primary/5 dark:bg-primary/10 rounded-t-4xl "
          : "border-primary/15  hover:bg-muted/30  ",
      )}
    >
      <div className="flex gap-4 h-full">
        {/* Doctor Image */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/5">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-30 h-full md:w-45 md:h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <img
              src="https://i.pinimg.com/736x/2c/bb/0e/2cbb0ee6c1c55b1041642128c902dadd.jpg"
              alt="Doctor por defecto"
              className="w-30 h-full md:w-45 md:h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground text-base md:text-lg leading-tight">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary text-sm">{doctor.specialty}</span>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({doctor.reviewCount} reseñas)
                  </span>
                </div>
              </div>
            </div>

            {/* Selection checkbox */}
            <button
              onClick={() => onSelect(doctor.id)}
              className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center transition-all flex-shrink-0",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground scale-110"
                  : "border-primary/40 hover:border-primary hover:scale-105",
              )}
            >
              {isSelected && <Check className="w-4 h-4" />}
            </button>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
            <span className="line-clamp-1">
              {doctor.address}
              {doctor.additionalLocations && (
                <span className="text-primary ml-1">
                  y otras {doctor.additionalLocations} ubicaciones
                </span>
              )}
            </span>
          </div>

          {/* Languages & Modality */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-4 h-4 text-secondary" />
              <span>{doctor.languages.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Monitor className="w-4 h-4 text-secondary" />
              <span>{doctor.modality.join(" / ")}</span>
            </div>
          </div>

          {/* Insurances */}
          <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
            <span className="line-clamp-1">
              <span className="font-medium">Seguros aceptados:</span>{" "}
              {doctor.insurances.join(", ") || "--"}
            </span>
          </div>

          {/* Availability */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Disponibilidad disponible:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {doctor.availability.slice(0, 6).map((slot, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col items-center min-w-[50px] px-2 py-1.5 rounded-lg text-xs",
                    slot.slots === 0
                      ? "bg-primary/5 dark:bg-primary/10 border-primary/10  text-primary/25   cursor-not-allowed"
                      : "bg-accent text-accent-foreground border-border hover:border-primary cursor-pointer transition-colors",
                  )}
                >
                  <span className="font-medium">{slot.dayName}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {slot.date}
                  </span>
                  <span
                    className={cn(
                      "mt-1 font-semibold",
                      slot.slots === 0
                        ? "text-muted-foreground"
                        : "text-primary dark:text-black",
                    )}
                  >
                    {slot.slots === 0 ? "No" : slot.slots}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    Citas
                  </span>
                </div>
              ))}
              <button
                onClick={() => onViewProfile(doctor.id)}
                className="flex items-center justify-center min-w-[50px] px-3 py-1.5 rounded-lg hover:border   hover:border-primary/15 text-sm font-medium text-foreground transition-colors"
              >
                Más
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
