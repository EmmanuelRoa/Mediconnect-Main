import { Star } from "lucide-react";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { type DoctorFiltersSlice } from "@/stores/filters/doctorFilters.slice";
import { useTranslation } from "react-i18next";
import { type JSX } from "react";
// Define OptionType interface
interface OptionType {
  value: string;
  label: string | JSX.Element;
}

const tipoProveedorOptions = [
  { value: "all", label: "Todos" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "clinic", label: "Clínica" }, // Cambiado
];

const especialidadOptions = [
  { value: "all", label: "Todos" },
  { value: "Cardiología", label: "Cardiología" },
  { value: "Pediatría", label: "Pediatría" },
  { value: "Dermatología", label: "Dermatología" },
  { value: "Medicina General", label: "Medicina General" },
  { value: "Ginecología", label: "Ginecología" },
  { value: "Neurología", label: "Neurología" },
  { value: "Psiquiatría", label: "Psiquiatría" },
];

const modalidadOptions = [
  { value: "all", label: "Todos" },
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];

const generoOptions = [
  { value: "all", label: "Todos" },
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
];

const idiomasOptions = [
  { value: "all", label: "Todos" },
  { value: "Español", label: "Español" },
  { value: "Inglés", label: "Inglés" },
  { value: "Francés", label: "Francés" },
];

const horarioOptions = [
  { value: "all", label: "Todos" },
  { value: "mañana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "noche", label: "Noche" },
];

interface FiltersSearchProvidersProps {
  searchProviderFilters: DoctorFiltersSlice["SearchProviderFilters"];
  setSearchProviderFilters: DoctorFiltersSlice["setSearchProviderFilters"];
}

function FiltersSearchProviders({
  searchProviderFilters,
  setSearchProviderFilters,
}: FiltersSearchProvidersProps) {
  const { t } = useTranslation("common");

  const rankingOptions: OptionType[] = [
    {
      value: "4.5",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.ranking.4_5")}{" "}
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "4",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.ranking.4")} <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "3.5",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.ranking.3_5")}{" "}
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "3",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.ranking.3")} <Star className="w-4 h-4 text-yellow-400" />
        </span>
      ),
    },
    {
      value: "0",
      label: (
        <span className="flex items-center gap-1">
          {t("filters.ranking.all")}
        </span>
      ),
    },
  ];

  const handleFilterChange = (filterKey: string, values: string | string[]) => {
    const arrayValues = Array.isArray(values) ? values : [values];
    setSearchProviderFilters({
      ...searchProviderFilters,
      [filterKey]: arrayValues,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <MCFilterSelect
        name="providerType"
        label={t("search.providerType", "Tipo de Proveedor")}
        options={tipoProveedorOptions}
        multiple
        value={searchProviderFilters.providerType}
        onChange={(values) => handleFilterChange("providerType", values)}
        noBadges
      />
      <MCFilterSelect
        name="specialty"
        label={t("search.specialty", "Especialidad")}
        options={especialidadOptions}
        multiple
        value={searchProviderFilters.specialty}
        onChange={(values) => handleFilterChange("specialty", values)}
        noBadges
      />
      <MCFilterSelect
        name="modality"
        label={t("search.modality", "Modalidad")}
        options={modalidadOptions}
        multiple
        value={searchProviderFilters.modality}
        onChange={(values) => handleFilterChange("modality", values)}
        noBadges
      />
      <MCFilterSelect
        name="gender"
        label={t("search.gender", "Género")}
        options={generoOptions}
        multiple
        value={searchProviderFilters.gender}
        onChange={(values) => handleFilterChange("gender", values)}
        noBadges
      />
      <MCFilterSelect
        name="languages"
        label={t("search.languages", "Idiomas")}
        options={idiomasOptions}
        multiple
        value={searchProviderFilters.languages}
        onChange={(values) => handleFilterChange("languages", values)}
        noBadges
      />
      <MCFilterSelect
        name="scheduledAppointments"
        label={t("search.schedule", "Horario")}
        options={horarioOptions}
        multiple
        value={searchProviderFilters.scheduledAppointments}
        onChange={(values) =>
          handleFilterChange("scheduledAppointments", values)
        }
        noBadges
      />
      <MCFilterSelect
        name="rating"
        label={t("search.rating", "Calificación")}
        options={rankingOptions}
        multiple
        noBadges
        value={
          searchProviderFilters.rating === null
            ? ""
            : Array.isArray(searchProviderFilters.rating)
              ? searchProviderFilters.rating.map(String)
              : String(searchProviderFilters.rating)
        }
        onChange={(values) => handleFilterChange("rating", values)}
      />
    </div>
  );
}

export default FiltersSearchProviders;
