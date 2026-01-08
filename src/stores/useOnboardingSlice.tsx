import { type StateCreator } from "zustand";
import type { PatientOnboardingSchemaType } from "@/types/OnbordingTypes";

export interface OnboardingSlice {
  selectedRole: "Patient" | "Doctor" | "Center" | null;
  patientOnboardingData?: PatientOnboardingSchemaType;
  setPatientOnboardingData?: (data: PatientOnboardingSchemaType) => void;

  setSelectedRole: (role: "Patient" | "Doctor" | "Center" | null) => void;
  clearOnboarding: () => void;
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  selectedRole: null,
  patientOnboardingData: {
    name: "",
    lastName: "",
    role: "Patient",
    identityDocument: "",
    email: "",
    password: "",
    confirmPassword: "",
    urlImg: "",
  },

  setPatientOnboardingData: (data) => set({ patientOnboardingData: data }),

  setSelectedRole: (role) => set({ selectedRole: role }),

  clearOnboarding: () =>
    set({
      selectedRole: null,
      patientOnboardingData: {
        name: "",
        lastName: "",
        role: "Patient",
        identityDocument: "",
        email: "",
        password: "",
        confirmPassword: "",
        urlImg: "",
      },
    }),
});
