import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import MCDoctorCard, {
  type DoctorCardVariant,
} from "@/shared/components/MCDoctorsCards";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import FilterMyDoctors from "../filters/FilterMyDoctors";
import { useFiltersStore } from "@/stores/ useFiltersStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  yearsOfExperience?: number;
  languages?: string[];
  insuranceAccepted?: string[];
  isFavorite?: boolean;
  urlImage?: string;
  lastAppointment?: string;
}

interface DoctorCarouselProps {
  doctors: Doctor[];
  title?: string;
  variant?: DoctorCardVariant;
  showSearch?: boolean;
}

export function DoctorCarousel({
  doctors,
  title = "Tu equipo de atención",
  variant = "m",
  showSearch = true,
}: DoctorCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  // Obtener filtros y setters del store
  const doctorFilters = useFiltersStore((state) => state.doctorFilters);
  const setDoctorFilters = useFiltersStore((state) => state.setDoctorFilters);

  // Filtrar doctores según los filtros activos
  const filteredDoctors = doctors.filter((doctor) => {
    if (
      doctorFilters.specialty &&
      doctor.specialty.toLowerCase() !== doctorFilters.specialty.toLowerCase()
    )
      return false;
    if (
      doctorFilters.languages.length &&
      !doctorFilters.languages.some((lang: any) =>
        doctor.languages?.includes(lang),
      )
    )
      return false;
    if (
      doctorFilters.acceptingInsurance.length &&
      !doctorFilters.acceptingInsurance.some((ins) =>
        doctor.insuranceAccepted?.includes(ins),
      )
    )
      return false;
    if (
      doctorFilters.yearsOfExperience &&
      (doctor.yearsOfExperience ?? 0) < doctorFilters.yearsOfExperience
    )
      return false;
    if (doctorFilters.rating && doctor.rating < doctorFilters.rating)
      return false;
    if (doctorFilters.isFavorite === true && !doctor.isFavorite) return false;
    return true;
  });

  // Opcional: función para contar filtros activos
  const activeFilters = [
    doctorFilters.specialty,
    doctorFilters.languages.length,
    doctorFilters.acceptingInsurance.length,
    doctorFilters.yearsOfExperience,
    doctorFilters.rating,
    doctorFilters.isFavorite,
  ].filter(Boolean);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Puedes definir variantes si lo necesitas, por ejemplo:
  const buttonVariant = "outline"; // O el que prefieras
  const defaultClassNames = {
    button_previous: "",
    button_next: "",
  };

  return (
    <section className="max-w-full ">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2
          className={`${isMobile ? "text-lg" : "text-2xl"} font-semibold text-foreground`}
        >
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto flex-1 sm:flex-none">
            <MCFilterInput />
          </div>
          <MCFilterPopover
            activeFiltersCount={activeFilters.length}
            onClearFilters={() =>
              setDoctorFilters({
                name: "",
                specialty: "",
                yearsOfExperience: null,
                languages: [],
                acceptingInsurance: [],
                isFavorite: null,
                rating: null,
              })
            }
          >
            <FilterMyDoctors
              doctorFilters={doctorFilters}
              setDoctorFilters={setDoctorFilters}
            />
          </MCFilterPopover>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="flex items-center gap-2 ">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            buttonVariants({ variant: buttonVariant }),
            "size-11 aria-disabled:opacity-50 p-2 select-none transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 rounded-full",
            defaultClassNames.button_previous,
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>

        {/* Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="shrink-0"
              style={{ width: "calc((100% - 48px) / 3)", minWidth: "280px" }}
            >
              <MCDoctorCard
                name={doctor.name}
                specialty={doctor.specialty}
                rating={doctor.rating}
                yearsOfExperience={doctor.yearsOfExperience}
                languages={doctor.languages}
                insuranceAccepted={doctor.insuranceAccepted}
                isFavorite={doctor.isFavorite}
                urlImage={doctor.urlImage}
                variant={variant}
                lastAppointment={doctor.lastAppointment}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            buttonVariants({ variant: buttonVariant }),
            "size-11 aria-disabled:opacity-50 p-2 select-none transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 rounded-full",
            defaultClassNames.button_next,
          )}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-foreground" />
        </button>
      </div>
    </section>
  );
}
