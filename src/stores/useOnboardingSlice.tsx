import { type StateCreator } from "zustand";

export interface OnboardingSlice {
  selectedRole: string | null;

  setSelectedRole: (role: string | null) => void;
  clearOnboarding: () => void;
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  selectedRole: null,

  setSelectedRole: (role) => set({ selectedRole: role }),

  clearOnboarding: () =>
    set({
      selectedRole: null,
    }),
});
