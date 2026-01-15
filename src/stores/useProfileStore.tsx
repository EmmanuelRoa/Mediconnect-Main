import { create } from "zustand";

export type UserRole = "PATIENT" | "DOCTOR" | "CENTER";

interface BaseProfile {
  id: string;
  role: UserRole;
  nombre: string;
  email: string;
  telefono?: string;
  avatar?: string;
  banner?: string;
}

interface DoctorProfile extends BaseProfile {
  especialidad: string;
  anosExperiencia: number;
  biografia?: string;
}

interface PatientProfile extends BaseProfile {
  cedula: string;
  edad?: number;
  tipoSangre?: string;
}

interface CenterProfile extends BaseProfile {
  tipoCentro: string;
  sitioWeb?: string;
}

type Profile = DoctorProfile | PatientProfile | CenterProfile;

interface ProfileState {
  byId: Record<string, Profile>;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  byId: {},

  setProfile: (profile) =>
    set((state) => ({
      byId: {
        ...state.byId,
        [profile.id]: profile,
      },
    })),

  updateProfile: (id, data) =>
    set((state) => ({
      byId: {
        ...state.byId,
        [id]: {
          ...state.byId[id],
          ...data,
        },
      },
    })),
}));
