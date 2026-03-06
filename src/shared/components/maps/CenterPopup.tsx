import React from "react";
import { Star, MapPin, Globe, Phone, Shield } from "lucide-react";
import { type Clinic } from "@/data/providers";
import { Card, CardContent, CardTitle } from "@/shared/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useAppStore } from "@/stores/useAppStore";
import MCButton from "../forms/MCButton";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import ToogleConfirmConnection from "@/features/request/components/ToogleConfirmConnection";

type CenterPopupProps = {
  provider: Clinic;
  isConnected?: boolean;
  onConnect?: (id: string) => void;
  navigateFn?: (path: string) => void;
};

const CenterPopup: React.FC<CenterPopupProps> = ({
  provider,
  isConnected,
  onConnect,
  navigateFn,
}) => {
  const userRole = useAppStore((state) => state.user?.role);
  const isMobile = useIsMobile();
  const { t } = useTranslation("common");

  // Usar connectionStatus real si existe, si no, fallback a isConnected
  const connectionStatus =
    provider.connectionStatus ??
    (isConnected === true ? "connected" : "not_connected");

  let connectBtnText = t("clinicCard.connect");
  let connectBtnDisabled = false;
  let connectVariant: "primary" | "outline" = "outline";

  if (connectionStatus === "connected") {
    connectBtnText = t("clinicCard.connected");
    connectVariant = "primary";
  } else if (connectionStatus === "pending") {
    connectBtnText = t("clinicCard.pending");
    connectBtnDisabled = true;
  }

  const handleProfileClick = () => {
    if (provider.id && navigateFn) {
      navigateFn(`/center/profile/${provider.id}`);
    }
  };

  const handleConfirmConnect = () => {
    onConnect?.(provider.id);
  };

  const cardSize = isMobile ? "w-[260px] rounded-2xl" : "w-[480px] rounded-3xl";
  const imgHeight = isMobile ? "h-28" : "h-36";
  const textXs = isMobile ? "text-[11px]" : "text-xs";

  return (
    <motion.div {...fadeInUp}>
      <Card
        className={`bg-background border border-primary/10 shadow-sm hover:shadow-lg transition-shadow flex flex-col ${cardSize}`}
      >
        {/* Imagen */}
        <div
          className={`overflow-hidden rounded-xl border border-primary/5 ${imgHeight}`}
        >
          <img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>

        {/* Nombre + rating */}
        <div className="flex justify-between px-3 pt-2">
          <CardTitle
            className={
              isMobile ? "text-sm font-semibold" : "text-base font-bold"
            }
          >
            {provider.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{provider.rating}</span>
          </div>
        </div>

        <CardContent className="p-2 space-y-2">
          {/* Dirección */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex gap-1.5 cursor-pointer ${textXs} text-muted-foreground`}
              >
                <MapPin className="w-3 h-3 mt-0.5 text-secondary" />
                <span className="line-clamp-2">{provider.address}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {provider.address}
            </TooltipContent>
          </Tooltip>

          {/* Idiomas */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex gap-1 cursor-pointer ${textXs} text-muted-foreground`}
              >
                <Globe className="w-3 h-3 text-secondary" />
                <span className="truncate max-w-[150px]">
                  {provider.languages.join(", ")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{provider.languages.join(", ")}</TooltipContent>
          </Tooltip>

          {/* Teléfono */}
          <a
            href={`tel:${provider.phone}`}
            className={`flex gap-1 ${textXs} text-secondary hover:opacity-80`}
          >
            <Phone className="w-3 h-3" />
            <span className="text-primary">{provider.phone}</span>
          </a>

          {/* Seguros */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex gap-1 cursor-pointer pt-1 border-t ${textXs}`}
              >
                <Shield className="w-3 h-3 text-secondary" />
                <span className="truncate max-w-[150px]">
                  {provider.insurances.join(", ")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{provider.insurances.join(", ")}</TooltipContent>
          </Tooltip>

          {/* Botones */}
          <div className={`flex gap-2 mt-3 ${isMobile && "flex-col"}`}>
            {userRole === "DOCTOR" && (
              <ToogleConfirmConnection
                status={connectionStatus}
                id={parseInt(provider.id)}
                onConfirm={handleConfirmConnect}
              >
                <MCButton
                  size="xs"
                  variant={connectVariant}
                  className={[
                    "flex-1 w-full",
                    isMobile && "text-xs px-2",
                    connectionStatus === "connected" &&
                      "bg-secondary hover:bg-secondary/90 text-white border-none active:bg-secondary/80",
                    connectionStatus === "not_connected" &&
                      "border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary/80 active:bg-secondary/20",
                    connectionStatus === "pending" &&
                      "border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={connectBtnDisabled}
                >
                  {connectBtnText}
                </MCButton>
              </ToogleConfirmConnection>
            )}

            <MCButton
              size="xs"
              variant="outline"
              className="flex-1 w-full"
              onClick={handleProfileClick}
            >
              {t("clinicCard.viewProfile")}
            </MCButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CenterPopup;
