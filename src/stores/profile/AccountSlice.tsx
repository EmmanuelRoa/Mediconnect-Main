import type { StateCreator } from "zustand";
import type {
  VerifyAccount,
  ChangeEmail,
  ChangePassword,
  ProfileVisibility,
  DoctorMessageConfig,
  CenterMessageConfig,
  PatientMessageConfig,
} from "@/types/AccountTypes";

export interface AccountSlice {
  verifyAccountPassword: VerifyAccount | null;
  setVerifyAccountPassword: (data: VerifyAccount) => void;
  clearVerifyAccountPassword: () => void;
  changeEmailData: ChangeEmail | null;
  setChangeEmailData: (data: ChangeEmail) => void;
  clearChangeEmailData: () => void;
  changePasswordData: ChangePassword | null;
  setChangePasswordData: (data: ChangePassword) => void;
  clearChangePasswordData: () => void;
  profileVisibilityData: ProfileVisibility | null;
  setProfileVisibilityData: (data: ProfileVisibility) => void;
  clearProfileVisibilityData: () => void;
  doctorMessageConfigData: DoctorMessageConfig | null;
  setDoctorMessageConfigData: (data: DoctorMessageConfig) => void;
  clearDoctorMessageConfigData: () => void;
  centerMessageConfigData: CenterMessageConfig | null;
  setCenterMessageConfigData: (data: CenterMessageConfig) => void;
  clearCenterMessageConfigData: () => void;
  patientMessageConfigData: PatientMessageConfig | null;
  setPatientMessageConfigData: (data: PatientMessageConfig) => void;
  clearPatientMessageConfigData: () => void;
}

export const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  verifyAccountPassword: null,
  setVerifyAccountPassword: (data) => set({ verifyAccountPassword: data }),
  clearVerifyAccountPassword: () => set({ verifyAccountPassword: null }),
  changeEmailData: null,
  setChangeEmailData: (data) => set({ changeEmailData: data }),
  clearChangeEmailData: () => set({ changeEmailData: null }),
  changePasswordData: null,
  setChangePasswordData: (data) => set({ changePasswordData: data }),
  clearChangePasswordData: () => set({ changePasswordData: null }),
  profileVisibilityData: null,
  setProfileVisibilityData: (data) => set({ profileVisibilityData: data }),
  clearProfileVisibilityData: () => set({ profileVisibilityData: null }),
  doctorMessageConfigData: null,
  setDoctorMessageConfigData: (data) => set({ doctorMessageConfigData: data }),
  clearDoctorMessageConfigData: () => set({ doctorMessageConfigData: null }),
  centerMessageConfigData: null,
  setCenterMessageConfigData: (data) => set({ centerMessageConfigData: data }),
  clearCenterMessageConfigData: () => set({ centerMessageConfigData: null }),
  patientMessageConfigData: null,
  setPatientMessageConfigData: (data) =>
    set({ patientMessageConfigData: data }),
  clearPatientMessageConfigData: () => set({ patientMessageConfigData: null }),
});
