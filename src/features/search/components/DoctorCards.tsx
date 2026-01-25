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
import { useAppStore } from "@/stores/useAppStore";
import MCButton from "@/shared/components/forms/MCButton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import { Heart as HeartFilled, Heart as HeartOutlined } from "lucide-react";

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
  const userRole = useAppStore((state) => state.user?.role);
  const [isConnected, setIsConnected] = useState(doctor.isConnected ?? false);
  const [isFavorite, setIsFavorite] = useState(doctor.isFavorite ?? false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const handleConnectToggle = () => {
    setIsConnected((prev) => !prev);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "bg-background border-b transition-all duration-200",
        "p-3 sm:p-4 md:p-5",
        isSelected
          ? "border-b-primary border-b-2 bg-primary/5 dark:bg-primary/10 rounded-t-2xl sm:rounded-t-3xl md:rounded-t-4xl"
          : "border-primary/15 hover:bg-muted/30 active:bg-muted/40",
      )}
    >
      <div className="flex gap-3 sm:gap-4 md:gap-5 h-full">
        {/* Doctor Image - Responsive sizing con clases Tailwind */}
        <div
          className={cn(
            "relative flex-shrink-0",
            "transition-transform duration-300 active:scale-95",
            // Mobile: circular y pequeño
            "w-20 h-20 rounded-full",
            // Tablet: más grande y redondeado
            "sm:w-28 sm:h-28 sm:rounded-2xl",
            // Desktop: aún más grande
            "md:w-32 md:h-32 md:rounded-3xl",
            "lg:w-36 lg:h-36",
          )}
        >
          {/* Imagen del doctor */}
          <img
            src={
              doctor.image ||
              "https://i.pinimg.com/736x/2c/bb/0e/2cbb0ee6c1c55b1041642128c902dadd.jpg"
            }
            alt={doctor.name}
            className={cn(
              "w-full h-full object-cover",
              "transition-transform rounded-full duration-500",
              "hover:scale-110 active:scale-105",
            )}
          />

          {/* FAVORITE ICON - Solo para pacientes */}
          {userRole === "PATIENT" && (
            <button
              onClick={handleFavoriteToggle}
              className={cn(
                "absolute flex items-center justify-center",
                "rounded-full ",
                "bg-black/15 backdrop-blur-xl shadow-2xl",
                "transition-all duration-300",
                "active:scale-90 hover:scale-110",
                "z-10",
                // Posición y tamaño responsive
                "top-0 right-0 p-0.5",
                "sm:top-0 sm:right-0 sm:p-1.5",
                "md:p-2",
              )}
              style={{
                backdropFilter: "blur(16px) saturate(180%) contrast(120%)",
                WebkitBackdropFilter:
                  "blur(16px) saturate(180%) contrast(120%)",
              }}
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
            >
              {isFavorite ? (
                <HeartFilled
                  className={cn(
                    "fill-red-500 text-red-500",
                    "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6",
                  )}
                />
              ) : (
                <HeartOutlined
                  className={cn(
                    "text-white/50 stroke-2",
                    "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6",
                  )}
                />
              )}
            </button>
          )}
        </div>

        {/* Doctor Info - Flexible container */}
        <div className="flex-1 min-w-0">
          {/* Header con nombre y selección */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-semibold text-foreground leading-tight",
                  "hover:underline cursor-pointer",
                  "active:text-primary transition-colors",
                  "text-sm sm:text-base md:text-lg lg:text-xl",
                  "line-clamp-2 sm:line-clamp-1",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/doctor/profile/${doctor.id}`);
                }}
              >
                {doctor.name}
              </h3>

              {/* Rating y especialidad */}
              <div
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap",
                  "text-xs sm:text-sm",
                )}
              >
                <span
                  className={cn(
                    "text-primary font-medium truncate",
                    "max-w-[120px] sm:max-w-[180px] md:max-w-none",
                  )}
                >
                  {doctor.specialty}
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  ·
                </span>
                <div className="flex items-center gap-1">
                  <Star
                    className={cn(
                      "fill-amber-400 text-amber-400",
                      "w-3 h-3 sm:w-4 sm:h-4",
                    )}
                  />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-muted-foreground hidden sm:inline">
                    ({doctor.reviewCount} {t("clinicCard.reviews")})
                  </span>
                </div>
              </div>
            </div>

            {/* Checkbox de selección */}
            {userRole !== "DOCTOR" && userRole !== "CENTER" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(doctor.id);
                }}
                className={cn(
                  "rounded-full border flex items-center justify-center",
                  "transition-all duration-200 flex-shrink-0",
                  "active:scale-90",
                  "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground scale-110"
                    : "border-primary/40 hover:border-primary hover:scale-105",
                )}
                aria-label={
                  isSelected ? "Deseleccionar doctor" : "Seleccionar doctor"
                }
              >
                {isSelected && (
                  <Check
                    className={cn(
                      "stroke-3",
                      "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                    )}
                  />
                )}
              </button>
            )}
          </div>

          {/* Dirección */}
          <div
            className={cn(
              "flex items-start gap-1.5 mt-2 text-muted-foreground",
              "text-xs sm:text-sm",
            )}
          >
            <MapPin
              className={cn(
                "flex-shrink-0 mt-0.5 text-secondary",
                "w-3 h-3 sm:w-4 sm:h-4",
              )}
            />
            {Array.isArray(doctor.address) && doctor.address.length > 1 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate cursor-pointer">
                    {doctor.address[0]}
                    <span className="text-secondary ml-1 hidden sm:inline">
                      {t("clinicCard.andMore", {
                        count: doctor.address.length - 1,
                      })}
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1">
                    {doctor.address.map((addr, idx) => (
                      <span key={idx}>{addr}</span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="line-clamp-1">
                {Array.isArray(doctor.address)
                  ? doctor.address[0]
                  : doctor.address}
              </span>
            )}
          </div>

          {/* Idiomas y Modalidad */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2",
              "text-xs sm:text-sm",
            )}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe
                className={cn("text-secondary", "w-3 h-3 sm:w-4 sm:h-4")}
              />
              {doctor.languages.length > 2 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer">
                      {doctor.languages[0]}
                      <span className="text-secondary ml-1">
                        {t("clinicCard.andOtherLanguages", {
                          count: doctor.languages.length - 1,
                        })}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{doctor.languages.join(", ")}</span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span>{doctor.languages.join(", ")}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Monitor
                className={cn("text-secondary", "w-3 h-3 sm:w-4 sm:h-4")}
              />
              <span>{doctor.modality.join(" / ")}</span>
            </div>
          </div>

          {/* Seguros */}
          <div
            className={cn(
              "flex items-start gap-1.5 mt-2 text-muted-foreground",
              "text-xs sm:text-sm",
            )}
          >
            <Shield
              className={cn(
                "flex-shrink-0 mt-0.5 text-secondary",
                "w-3 h-3 sm:w-4 sm:h-4",
              )}
            />
            <span className="font-medium shrink-0">
              {t("clinicCard.insurances")}
              <span className="hidden sm:inline">
                {t("clinicCard.acceptedInsurances").replace(
                  t("clinicCard.insurances"),
                  "",
                )}
              </span>
            </span>
            {doctor.insurances.length > 2 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer truncate">
                    {doctor.insurances.slice(0, isMobile ? 1 : 2).join(", ")}
                    <span className="text-secondary ml-1">
                      {t("clinicCard.andMore", {
                        count: doctor.insurances.length - (isMobile ? 1 : 2),
                      })}
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{doctor.insurances.join(", ")}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="truncate">{doctor.insurances.join(", ")}</span>
            )}
          </div>

          {/* Disponibilidad */}
          {userRole !== "DOCTOR" && userRole !== "CENTER" && (
            <div className="mt-3 sm:mt-4">
              <div
                className={cn(
                  "flex items-center gap-1.5 mb-2 text-muted-foreground",
                  "text-xs sm:text-sm",
                )}
              >
                <Calendar
                  className={cn("text-secondary", "w-3 h-3 sm:w-4 sm:h-4")}
                />
                <span>
                  {isMobile
                    ? t("doctorCard.availability")
                    : t("doctorCard.availableAvailability")}
                </span>
              </div>
              <div
                className={cn(
                  "flex gap-1.5 sm:gap-2 overflow-x-auto pb-1",
                  "scrollbar-hide -mx-1 px-1",
                  // Smooth scrolling en iOS
                  "snap-x snap-mandatory",
                )}
              >
                {doctor.availability
                  .slice(0, isMobile ? 4 : 6)
                  .map((slot, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col items-center rounded-lg border flex-shrink-0",
                        "transition-all duration-200",
                        "snap-start",
                        // Tamaños responsive
                        "px-2 py-1.5 min-w-[50px]",
                        "sm:px-2.5 sm:py-2 sm:min-w-[60px]",
                        "md:px-3 md:py-2.5 md:min-w-[70px]",
                        slot.slots === 0
                          ? "bg-primary/5 dark:bg-primary/10 border-primary/10 text-primary/25 cursor-not-allowed"
                          : "bg-accent text-accent-foreground border-border cursor-pointer hover:border-primary hover:bg-accent/80 active:bg-accent/70 active:scale-95",
                      )}
                      onClick={(e) => slot.slots > 0 && e.preventDefault()}
                      tabIndex={slot.slots === 0 ? -1 : 0}
                      aria-disabled={slot.slots === 0}
                    >
                      <span
                        className={cn(
                          "font-medium",
                          "text-[10px] sm:text-xs md:text-sm",
                        )}
                      >
                        {isMobile ? slot.dayName.substring(0, 3) : slot.dayName}
                      </span>
                      <span className="text-muted-foreground text-[9px] sm:text-[10px]">
                        {slot.date}
                      </span>
                      <span
                        className={cn(
                          "mt-1 font-semibold",
                          "text-xs sm:text-sm md:text-base",
                          slot.slots === 0
                            ? "text-muted-foreground"
                            : "text-primary dark:text-black",
                        )}
                      >
                        {slot.slots === 0
                          ? t("doctorCard.noSlots")
                          : slot.slots}
                      </span>
                      <span className="text-muted-foreground text-[9px] sm:text-[10px]">
                        {t("doctorCard.appointments")}
                      </span>
                    </div>
                  ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(doctor.id);
                  }}
                  className={cn(
                    "flex items-center justify-center rounded-lg border border-primary/5",
                    "font-medium text-foreground transition-all flex-shrink-0",
                    "hover:bg-primary/10 hover:border-primary/40 hover:text-primary",
                    "active:bg-primary/20 active:scale-95",
                    "snap-start",
                    // Tamaños responsive
                    "px-2.5 py-1.5 min-w-[50px] text-xs",
                    "sm:px-3 sm:py-2 sm:min-w-[60px] sm:text-sm",
                    "md:px-4 md:py-2.5 md:min-w-[70px]",
                  )}
                >
                  {t("doctorCard.more")}
                </button>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className={cn("flex gap-2 sm:gap-3", "mt-3 sm:mt-4")}>
            {userRole === "CENTER" ? (
              <>
                <MCButton
                  variant={isConnected ? "primary" : "outline"}
                  size={isMobile ? "xs" : "sm"}
                  className={cn(
                    "flex-1 transition-all active:scale-95",
                    "text-xs sm:text-sm",
                    "px-3 sm:px-4",
                    isConnected &&
                      "bg-secondary hover:bg-secondary/90 text-white border-none active:bg-secondary/80",
                    !isConnected &&
                      "border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary/80 active:bg-secondary/20",
                  )}
                  onClick={handleConnectToggle}
                >
                  {isConnected
                    ? t("clinicCard.connected")
                    : t("clinicCard.connect")}
                </MCButton>
                <MCButton
                  variant="outline"
                  size={isMobile ? "xs" : "sm"}
                  className={cn(
                    "flex-1 transition-all active:scale-95",
                    "text-xs sm:text-sm",
                    "px-3 sm:px-4",
                  )}
                  onClick={() => navigate(`/doctor/profile/${doctor.id}`)}
                >
                  {t("clinicCard.viewProfile")}
                </MCButton>
              </>
            ) : (
              userRole !== "PATIENT" && (
                <MCButton
                  variant="outline"
                  size={isMobile ? "xs" : "sm"}
                  className={cn(
                    "flex-1 transition-all active:scale-95",
                    "text-xs sm:text-sm",
                    "px-3 sm:px-4",
                  )}
                  onClick={() => navigate(`/doctor/profile/${doctor.id}`)}
                >
                  {t("clinicCard.viewProfile")}
                </MCButton>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
