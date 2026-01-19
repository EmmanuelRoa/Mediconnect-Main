import { useMemo } from "react";
import HighlightedText from "@/features/patient/components/searchComponent/HighlightedText";
import {
  doctors,
  specialties,
  type Doctor,
  type Specialty,
} from "@/data/searchData";

interface SearchDropdownProps {
  searchTerm: string;
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectSpecialty: (specialty: Specialty) => void;
}

const SearchDropdown = ({
  searchTerm,
  onSelectDoctor,
  onSelectSpecialty,
}: SearchDropdownProps) => {
  const filteredSpecialties = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return specialties
      .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 4);
  }, [searchTerm]);

  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return doctors
      .filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, 4);
  }, [searchTerm]);

  if (filteredSpecialties.length === 0 && filteredDoctors.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2.5 bg-card rounded-2xl shadow-search border border-border overflow-hidden z-50">
      <div className="py-2">
        {/* Especialidades */}
        {filteredSpecialties.length > 0 && (
          <div className="px-4 py-2">
            {filteredSpecialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => onSelectSpecialty(specialty)}
                className="w-full text-left py-2 px-2 rounded-lg hover:bg-accent hover:text-secondary-foreground transition-colors"
              >
                <HighlightedText text={specialty.name} highlight={searchTerm} />
              </button>
            ))}
          </div>
        )}

        {/* Separador */}
        {filteredSpecialties.length > 0 && filteredDoctors.length > 0 && (
          <div className="border-t border-border mx-4" />
        )}

        {/* Doctores */}
        {filteredDoctors.length > 0 && (
          <div className="px-4 py-2">
            {filteredDoctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => onSelectDoctor(doctor)}
                className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-accent hover:text-secondary-foreground transition-colors"
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-medium">
                    <HighlightedText
                      text={doctor.name}
                      highlight={searchTerm}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {doctor.specialty}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
