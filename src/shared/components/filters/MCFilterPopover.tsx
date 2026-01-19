import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/shared/ui/button";

type MCFilterPopoverProps = {
  children: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
};

export function MCFilterPopover({
  children,
  activeFiltersCount,
  onClearFilters,
}: MCFilterPopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={`outline`}
          className={`flex  w-full items-center text-primary px-4 py-3.5 text-base sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-5 lg:py-5 lg:text-md rounded-4xl border-primary/20 bg-bg-btn-secondary ${
            open
              ? "opacity ring-2 ring-accent/70  border-secondary"
              : "opacity-100"
          }`}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-4.5 h-4.5" />
          <p>Filtros</p>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-full sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] p-5 bg-bg-secondary shadow-lg z-50 border border-primary/20 rounded-2xl"
        align="end"
        side="bottom"
        sideOffset={8}
        avoidCollisions={false}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">
              Filtros de Búsqueda
            </h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                aria-label="Limpiar filtros"
                onClick={onClearFilters}
                className="transition-all duration-200 ease-in-out hover:bg-primary dark:hover:bg-primary/10 active:scale-95 active:bg-primary/20 focus:ring-2 focus:ring-primary/30 rounded-full"
              >
                <X className="w-4 h-4" />
                Limpiar
              </Button>
            )}
          </div>
          <div className="w-full">{children}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
