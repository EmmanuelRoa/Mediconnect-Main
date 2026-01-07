import { type StateCreator } from "zustand";

export interface AuthSlice {
  isAuthenticated: boolean;
  token: string | null;

  login: (token: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  token: null,

  login: (token) =>
    set({
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
    }),
});
