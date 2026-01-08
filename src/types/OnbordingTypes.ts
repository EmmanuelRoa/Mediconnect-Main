import { z } from "zod";
import {
  PatientOnboardingSchema,
  PatientBasicInfoSchema,
  PatientCreatePasswordSchema,
} from "@/schema/OnbordingSchema";

export type PatientOnboardingSchemaType = z.infer<
  ReturnType<typeof PatientOnboardingSchema>
>;
export type PatientBasicInfoSchemaType = z.infer<
  ReturnType<typeof PatientBasicInfoSchema>
>;
export type PatientCreatePasswordSchemaType = z.infer<
  ReturnType<typeof PatientCreatePasswordSchema>
>;
