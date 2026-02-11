import React from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

type MCMetricCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
  percentage?: string;
  bordered?: boolean;
};

const MCMetricCard: React.FC<MCMetricCardProps> = ({
  title,
  icon,
  value,
  subtitle,
  bordered = true,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`relative flex flex-col justify-start w-full rounded-4xl bg-background shadow-sm transition-colors ${
        isMobile ? "p-4" : "p-6"
      } ${bordered ? "border border-primary/10" : ""}`}
    >
      {/* Header con icono y textos */}
      <div className={`flex items-start gap-4 ${isMobile ? "mb-4" : "mb-6"}`}>
        <div
          className={`flex items-center justify-center rounded-full bg-accent flex-shrink-0 ${
            isMobile ? "w-12 h-12" : "w-16 h-16"
          }`}
        >
          <span
            className={`text-primary dark:text-background flex items-center justify-center ${
              isMobile ? "text-lg" : "text-2xl"
            }`}
          >
            {icon}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Título más grande */}
          <div
            className={`font-bold mb-2 leading-tight text-foreground ${
              isMobile ? "text-lg" : "text-xl"
            }`}
          >
            {title}
          </div>

          {/* Subtítulo */}
          {subtitle && (
            <div
              className={`text-muted-foreground font-normal leading-tight line-clamp-2 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Valor destacado */}
      <div
        className={`font-bold leading-none text-primary ${
          isMobile ? "text-3xl mb-2" : "text-5xl mb-4"
        }`}
      >
        {value}
      </div>

      {/* Opcional: Trend indicator (descomentado si se necesita) */}
      {/* {percentage && (
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center justify-center rounded-full w-fit h-fit py-2 px-3 bg-accent">
            <span className="text-xs font-medium text-accent-foreground flex items-center justify-center">
              <ArrowUp className="w-4 h-4 text-accent-foreground" />
              <p className="text-accent-foreground">{percentage}</p>
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              más que el mes pasado
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MCMetricCard;
