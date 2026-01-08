import { type StateCreator } from "zustand";
import type {
  PatientOnboardingSchemaType,
  DoctorOnboardingSchemaType,
} from "@/types/OnbordingTypes";

export interface OnboardingSlice {
  selectedRole: "Patient" | "Doctor" | "Center" | null;
  patientOnboardingData?: PatientOnboardingSchemaType;
  doctorOnboardingData?: DoctorOnboardingSchemaType;

  setPatientOnboardingData?: (data: PatientOnboardingSchemaType) => void;
  setDoctorOnboardingData?: (data: DoctorOnboardingSchemaType) => void;

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
  doctorOnboardingData: {
    name: "",
    lastName: "",
    gender: "",
    birthDate: "",
    nationality: "",
    identityDocument: "",
    exequatur: "",
    mainSpecialty: "",
    phone: "",
    email: "",
    secondarySpecialties: [],
    urlImg: "",
    identityDocumentFile: null,
    certifications: [],
    academicTitle: null,
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

      doctorOnboardingData: {
        name: "",
        lastName: "",
        gender: "",
        birthDate: "",
        nationality: "",
        identityDocument: "",
        exequatur: "",
        mainSpecialty: "",
        phone: "",
        email: "",
        secondarySpecialties: [],
        urlImg: "",
        identityDocumentFile: null,
        certifications: [],
        academicTitle: null,
      },
    }),
});
