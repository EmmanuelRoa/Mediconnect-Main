import z from "zod";
import { validatePassport } from "@/utils/validatePassport";
import { ValidateDominicanID } from "@/utils/ValidateDominicanID";

export const BasePatientSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  urlImg: z.instanceof(File).optional(),
  identityDocument: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export function PatientOnboardingSchema(t: (key: string) => string) {
  return BasePatientSchema.extend({
    name: z.string().min(1, t("validation.nameRequired")),
    lastName: z.string().min(1, t("validation.lastNameRequired")),
    role: z.literal("Patient"),
    urlImg: z.string().optional(),
    identityDocument: z.string().refine(
      (val) => {
        return ValidateDominicanID(val) || validatePassport(val);
      },
      { message: t("validation.invalidIdentityDocument") }
    ),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
    confirmPassword: z.string().min(6, t("validation.passwordMin")),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("validation.passwordsMustMatch"),
        path: ["confirmPassword"],
      });
    }
  });
}

export function PatientBasicInfoSchema(t: (key: string) => string) {
  return BasePatientSchema.pick({
    name: true,
    lastName: true,
    identityDocument: true,
  }).extend({
    name: z.string().min(1, t("validation.nameRequired")),
    lastName: z.string().min(1, t("validation.lastNameRequired")),
    identityDocument: z.string().refine(
      (val) => {
        return ValidateDominicanID(val) || validatePassport(val);
      },
      { message: t("validation.invalidIdentityDocument") }
    ),
  });
}

export const BaseDoctorSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  gender: z.string(),
  birthDate: z.string(),
  role: z.literal("Doctor"),
  nationality: z.string(),
  identityDocument: z.string(),
  exequatur: z.string(),
  mainSpecialty: z.string(),
  secondarySpecialties: z.array(z.string()).optional(),
  phone: z.string(),
  email: z.string(),
  urlImg: z.string().optional(),
  identityDocumentFile: z.any().optional(),
  certifications: z.array(z.any()).optional(),
  academicTitle: z.any().optional(),
  password: z.string(),
  confirmPassword: z.string(),
});

export function DoctorOnboardingSchema(t: (key: string) => string) {
  return BaseDoctorSchema.extend({
    name: z.string().min(1, t("validation.nameRequired")),
    lastName: z.string().min(1, t("validation.lastNameRequired")),
    gender: z.string().min(1, t("validation.genderRequired")),
    role: z.literal("Doctor"),
    birthDate: z.string().min(1, t("validation.birthDateRequired")),
    nationality: z.string().min(1, t("validation.nationalityRequired")),
    identityDocument: z
      .string()
      .min(1, t("validation.identityDocumentRequired")),
    exequatur: z.string().min(1, t("validation.exequaturRequired")),
    mainSpecialty: z.string().min(1, t("validation.mainSpecialtyRequired")),
    secondarySpecialties: z.array(z.string()).optional(),
    phone: z.string().min(1, t("validation.phoneRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    urlImg: z.string().optional(),
    identityDocumentFile: z.any().optional(),
    certifications: z.array(z.any()).optional(),
    academicTitle: z.any().optional(),
    password: z.string().min(6, t("validation.passwordMin")),
    confirmPassword: z.string().min(6, t("validation.passwordMin")),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("validation.passwordsMustMatch"),
        path: ["confirmPassword"],
      });
    }
  });
}

export function CreatePasswordSchema(t: (key: string) => string) {
  return BasePatientSchema.pick({
    password: true,
    confirmPassword: true,
  })
    .extend({
      password: z.string().min(6, t("validation.passwordMin")),
      confirmPassword: z.string().min(6, t("validation.passwordMin")),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.passwordsMustMatch"),
          path: ["confirmPassword"],
        });
      }
    });
}
