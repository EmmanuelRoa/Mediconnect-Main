/**
 * DoctorStatsTypes.ts
 * Tipos para las estadísticas del doctor
 */

/**
 * Estadísticas de resumen del doctor
 */
export interface DoctorStatsResumen {
  /**
   * Total de pacientes activos
   */
  totalPacientes: number;

  /**
   * Total de citas/consultas
   */
  totalCitas: number;

  /**
   * Total ganado en la moneda local (ej: RD$)
   */
  totalGanancias: string | number;

  /**
   * Porcentaje de cambio respecto al período anterior
   */
  porcentajeCambio?: number;
}

/**
 * Servicio más utilizado
 */
export interface ServicioUtilizado {
  nombre: string;
  totalCitas: number;
  color?: string;
  porcentaje?: number;
}

/**
 * Respuesta de servicios más utilizados
 */
export interface DoctorServicesUtilizadosResponse {
  success: boolean;
  masUtilizados: ServicioUtilizado[];
  message?: string;
}

/**
 * Punto de datos del backend para productividad
 */
export interface ProductividadDataPoint {
  label: string;
  consultas: number;
  ingresos: number;
}

/**
 * Totales de productividad
 */
export interface ProductividadTotales {
  consultas: number;
  ingresos: number;
}

/**
 * Respuesta cruda del backend para productividad
 */
export interface DoctorProductividadRawResponse {
  success: boolean;
  periodo: string;
  puntos: ProductividadDataPoint[];
  totales: ProductividadTotales;
}

/**
 * Dato de productividad por período (transformado para el frontend)
 */
export interface ProductividadDato {
  day: string;
  consultas: number;
  ingresos: number;
}

/**
 * Respuesta de productividad (transformada para el frontend)
 */
export interface DoctorProductividadResponse {
  success: boolean;
  data: ProductividadDato[];
  message?: string;
}

/**
 * Respuesta del endpoint de estadísticas de resumen
 */
export interface DoctorStatsResponse {
  success: boolean;
  data: DoctorStatsResumen;
  message?: string;
}

/**
 * Estadísticas de servicios del doctor
 */
export interface DoctorServicesStats {
  totalServicios: number;
  serviciosActivos: number;
  serviciosInactivos: number;
  promedioRating: number;
}

/**
 * Respuesta del endpoint de estadísticas de servicios
 */
export interface DoctorServicesStatsResponse {
  success: boolean;
  data: DoctorServicesStats;
}

/**
 * Estadísticas de pacientes del doctor
 */
export interface DoctorPatientsStats {
  /**
   * Total de pacientes
   */
  totalPacientes: number;

  /**
   * Pacientes con condiciones activas
   */
  pacientesConCondicionesActivas: number;

  /**
   * Pacientes con alergias
   */
  pacientesConAlergias: number;

  /**
   * Edad promedio de los pacientes
   */
  edadPromedio: number;
}

/**
 * Filtros aplicados en la consulta de pacientes
 */
export interface DoctorPatientsStatsFilters {
  /**
   * Fecha desde (formato ISO 8601)
   */
  fechaDesde: string;

  /**
   * Fecha hasta (formato ISO 8601)
   */
  fechaHasta: string;

  /**
   * ID del servicio
   */
  servicioId: number;
}

/**
 * Respuesta del endpoint de estadísticas de pacientes
 */
export interface DoctorPatientsStatsResponse {
  success: boolean;
  filtros: DoctorPatientsStatsFilters;
  data: DoctorPatientsStats;
}
