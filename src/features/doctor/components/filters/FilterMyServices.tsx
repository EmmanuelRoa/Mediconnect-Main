import { type JSX } from "react";
import { Clock, Star, DollarSign, MapPin, Stethoscope } from "lucide-react";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface MyServiceFilters {
  servicio: string;
  especialidad: string;
  tipo: string;
  precio: string;
  duracion: string;
  rating: number | null;
  estado: string;
}

interface FilterMyServicesProps {
  filters: MyServiceFilters;
  onFiltersChange: (filters: Partial<MyServiceFilters>) => void;
}

type OptionType = { value: string; label: string | JSX.Element };

function FilterMyServices({ filters, onFiltersChange }: FilterMyServicesProps) {
  const { t } = useTranslation("doctor");
  const isMobile = useIsMobile();

  const servicioOptions: OptionType[] = [
    { value: "consulta-general", label: "Consulta General" },
    { value: "consulta-cardiologica", label: "Consulta Cardiológica" },
    { value: "consulta-pediatrica", label: "Consulta Pediátrica" },
    { value: "teleconsulta", label: "Teleconsulta" },
    { value: "consulta-dermatologica", label: "Consulta Dermatológica" },
    { value: "consulta-psicologica", label: "Consulta Psicológica" },
  ];

  const especialidadOptions: OptionType[] = [
    { value: "medicina-general", label: "Medicina General" },
    { value: "cardiologia", label: "Cardiología" },
    { value: "pediatria", label: "Pediatría" },
    { value: "dermatologia", label: "Dermatología" },
    { value: "psicologia", label: "Psicología" },
  ];

  const tipoOptions: OptionType[] = [
    { value: "presencial", label: "Presencial" },
    { value: "virtual", label: "Virtual" },
    { value: "mixta", label: "Presencial / Virtual" },
  ];

  const precioOptions: OptionType[] = [
    {
      value: "0-1000",
      label: (
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          RD$0 - RD$1,000
        </span>
      ),
    },
    {
      value: "1000-3000",
      label: (
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          RD$1,000 - RD$3,000
        </span>
      ),
    },
    {
      value: "3000-5000",
      label: (
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          RD$3,000 - RD$5,000
        </span>
      ),
    },
    {
      value: "5000+",
      label: (
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          RD$5,000+
        </span>
      ),
    },
  ];

  const duracionOptions: OptionType[] = [
    {
      value: "25",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          25 min
        </span>
      ),
    },
    {
      value: "30",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          30 min
        </span>
      ),
    },
    {
      value: "35",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          35 min
        </span>
      ),
    },
    {
      value: "40",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          40 min
        </span>
      ),
    },
    {
      value: "45",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          45 min
        </span>
      ),
    },
    {
      value: "50",
      label: (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          50 min
        </span>
      ),
    },
  ];

  const ratingOptions: OptionType[] = [
    {
      value: "4.5",
      label: (
        <span className="flex items-center gap-1">
          4.5+
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        </span>
      ),
    },
    {
      value: "4",
      label: (
        <span className="flex items-center gap-1">
          4.0+
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        </span>
      ),
    },
    {
      value: "3.5",
      label: (
        <span className="flex items-center gap-1">
          3.5+
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        </span>
      ),
    },
    {
      value: "0",
      label: "Todas las calificaciones",
    },
  ];

  const estadoOptions: OptionType[] = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <MCFilterSelect
        name="servicio"
        label="Tipo de Servicio"
        options={servicioOptions}
        placeholder="Seleccionar servicio"
        value={filters.servicio}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            servicio: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="especialidad"
        label="Especialidad"
        options={especialidadOptions}
        placeholder="Seleccionar especialidad"
        value={filters.especialidad}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            especialidad: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="tipo"
        label="Tipo de Atención"
        options={tipoOptions}
        placeholder="Seleccionar tipo"
        value={filters.tipo}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            tipo: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="precio"
        label="Rango de Precio"
        options={precioOptions}
        placeholder="Seleccionar rango"
        value={filters.precio}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            precio: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="duracion"
        label="Duración"
        options={duracionOptions}
        placeholder="Seleccionar duración"
        value={filters.duracion}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            duracion: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="rating"
        label="Calificación"
        options={ratingOptions}
        placeholder="Calificación mínima"
        value={filters.rating !== null ? String(filters.rating) : "0"}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            rating: v ? Number(Array.isArray(v) ? v[0] : v) : null,
          })
        }
      />

      <MCFilterSelect
        name="estado"
        label="Estado"
        options={estadoOptions}
        placeholder="Seleccionar estado"
        value={filters.estado}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            estado: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />
    </div>
  );
}

export default FilterMyServices;
