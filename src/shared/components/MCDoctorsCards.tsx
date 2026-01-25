import { useTranslation } from "react-i18next";
import { Card, CardContent, CardTitle } from "@/shared/ui/card";
import { Star, Languages, ShieldCheck, Stethoscope } from "lucide-react";
import MCButton from "./forms/MCButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Heart as HeartFilled, Heart as HeartOutlined } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

export type DoctorCardVariant = "s" | "m" | "default";

interface Doctor {
  key?: number;
  name: string;
  specialty: string;
  rating: number;
  yearsOfExperience?: number;
  languages?: string[];
  insuranceAccepted?: string[];
  isFavorite?: boolean;
  urlImage?: string;
  variant?: DoctorCardVariant;
  lastAppointment?: string;
  onToggleFavorite?: () => void;
}

const VARIANT_STYLES = {
  s: {
    imageHeight: "h-32 sm:h-28",
    title: "text-sm sm:text-base",
    subtitle: "text-xs",
    gap: "gap-1.5",
    buttonSize: "xs" as const,
    showExtraInfo: false,
    padding: "pt-2 pb-2 px-3",
  },
  m: {
    imageHeight: "h-40 sm:h-48",
    title: "text-base sm:text-lg",
    subtitle: "text-sm",
    gap: "gap-2",
    buttonSize: "xs" as const,
    showExtraInfo: true,
    padding: "pt-3 pb-2 px-3 sm:px-4",
  },
  default: {
    imageHeight: "h-48 sm:h-56 md:h-64",
    title: "text-lg sm:text-xl",
    subtitle: "text-base sm:text-lg",
    gap: "gap-2",
    buttonSize: "s" as const,
    showExtraInfo: true,
    padding: "pt-3 pb-3 px-4",
  },
};

function MCDoctorsCards({
  name,
  specialty,
  rating,
  yearsOfExperience,
  languages,
  insuranceAccepted,
  isFavorite,
  urlImage,
  variant = "default",
  lastAppointment,
  onToggleFavorite,
}: Doctor) {
  const styles = VARIANT_STYLES[variant];
  const isMobile = useIsMobile();
  const { t } = useTranslation("patient");

  const userRole = useAppStore((state) => state.user?.role);

  return (
    <Card className="rounded-2xl sm:rounded-3xl bg-card dark:bg-card border border-border dark:border-border shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
      {/* IMAGEN Y FAVORITO */}
      <div className="relative overflow-hidden">
        {urlImage ? (
          <img
            src={urlImage}
            alt={name}
            className={`w-full object-cover transition-transform duration-500 hover:scale-105 ${styles.imageHeight}`}
          />
        ) : (
          <div
            className={`
              flex items-center justify-center w-full
              ${styles.imageHeight} 
              bg-muted dark:bg-muted
            `}
          >
            <div className="min-w-[96px] w-full">
              <MCUserAvatar
                name={name}
                square
                size={
                  isMobile
                    ? 96
                    : variant === "s"
                      ? 56
                      : variant === "m"
                        ? 96
                        : 128
                }
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        )}

        {/* BOTÓN FAVORITO - Mejorado para dark mode */}
        {userRole === "PATIENT" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className={`
              absolute top-2 right-2 sm:top-3 sm:right-3
              flex items-center justify-center
              w-9 h-9 sm:w-10 sm:h-10
              rounded-full 
              bg-white/80 dark:bg-black/60
              backdrop-blur-md
              border border-white/20 dark:border-white/10
              shadow-lg
              transition-all duration-300 ease-out
              hover:scale-110 hover:bg-white dark:hover:bg-black/80
              active:scale-95
              z-20
            `}
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
            }
          >
            {isFavorite ? (
              <HeartFilled
                size={isMobile ? 18 : 20}
                fill="#ef4444"
                className="text-red-500"
              />
            ) : (
              <HeartOutlined
                size={isMobile ? 18 : 20}
                className="text-gray-600 dark:text-gray-300 stroke-2"
              />
            )}
          </button>
        )}

        {/* BADGE DE RATING - Overlay en la imagen */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-md">
          <Star size={14} fill="#F7B500" className="text-[#F7B500]" />
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
            {rating}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className={styles.padding}>
        {/* HEADER */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <CardTitle
              className={`font-semibold text-foreground dark:text-foreground truncate ${styles.title}`}
            >
              {name}
            </CardTitle>
            <p
              className={`text-muted-foreground dark:text-muted-foreground truncate ${styles.subtitle}`}
            >
              {specialty}
            </p>
          </div>
        </div>

        {/* DIVIDER - Solo en variant default */}
        {variant === "default" && (
          <div className="my-2 sm:my-3 h-px w-full bg-gradient-to-r from-transparent via-border dark:via-border to-transparent" />
        )}

        {/* BODY - Información adicional */}
        <div
          className={`flex flex-col text-foreground dark:text-foreground ${styles.gap}`}
        >
          {/* Last appointment para variantes s y m */}
          {(variant === "s" || variant === "m") && lastAppointment && (
            <span className="text-xs text-muted-foreground dark:text-muted-foreground">
              {t("doctors.lastAppointment", "Última cita")}: {lastAppointment}
            </span>
          )}

          {/* Información detallada solo en variant default */}
          {variant === "default" && (
            <>
              {/* Años de experiencia */}
              {yearsOfExperience && (
                <div className="flex items-center gap-2">
                  <Stethoscope
                    size={isMobile ? 14 : 16}
                    className="text-primary dark:text-primary flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
                    {t("doctors.experience", {
                      count: yearsOfExperience,
                      years: yearsOfExperience,
                    })}
                  </span>
                </div>
              )}

              {/* Idiomas */}
              {languages && languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Languages
                    size={isMobile ? 14 : 16}
                    className="text-primary dark:text-primary flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground truncate">
                    {languages.join(", ")}
                  </span>
                </div>
              )}

              {/* Seguros aceptados */}
              {insuranceAccepted && insuranceAccepted.length > 0 && (
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    size={isMobile ? 14 : 16}
                    className="text-primary dark:text-primary flex-shrink-0 mt-0.5"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer flex-1 min-w-0">
                          <span className="font-semibold text-xs sm:text-sm text-foreground dark:text-foreground">
                            {t("doctors.acceptedInsurances", "Seguros")}:
                          </span>
                          <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground truncate">
                            {insuranceAccepted.join(", ")}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          {insuranceAccepted.join(", ")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      {/* BOTONES DE ACCIÓN */}
      <div className="mt-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <MCButton size={styles.buttonSize} className="text-xs sm:text-sm">
            {isMobile
              ? t("doctors.scheduleShort", "Agendar")
              : t("doctors.schedule", "Agendar")}
          </MCButton>
          <MCButton
            size={styles.buttonSize}
            variant="secondary"
            className="text-xs sm:text-sm"
          >
            {isMobile
              ? t("doctors.profileShort", "Perfil")
              : t("doctors.profile", "Perfil")}
          </MCButton>
          <MCButton
            size={styles.buttonSize}
            variant="secondary"
            className="text-xs sm:text-sm"
          >
            {isMobile
              ? t("doctors.historyShort", "Historial")
              : t("doctors.history", "Historial")}
          </MCButton>
        </div>
      </div>
    </Card>
  );
}

export default MCDoctorsCards;
