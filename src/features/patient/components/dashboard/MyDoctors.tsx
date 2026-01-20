import React, { useState } from "react";
import MCDoctorsCards from "@/shared/components/MCDoctorsCards";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";

const doctors = [
  {
    key: 1,
    name: "Alexander Gil",
    specialty: "Cardiólogo",
    rating: 4.8,
    yearsOfExperience: 12,
    languages: ["Español", "Inglés"],
    insuranceAccepted: ["Humano", "Universal", "Yunen"],
    isFavorite: true,
    urlImage: "https://mediconnect.com/doctor1.jpg",
    fullInfoView: false,
  },
  {
    key: 2,
    name: "Alexander Gil",
    specialty: "Cardiólogo",
    rating: 4.8,
    yearsOfExperience: 12,
    languages: ["Español", "Inglés"],
    insuranceAccepted: ["Humano", "Universal", "Yunen"],
    isFavorite: true,
    urlImage: "https://mediconnect.com/doctor1.jpg",
    fullInfoView: false,
  },
  {
    key: 3,
    name: "Alexander Gil",
    specialty: "Cardiólogo",
    rating: 4.8,
    yearsOfExperience: 12,
    languages: ["Español", "Inglés"],
    insuranceAccepted: ["Humano", "Universal", "Yunen"],
    isFavorite: true,
    urlImage: "https://mediconnect.com/doctor1.jpg",
    fullInfoView: false,
  },
  {
    key: 4,
    name: "Alexander Gil",
    specialty: "Cardiólogo",
    rating: 4.8,
    yearsOfExperience: 12,
    languages: ["Español", "Inglés"],
    insuranceAccepted: ["Humano", "Universal", "Yunen"],
    isFavorite: true,
    urlImage: "https://mediconnect.com/doctor1.jpg",
    fullInfoView: false,
  },
  // Puedes agregar más doctores aquí
];

function MyDoctors() {
  const [startIndex, setStartIndex] = useState(0);

  // Muestra 4 doctores a la vez
  const visibleDoctors = doctors.slice(startIndex, startIndex + 4);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, doctors.length - 4));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-primary">
          Tu equipo de atención
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Doctor"
              className="rounded-full border px-4 py-2 pl-10 text-lg"
            />
            <Search
              className="absolute left-3 top-2.5 text-primary"
              size={20}
            />
          </div>
          <button className="rounded-full border px-4 py-2 flex items-center gap-2 text-lg">
            <Filter size={20} />
            Filtros
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="rounded-full bg-accent p-2 disabled:opacity-40"
        >
          <ChevronLeft size={32} />
        </button>
        <div className="flex gap-6 flex-1 overflow-x-auto">
          {visibleDoctors.map((doctor) => (
            <div
              key={doctor.key}
              className="min-w-[320px] max-w-[340px] flex-shrink-0"
            >
              <MCDoctorsCards {...doctor} />
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={startIndex >= doctors.length - 4}
          className="rounded-full bg-accent p-2 disabled:opacity-40"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}

export default MyDoctors;
