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
