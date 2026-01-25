import React, { useState, useMemo } from "react";
import DoctorSearchBar from "@/features/patient/components/DoctorSearchBar";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { DoctorCards } from "../components/DoctorCards";
import { CenterCards } from "../components/CenterCards";
import {
  allProviders,
  type Provider,
  type Doctor,
  type Clinic,
} from "@/data/providers";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/shared/ui/empty";
import MapSearchProviders from "@/shared/components/maps/MapSearchProviders";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { fadeInUp, fadeInUpDelayed } from "@/lib/animations/commonAnimations";
import { motion } from "framer-motion";
import MCButton from "@/shared/components/forms/MCButton";
import CompareModal from "../components/CompareModal";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Map as MapIcon, List as ListIcon } from "lucide-react";

const tipoProveedorOptions = [
  { value: "all", label: "Todos" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "clinica", label: "Clínica" },
];

const calificacionOptions = [
  { value: "all", label: "Todos" },
  { value: "5", label: "5 estrellas" },
  { value: "4", label: "4 estrellas o más" },
  { value: "3", label: "3 estrellas o más" },
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

function Search() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const [showMap, setShowMap] = useState(false);

  // Estados para filtros y selección
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [connectedClinics, setConnectedClinics] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] =
    useState<Provider[]>(allProviders);

  const handleProviderSelect = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 5
          ? [...prev, id]
          : prev,
    );
  };

  const handleClinicConnect = (id: string) => {
    setConnectedClinics((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const handleViewProfile = (id: string) => {
    console.log("Ver perfil de:", id);
  };

  const handleRemoveFromComparison = (id: string) => {
    setSelectedProviders((prev) => prev.filter((pid) => pid !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background rounded-4xl">
      {/* Barra de búsqueda - Mejorada para mobile */}
      <motion.div
        {...fadeInUp}
        className=" top-0 z-20 bg-background rounded-t-4xl "
      >
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-12">
          <div className="space-y-3 sm:space-y-4">
            <DoctorSearchBar />

            {/* Filtros - Grid responsivo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <MCFilterSelect
                name="tipoProveedor"
                placeholder={t("search.providerType", "Tipo")}
                options={tipoProveedorOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="especialidad"
                placeholder={t("search.specialty", "Especialidad")}
                options={especialidadOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="modalidad"
                placeholder={t("search.modality", "Modalidad")}
                options={modalidadOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="genero"
                placeholder={t("search.gender", "Género")}
                options={generoOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="idiomas"
                placeholder={t("search.languages", "Idiomas")}
                options={idiomasOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="horario"
                placeholder={t("search.schedule", "Horario")}
                options={horarioOptions}
                multiple
                noBadges
              />
              <MCFilterSelect
                name="calificacion"
                placeholder={t("search.rating", "Calificación")}
                options={calificacionOptions}
                multiple
                noBadges
              />
            </div>

            {isMobile && (
              <div className="flex justify-end pt-2">
                <MCButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2"
                >
                  {showMap ? <ListIcon size={16} /> : <MapIcon size={16} />}
                  {showMap
                    ? t("search.viewList", "Ver Lista")
                    : t("search.viewMap", "Ver Mapa")}
                </MCButton>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contador de seleccionados - Mejorado para mobile */}
      {selectedProviders.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-background dark:bg-bg-btn-secondary shadow-lg border-t border-primary/15 md:max-w-md md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-t-2xl md:border md:border-b-0"
        >
          <div className="flex items-center justify-between px-3 py-2.5 sm:px-4">
            <span className="text-xs sm:text-sm text-primary">
              {t("search.selectedProviders", {
                count: selectedProviders.length,
                max: 5,
                defaultValue: "{{count}}/{{max}} para comparar",
              })}
            </span>
            <CompareModal
              selectedProviders={allProviders.filter((provider) =>
                selectedProviders.includes(provider.id),
              )}
              onRemoveProvider={handleRemoveFromComparison}
            >
              <MCButton
                className={selectedProviders.length < 2 ? "hidden" : ""}
                size="sm"
              >
                {t("search.compare", "Comparar")}
              </MCButton>
            </CompareModal>
          </div>
        </motion.div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-3 sm:p-4 pb-20 sm:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-4 lg:h-[calc(100vh-200px)]">
          {/* Lista de proveedores */}
          <motion.div
            {...fadeInUp}
            className={`space-y-3 sm:space-y-4 overflow-y-auto ${
              isMobile && showMap ? "hidden" : "block"
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .space-y-3::-webkit-scrollbar,
                .space-y-4::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-medium opacity-70">
                {t("search.providersFound", {
                  count: filteredProviders.length,
                  defaultValue: "{{count}} encontrados",
                })}
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredProviders.length === 0 ? (
                <Empty>
                  <EmptyContent>
                    <EmptyTitle>
                      {t("search.noProvidersFound", "Sin resultados")}
                    </EmptyTitle>
                    <EmptyDescription className="text-xs sm:text-sm">
                      {t(
                        "search.noResultsDescription",
                        "Intenta cambiar los filtros o la búsqueda.",
                      )}
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              ) : (
                filteredProviders.map((provider) => {
                  if (provider.type === "doctor") {
                    return (
                      <DoctorCards
                        key={provider.id}
                        doctor={provider as Doctor}
                        isSelected={selectedProviders.includes(provider.id)}
                        onSelect={handleProviderSelect}
                        onViewProfile={handleViewProfile}
                      />
                    );
                  } else {
                    return (
                      <CenterCards
                        key={provider.id}
                        clinic={provider as Clinic}
                        isConnected={connectedClinics.includes(provider.id)}
                        onConnect={handleClinicConnect}
                        onViewProfile={handleViewProfile}
                      />
                    );
                  }
                })
              )}
            </div>
          </motion.div>

          {/* Mapa */}
          <motion.div
            {...fadeInUp}
            className={`bg-card rounded-xl border border-border h-[500px] sm:h-[600px] lg:h-full ${
              isMobile && !showMap ? "hidden" : "block"
            }`}
          >
            <div className="h-full rounded-xl overflow-hidden">
              <MapSearchProviders
                providers={filteredProviders}
                selectedProviders={selectedProviders}
                onProviderSelect={handleProviderSelect}
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Search;
