import React from "react";
import MCMetricCard from "@/shared/components/MCMetricCard";

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
  tableComponent: React.ReactNode;
  toogleView?: React.ReactNode;
  filtersInlineWithTitle?: boolean; // Nueva prop
}

function MCTablesLayouts({
  title,
  metrics = [],
  searchComponent,
  filterComponent,
  tableComponent,
  toogleView,
  filtersInlineWithTitle = false, // default false
}: MCTablesLayoutsProps) {
  const showInlineFilters = filtersInlineWithTitle && metrics.length === 0;

  return (
    <div className="flex flex-col gap-10 bg-background p-6 rounded-4xl mt-4 h-full">
      {/* Título y Filtros en la misma fila si corresponde */}
      <div
        className={`flex flex-col ${showInlineFilters ? "sm:flex-row justify-between items-center gap-4" : "sm:flex-row justify-between items-start sm:items-center gap-4"}`}
      >
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {showInlineFilters &&
          (searchComponent || filterComponent || toogleView) && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end max-w-lg">
              {searchComponent}
              {filterComponent}
              {toogleView}
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

      {/* Filtros y búsqueda si no van en la misma fila que el título */}
      {!showInlineFilters && (
        <div className="flex w-full justify-end items-end mt-4">
          {(searchComponent || filterComponent || toogleView) && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end max-w-lg">
              {searchComponent}
              {filterComponent}
              {toogleView}
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card rounded-xl overflow-hidden">{tableComponent}</div>
    </div>
  );
}

export default MCTablesLayouts;
