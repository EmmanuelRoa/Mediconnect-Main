import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import SearchDropdown from "./searchComponent/SearchDropdown";
import InsuranceDropdown from "@/features/patient/components/searchComponent/InsuranceDropdown";
import type { Doctor, Specialty, InsurancePlan } from "@/data/searchData";

const DoctorSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [insurance, setInsurance] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 150);
  const searchRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (
        insuranceRef.current &&
        !insuranceRef.current.contains(event.target as Node)
      ) {
        setShowInsuranceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    console.log("Buscando:", { searchTerm, insurance });
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSearchTerm(doctor.name);
    setShowSearchDropdown(false);
  };

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSearchTerm(specialty.name);
    setShowSearchDropdown(false);
  };

  const handleSelectInsurance = (plan: InsurancePlan) => {
    setInsurance(plan.name);
    setShowInsuranceDropdown(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-full shadow-search flex items-center p-2 pl-6 relative border-2 border-foreground/10">
        {/* Campo de búsqueda */}
        <div ref={searchRef} className="flex-1 py-2 relative">
          <label className="block text-sm font-medium text-foreground mb-1">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre del doctor, centro de salud o especialidad"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full bg-transparent text-muted-foreground placeholder:text-muted-foreground/70 text-sm focus:outline-none"
          />
          {showSearchDropdown && debouncedSearch && (
            <SearchDropdown
              searchTerm={debouncedSearch}
              onSelectDoctor={handleSelectDoctor}
              onSelectSpecialty={handleSelectSpecialty}
            />
          )}
        </div>

        {/* Separador */}
        <div className="w-px h-12 bg-border mx-4" />

        {/* Campo de seguro */}
        <div ref={insuranceRef} className="flex-1 py-2 relative">
          <label className="block text-sm font-medium text-foreground mb-1">
            Seguro
          </label>
          <input
            type="text"
            placeholder="Agregar plan de seguros"
            value={insurance}
            onChange={(e) => {
              setInsurance(e.target.value);
              setShowInsuranceDropdown(true);
            }}
            onFocus={() => setShowInsuranceDropdown(true)}
            className="w-full bg-transparent text-muted-foreground placeholder:text-muted-foreground/70 text-sm focus:outline-none"
          />
          {showInsuranceDropdown && (
            <InsuranceDropdown
              searchTerm={insurance}
              onSelect={handleSelectInsurance}
            />
          )}
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleSearch}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors ml-4"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default DoctorSearchBar;
