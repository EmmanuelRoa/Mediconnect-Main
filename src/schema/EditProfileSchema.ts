import { z } from "zod";

export const profileSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),
  cedula: z
    .string()
    .regex(/^\d{3}-\d{7}-\d{1}$/, "Formato de cédula inválido (000-0000000-0)"),
  email: z.string().email("Correo electrónico inválido"),
  edad: z
    .string()
    .regex(/^\d+$/, "Edad inválida")
    .refine(
      (val) => Number(val) > 0 && Number(val) < 120,
      "Edad fuera de rango"
    ),
  altura: z
    .string()
    .regex(/^\d+$/, "Altura inválida")
    .refine(
      (val) => Number(val) > 0 && Number(val) < 300,
      "Altura fuera de rango"
    ),
  peso: z
    .string()
    .regex(/^\d+$/, "Peso inválido")
    .refine(
      (val) => Number(val) > 0 && Number(val) < 500,
      "Peso fuera de rango"
    ),
  tipoSangre: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/i, "Tipo de sangre inválido (ej: O+)"),
});
