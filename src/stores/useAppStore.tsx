import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AuthSlice, createAuthSlice } from "@/stores/useAuthSlice";
import {
  type OnboardingSlice,
  createOnboardingSlice,
} from "@/stores/useOnboardingSlice";
import {
  type AuthFlowSlice,
  createAuthFlowSlice,
} from "@/stores/useAuthFlowSlice";
import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";

type AppStore = GlobalUISlice & AuthSlice & OnboardingSlice & AuthFlowSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createGlobalUISlice(...a),
      ...createAuthSlice(...a),
      ...createOnboardingSlice(...a),
      ...createAuthFlowSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        // De AuthSlice (sesión persistente)
        isAuthenticated: state.isAuthenticated,
        token: state.token,

        // De OnboardingSlice (rol persistente)
        selectedRole: state.selectedRole,

        // De AuthFlowSlice (datos temporales del flujo)
        forgotPassword: state.forgotPassword,
        otp: state.otp,

        // De GlobalUISlice
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
