import { z } from "zod";
import {
  PatientOnboardingSchema,
  PatientBasicInfoSchema,
  CreatePasswordSchema,
  DoctorOnboardingSchema,
} from "@/schema/OnbordingSchema";

export type PatientOnboardingSchemaType = z.infer<
  ReturnType<typeof PatientOnboardingSchema>
>;
export type PatientBasicInfoSchemaType = z.infer<
  ReturnType<typeof PatientBasicInfoSchema>
>;
export type PatientCreatePasswordSchemaType = z.infer<
  ReturnType<typeof CreatePasswordSchema>
>;
export type DoctorOnboardingSchemaType = z.infer<
  ReturnType<typeof DoctorOnboardingSchema>
>;
