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
import { type ChatSlice, createChatSlice } from "@/stores/useChatSlice";

type AppStore = AuthSlice & OnboardingSlice & AuthFlowSlice & ChatSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createOnboardingSlice(...a),
      ...createAuthFlowSlice(...a),
      ...createChatSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // AuthSlice
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,

        // AuthFlowSlice
        verifyEmail: state.verifyEmail,
        forgotPassword: state.forgotPassword,
        otp: state.otp,
        registrationToken: state.registrationToken,
        googleUserData: state.googleUserData,

        // OnboardingSlice
        selectedRole: state.selectedRole,
        patientOnboardingData: state.patientOnboardingData,
        doctorOnboardingData: state.doctorOnboardingData,
        centerOnboardingData: state.centerOnboardingData,

        // ChatSlice NO se persiste - se carga desde API
      }),
    },
  ),
);
