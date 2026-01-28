import type { StateCreator } from "zustand";
import type {
  VerifyAccount,
  ChangeEmail,
  ChangePassword,
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
});
