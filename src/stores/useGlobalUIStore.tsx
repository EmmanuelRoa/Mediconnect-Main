import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";

export const useGlobalUIStore = create<GlobalUISlice>()(
  persist(
    (...a) => ({
      ...createGlobalUISlice(...a),
    }),
    {
      name: "app-ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
