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

const tipoProveedorOptions = [
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
  { value: "clinica", label: "Clínica" },
];

const calificacionOptions = [
  { value: "5", label: "5 estrellas" },
  { value: "4", label: "4 estrellas o más" },
  { value: "3", label: "3 estrellas o más" },
];

const especialidadOptions = [
  { value: "cardiologia", label: "Cardiología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "dermatologia", label: "Dermatología" },
  // Agrega más especialidades según sea necesario
];

const modalidadOptions = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
];

const generoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

const idiomasOptions = [
  { value: "espanol", label: "Español" },
  { value: "ingles", label: "Inglés" },
  { value: "frances", label: "Francés" },
  // Agrega más idiomas según sea necesario
];

const horarioOptions = [
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "noche", label: "Noche" },
];

function Search() {
  // Estados para filtros y selección
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [connectedClinics, setConnectedClinics] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] =
    useState<Provider[]>(allProviders);

  // Handlers de ejemplo (ajusta según tu lógica real)
  const handleProviderSelect = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 3
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
    // Lógica para ver perfil
    console.log("Ver perfil de:", id);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center bg-background rouneded-2xl md:rounded-4xl shadow-sm ">
      {/* Barra de búsqueda */}
      <div className="space-y-2  min-w-full rounded-2xl md:rounded-4xl p-6 md:p-12 flex flex-col items-center gap-2">
        <div className="w-full ">
          <DoctorSearchBar />
        </div>
        <div className="w-full flex max-w-5xl gap-2 justify-center">
          <MCFilterSelect
            name="tipoProveedor"
            placeholder="Tipo de proveedor"
            options={tipoProveedorOptions}
          />

          <MCFilterSelect
            name="especialidad"
            placeholder="Especialidad"
            options={especialidadOptions}
          />
          <MCFilterSelect
            name="modalidad"
            placeholder="Modalidad"
            options={modalidadOptions}
          />
          <MCFilterSelect
            name="genero"
            placeholder="Género"
            options={generoOptions}
          />
          <MCFilterSelect
            name="idiomas"
            placeholder="Idiomas"
            options={idiomasOptions}
          />
          <MCFilterSelect
            name="horario"
            placeholder="Horario"
            options={horarioOptions}
          />
          <MCFilterSelect
            name="calificacion"
            placeholder="Calificación"
            options={calificacionOptions}
          />
        </div>
      </div>

      {/* Contador de seleccionados */}
      {selectedProviders.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg w-full max-w-5xl mb-4">
          <span className="text-sm">
            {selectedProviders.length} de 3 proveedores seleccionados para
            comparar
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Comparar:", selectedProviders)}
          >
            Comparar
          </Button>
        </div>
      )}

      {/* Contenido principal */}
      <main className="p-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Lista de proveedores - Izquierda */}
          <div
            className="space-y-4 overflow-y-auto"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            <style>
              {`
                /* Chrome, Edge, Safari */
                .space-y-4::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium opacity-70">
                {filteredProviders.length} proveedores encontrados
              </h2>
            </div>

            <div className="space-y-4">
              {filteredProviders.length === 0 ? (
                <Empty>
                  <EmptyContent>
                    <EmptyTitle>No se encontraron proveedores</EmptyTitle>
                    <EmptyDescription>
                      No hay resultados para los filtros seleccionados. Intenta
                      cambiar los filtros o la búsqueda.
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
          </div>

          {/* Mapa - Derecha */}
          <div className="bg-card rounded-xl  border border-border">
            <div className="h-full">
              <MapSearchProviders
                providers={filteredProviders}
                selectedProviders={selectedProviders}
                onProviderSelect={handleProviderSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Search;
