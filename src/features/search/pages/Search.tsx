import React, { useState } from "react";
import DoctorSearchBar from "@/features/patient/components/DoctorSearchBar";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    </div>
  );
}

export default Search;
