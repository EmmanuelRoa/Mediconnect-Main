import z from "zod";
import {
  verifyAccountSchema,
  changeEmailSchema,
  changePasswordSchema,
  profileVisibilitySchema,
  doctorMessageConfigSchema,
  centerMessageConfigSchema,
  patientMessageConfigSchema,
} from "@/schema/account.schema";

export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
export type ChangeEmail = z.infer<typeof changeEmailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type ProfileVisibility = z.infer<typeof profileVisibilitySchema>;

export type DoctorMessageConfig = z.infer<typeof doctorMessageConfigSchema>;
export type CenterMessageConfig = z.infer<typeof centerMessageConfigSchema>;
export type PatientMessageConfig = z.infer<typeof patientMessageConfigSchema>;
