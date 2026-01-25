import { Star } from "lucide-react";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { type JSX } from "react";
import { useTranslation } from "react-i18next";

// Opciones de filtros (puedes moverlas a un archivo común si se usan en varios lugares)
const tipoProveedorOptions = [
  { value: "all", label: "Todos" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "clinica", label: "Clínica" },
];

const especialidadOptions = [
  { value: "all", label: "Todos" },
  { value: "cardiologia", label: "Cardiología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "dermatologia", label: "Dermatología" },
];

const modalidadOptions = [
  { value: "all", label: "Todos" },
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
];

const generoOptions = [
  { value: "all", label: "Todos" },
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

const idiomasOptions = [
  { value: "all", label: "Todos" },
  { value: "espanol", label: "Español" },
  { value: "ingles", label: "Inglés" },
  { value: "frances", label: "Francés" },
];

const horarioOptions = [
  { value: "all", label: "Todos" },
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "noche", label: "Noche" },
];

type OptionType = { value: string; label: string | JSX.Element };

type FilterValues = {
  tipoProveedor: string[];
  especialidad: string[];
  modalidad: string[];
  genero: string[];
  idiomas: string[];
  horario: string[];
  calificacion: string[];
};

type Props = {
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
};

function FIlterSearchProviders({ filters, setFilters }: Props): JSX.Element {
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

  return (
    <div className="w-full flex max-w-5xl gap-2 justify-center">
      <MCFilterSelect
        name="tipoProveedor"
        options={tipoProveedorOptions}
        placeholder={t("search.providerType", "Tipo de proveedor")}
        multiple
        value={filters.tipoProveedor}
        onChange={(v) =>
          setFilters({ ...filters, tipoProveedor: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="especialidad"
        options={especialidadOptions}
        placeholder={t("search.specialty", "Especialidad")}
        multiple
        value={filters.especialidad}
        onChange={(v) =>
          setFilters({ ...filters, especialidad: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="modalidad"
        options={modalidadOptions}
        placeholder={t("search.modality", "Modalidad")}
        multiple
        value={filters.modalidad}
        onChange={(v) =>
          setFilters({ ...filters, modalidad: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="genero"
        options={generoOptions}
        placeholder={t("search.gender", "Género")}
        multiple
        value={filters.genero}
        onChange={(v) =>
          setFilters({ ...filters, genero: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="idiomas"
        options={idiomasOptions}
        placeholder={t("search.languages", "Idiomas")}
        multiple
        value={filters.idiomas}
        onChange={(v) =>
          setFilters({ ...filters, idiomas: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="horario"
        options={horarioOptions}
        placeholder={t("search.schedule", "Horario")}
        multiple
        value={filters.horario}
        onChange={(v) =>
          setFilters({ ...filters, horario: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
      <MCFilterSelect
        name="calificacion"
        options={rankingOptions}
        placeholder={t("search.rating", "Calificación")}
        multiple
        value={filters.calificacion}
        onChange={(v) =>
          setFilters({ ...filters, calificacion: Array.isArray(v) ? v : [v] })
        }
        noBadges
      />
    </div>
  );
}

export default FIlterSearchProviders;
