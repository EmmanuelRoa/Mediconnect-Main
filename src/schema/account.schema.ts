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
