import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import MCMetricCard from "@/shared/components/MCMetricCard";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface Metric {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  subtitle?: string;
}

interface MCTablesLayoutsProps {
  title: string;
  metrics?: Metric[];
  searchComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  tableComponent?: React.ReactNode;
  toogleView?: React.ReactNode;
  filtersInlineWithTitle?: boolean;
  pdfGeneratorComponent?: React.ReactNode;
  actionPlusComponent?: React.ReactNode; // <-- Nuevo prop
  isDashboard?: boolean;
  titleSize?: string; // Nueva prop opcional
}

function MCTablesLayouts({
  title,
  metrics = [],
  searchComponent,
  filterComponent,
  tableComponent,
  toogleView,
  filtersInlineWithTitle = false,
  isDashboard = false,
  pdfGeneratorComponent,
  actionPlusComponent, // <-- Nuevo prop
  titleSize, // Recibe la nueva prop
}: MCTablesLayoutsProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`bg-background ${!isDashboard ? "min-h-screen" : "h-fit"} flex gap-4 rounded-4xl ${
        isDashboard ? "p-10" : isMobile ? "py-4 px-4" : "p-10"
      }`}
    >
      <motion.main {...fadeInUp} className={`w-full flex flex-col gap-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1
            className={`${titleSize ? titleSize : isDashboard ? "text-3xl" : "text-3xl"} font-bold text-foreground`}
          >
            {title}
          </h1>
          {(searchComponent ||
            filterComponent ||
            toogleView ||
            pdfGeneratorComponent ||
            actionPlusComponent) && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end max-w-lg">
              {searchComponent}
              {filterComponent}
              {toogleView}
              {pdfGeneratorComponent}
              {actionPlusComponent}
            </div>
          )}
        </div>
        {/* Métricas Cards */}
        {metrics.length > 0 && (
          <div className="flex gap-4">
            {metrics.map((metric, index) => (
              <MCMetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                subtitle={metric.subtitle}
              />
            ))}
          </div>
        )}
        {/* Tabla */}
        <div>{tableComponent}</div>
      </motion.main>
    </div>
  );
}

export default MCTablesLayouts;
