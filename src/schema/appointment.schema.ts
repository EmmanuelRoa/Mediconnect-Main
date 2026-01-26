import z, { number } from "zod";

export const appointmentSchema = (t: (key: string) => string) =>
  z.object({
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: t("appointment.invalidDate"),
    }),
    time: z.string().min(1, { message: t("appointment.timeRequired") }),
    selectedModality: z.enum(["presencial", "teleconsulta"], {
      message: t("appointment.modalityRequired"),
    }),
    numberOfSessions: number()
      .min(1, { message: t("appointment.sessionsMin") })
      .max(5, { message: t("appointment.sessionsMax") })
      .default(1),
    reason: z
      .string()
      .min(10, { message: t("appointment.reasonMin") })
      .max(100, { message: t("appointment.reasonMax") }),
    insuranceProvider: z
      .string()
      .min(1, { message: t("appointment.insuranceRequired") }),
  });
