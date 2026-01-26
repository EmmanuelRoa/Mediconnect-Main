import z from "zod";
import { appointmentSchema } from "../schema/appointment.schema";
export type scheduleAppointment = z.infer<typeof appointmentSchema>;
