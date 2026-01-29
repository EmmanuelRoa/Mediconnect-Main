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

// Helper para extraer tipos sin necesidad de t
type SchemaInfer<T extends (t: any) => z.ZodType> = z.infer<ReturnType<T>>;

export type VerifyAccount = SchemaInfer<typeof verifyAccountSchema>;
export type ChangeEmail = SchemaInfer<typeof changeEmailSchema>;
export type ChangePassword = SchemaInfer<typeof changePasswordSchema>;
export type ProfileVisibility = SchemaInfer<typeof profileVisibilitySchema>;
export type DoctorMessageConfig = SchemaInfer<typeof doctorMessageConfigSchema>;
export type CenterMessageConfig = SchemaInfer<typeof centerMessageConfigSchema>;
export type PatientMessageConfig = SchemaInfer<
  typeof patientMessageConfigSchema
>;
