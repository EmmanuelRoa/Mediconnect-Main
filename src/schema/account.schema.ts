import { z } from "zod";

export const verifyAccountSchema = z.object({
  password: z.string().min(8, { message: "La contraseña es obligatoria." }),
});

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio." })
    .email({ message: "El correo electrónico no es válido." }),
  otp: z
    .string()
    .length(4, { message: "El código OTP debe tener 4 dígitos." })
    .regex(/^\d+$/, { message: "El código OTP debe ser numérico." }),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "La nueva contraseña debe tener al menos 8 caracteres.",
    }),
    confirmNewPassword: z
      .string()
      .min(8, { message: "Debes confirmar la nueva contraseña." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las nuevas contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });

export const profileVisibilitySchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE", "RELATIONSHIPS_ONLY"], {
    message: "La visibilidad del perfil es obligatoria.",
  }),
});

export const patientPrivacyMessageSchema = z.object({
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad.",
  }),
});

export const doctorMessageConfigSchema = z.object({
  patientMessage: z.enum(["WITH_APPOINTMENT", "PREVIOUS", "NONE"], {
    message: "Invalid patient message configuration.",
  }),
  centerMessage: z.enum(["CONNECTION_ESTABLISHED", "ANY_CENTER", "NONE"], {
    message: "Invalid center message configuration.",
  }),
});

export const centerMessageConfigSchema = z.object({
  patientMessage: z.enum(["ANY", "WITH_APPOINTMENT", "NONE"], {
    message: "Invalid patient message configuration.",
  }),
  doctorMessage: z.enum(["ANY", "AFFILIATED", "NONE"], {
    message: "Invalid doctor message configuration.",
  }),
});

export const patientMessageConfigSchema = z.object({
  doctorMessage: z.enum(["ANY", "MY_DOCTORS", "WITH_APPOINTMENT", "NONE"], {
    message: "Invalid doctor message configuration.",
  }),
  centerMessage: z.enum(["ANY", "WITH_APPOINTMENT", "NONE"], {
    message: "Invalid center message configuration.",
  }),
});
