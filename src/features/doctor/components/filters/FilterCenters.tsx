import { Star } from "lucide-react";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";

interface CenterFilters {
  type: string;
  rating: number | null;
  isConnected: boolean | null;
}

interface FilterCentersProps {
  filters: CenterFilters;
  onFiltersChange: (filters: Partial<CenterFilters>) => void;
}

type OptionType = { value: string; label: string | JSX.Element };

function FilterCenters({ filters, onFiltersChange }: FilterCentersProps) {
  const { t } = useTranslation("doctor");
  const userRole = useAppStore((state) => state.user?.role);

  const centerTypes: OptionType[] = [
    {
      value: "hospital",
      label: t("filters.centerTypes.hospital", "Hospital"),
    },
    {
      value: "clinic",
      label: t("filters.centerTypes.clinic", "Clínica"),
    },
    {
      value: "laboratory",
      label: t("filters.centerTypes.laboratory", "Laboratorio"),
    },
    {
      value: "imaging",
      label: t("filters.centerTypes.imaging", "Centro de Imagen"),
    },
    {
      value: "pharmacy",
      label: t("filters.centerTypes.pharmacy", "Farmacia"),
    },
  ];

  const ratingOptions: OptionType[] = [
    {
      value: "4.5",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.rating.4_5", "4.5+")}
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "4",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.rating.4", "4.0+")}
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "3.5",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.rating.3_5", "3.5+")}
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "0",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.rating.all", "Todas las calificaciones")}
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
      {/* Filtros que pueden ver todos los usuarios */}
      <MCFilterSelect
        name="type"
        label={t("filters.labels.centerType", "Tipo de centro")}
        options={centerTypes}
        placeholder={t("filters.placeholders.centerType", "Seleccionar tipo")}
        value={filters.type}
        noBadges
        onChange={(v) =>
          onFiltersChange({
            type: typeof v === "string" ? v : (v[0] ?? ""),
          })
        }
      />

      <MCFilterSelect
        name="rating"
        label={t("filters.labels.rating", "Calificación")}
        options={ratingOptions}
        noBadges
        placeholder={t("filters.placeholders.rating", "Calificación mínima")}
        value={filters.rating !== null ? String(filters.rating) : "0"}
        onChange={(v) =>
          onFiltersChange({
            rating: v ? Number(Array.isArray(v) ? v[0] : v) : null,
          })
        }
      />

      {/* Filtro exclusivo para doctores */}
      {userRole === "DOCTOR" && (
        <div className="flex items-center gap-2">
          <Switch
            checked={filters.isConnected === true}
            onCheckedChange={(v) =>
              onFiltersChange({
                isConnected: v ? true : null,
              })
            }
            id="only-connected"
          />
          <Label
            htmlFor="only-connected"
            className="text-primary flex items-center gap-2 cursor-pointer"
          >
            {t("filters.labels.onlyConnected", "Solo conectados")}
          </Label>
        </div>
      )}
    </div>
  );
}

export default FilterCenters;
