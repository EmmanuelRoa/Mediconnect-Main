import { type StateCreator } from "zustand";

export interface DoctorFiltersSlice {
  doctorFilters: {
    name: string;
    specialty: string;
    yearsOfExperience: number | null;
    languages: string[];
    acceptingInsurance: string[];
    isFavorite: boolean | null;
    rating: number | null;
  };

  SearchProviderFilters: {
    name: string;
    insuranceAccepted: string[];
    providerType: string[];
    modality: string[];
    specialty: string[];
    gender: string[];
    yearsOfExperience: number | null;
    languages: string[];
    scheduledAppointments: string[];
    rating: number | null;
  };

  setDoctorFilters: (filters: DoctorFiltersSlice["doctorFilters"]) => void;
  setSearchProviderFilters: (
    filters: DoctorFiltersSlice["SearchProviderFilters"],
  ) => void;
}

export const createDoctorFiltersSlice: StateCreator<DoctorFiltersSlice> = (
  set,
) => ({
  doctorFilters: {
    name: "",
    specialty: "",
    yearsOfExperience: null,
    languages: [],
    acceptingInsurance: [],
    isFavorite: null,
    rating: null,
  },

  setDoctorFilters: (filters) =>
    set(() => ({
      doctorFilters: filters,
    })),
  SearchProviderFilters: {
    name: "",
    insuranceAccepted: [],
    providerType: [],
    modality: [],
    gender: [],
    specialty: [],
    yearsOfExperience: null,
    languages: [],
    scheduledAppointments: [],
    rating: null,
  },

  setSearchProviderFilters: (filters) =>
    set(() => ({
      SearchProviderFilters: filters,
    })),
});
