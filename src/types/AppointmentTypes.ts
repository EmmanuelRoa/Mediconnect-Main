// AppointmentTypes.ts
import z from "zod";
import {
  appointmentSchemaBase,
  cancelAppointmentSchemaBase,
} from "../schema/appointment.schema";
import type { GetServicesOfDoctor } from "@/shared/navigation/userMenu/editProfile/doctor/services/doctor.types";

export type scheduleAppointment = z.infer<typeof appointmentSchemaBase>;

// Tipo específico para cuando estamos creando (sin ID)
export type CreateAppointment = Omit<scheduleAppointment, "appointmentId">;

export type CancelAppointment = z.infer<typeof cancelAppointmentSchemaBase>;

// Tipo específico para cuando estamos editando (con ID requerido)
export type EditAppointment = Required<scheduleAppointment>;

// ========================================
// TIPOS PARA LA API DE CITAS DEL BACKEND
// ========================================

/**
 * Estado de una cita según el backend
 */
export type CitaEstado = 
  | "Programada" 
  | "En Progreso" 
  | "Completada" 
  | "Cancelada" 
  | "Reprogramada";

/**
 * Información del paciente en una cita
 */
export interface CitaPaciente {
  nombre: string;
  apellido: string;
  usuario: {
    email: string;
    fotoPerfil: string | null;
  };
}

/**
 * Información del doctor en una cita
 */
export interface CitaDoctor {
  usuarioId?: number;
  nombre: string;
  apellido: string;
  usuario: {
    email: string;
    fotoPerfil: string | null;
  };
}

/**
 * Información del servicio en una cita
 */
export interface CitaServicio {
  nombre: string;
  precio: number;
  duracionMinutos: number;
  modalidad: string;
  especialidad: {
    nombre: string;
  };
  tipoServicio: {
    nombre: string;
  };
}

/**
 * Información del horario en una cita
 */
export interface CitaHorario {
  nombre: string;
  diasSemana: number[];
  horaInicio: string;
  horaFin: string;
}

/**
 * Información del seguro en una cita
 */
export interface CitaSeguro {
  id: number;
  nombre: string;
  urlImage: string | null;
}

/**
 * Información del tipo de seguro
 */
export interface CitaTipoSeguro {
  id: number;
  nombre: string;
}

/**
 * Detalle completo de una cita del backend
 */
export interface CitaDetalle {
  id: number;
  doctorId?: number;
  servicioId?: number;
  estado: CitaEstado;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  modalidad: string;
  numPacientes: number;
  totalAPagar: number;
  motivoConsulta: string | null;
  motivoCancelacion: string | null;
  paciente: CitaPaciente;
  doctor: CitaDoctor;
  servicio: GetServicesOfDoctor;
  horario: CitaHorario | null;
  seguro: CitaSeguro | null;
  tipoSeguro: CitaTipoSeguro | null;
  creadoEn: string;
}

/**
 * Paginación de las citas
 */
export interface CitaPaginacion {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

/**
 * Respuesta de la API al listar citas
 */
export interface CitasListResponse {
  success: boolean;
  data: CitaDetalle[] | CitaDetalle;
  paginacion: CitaPaginacion;
}


/**
 * Filtros para la consulta de citas
 */
export interface CitasFilters {
  estado?: CitaEstado;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  limite?: number;
  target?: string;
  source?: string;
  translate_fields?: string;
}
