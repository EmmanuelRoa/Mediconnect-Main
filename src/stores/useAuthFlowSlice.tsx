import { type StateCreator } from "zustand";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";
import { type ResetPasswordSchemaType } from "@/schema/AuthSchema";

export interface AuthFlowSlice {
  loginCredentials: LoginSchemaType;
  forgotPassword: ForgotPasswordSchemaType;
  otp: string;
  resetPassword: ResetPasswordSchemaType;

  setLoginCredentials: (data: LoginSchemaType) => void;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  setOtp: (otp: string) => void;
  setResetPassword: (data: ResetPasswordSchemaType) => void;
  clearAuthFlow: () => void;
}

export const createAuthFlowSlice: StateCreator<AuthFlowSlice> = (set) => ({
  loginCredentials: {
    email: "",
    password: "",
  },
  forgotPassword: {
    email: "",
  },
  otp: "",
  resetPassword: {
    password: "",
    confirmPassword: "",
  },

  setLoginCredentials: (data) => set({ loginCredentials: data }),

  setForgotPassword: (data) => set({ forgotPassword: data }),

  setOtp: (otp) => set({ otp }),

  setResetPassword: (data) => set({ resetPassword: data }),

  clearAuthFlow: () =>
    set({
      loginCredentials: { email: "", password: "" },
      forgotPassword: { email: "" },
      otp: "",
      resetPassword: { password: "", confirmPassword: "" },
    }),
});
