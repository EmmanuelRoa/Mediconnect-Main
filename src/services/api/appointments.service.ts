/**
 * appointments.service.ts
 * Servicio para gestionar las citas del paciente
 */
import apiClient from './client';
import API_ENDPOINTS from './endpoints';
import type { CitasListResponse, CitasFilters } from '@/types/AppointmentTypes';

/**
 * Obtiene todas las citas del paciente autenticado con soporte para filtros y paginación
 * @param filters - Filtros opcionales para la consulta
 * @returns Promise con la lista de citas y paginación
 */
export const getCitas = async (filters?: CitasFilters): Promise<CitasListResponse> => {
  const params = new URLSearchParams();

  if (filters?.estado) {
    params.append('estado', filters.estado);
  }
  if (filters?.fechaDesde) {
    params.append('fechaDesde', filters.fechaDesde);
  }
  if (filters?.fechaHasta) {
    params.append('fechaHasta', filters.fechaHasta);
  }
  if (filters?.pagina) {
    params.append('pagina', filters.pagina.toString());
  }
  if (filters?.limite) {
    params.append('limite', filters.limite.toString());
  }
  if (filters?.target) {
    params.append('target', filters.target);
  }
  if (filters?.source) {
    params.append('source', filters.source);
  }
  if (filters?.translate_fields) {
    params.append('translate_fields', filters.translate_fields);
  }

  const queryString = params.toString();
  const url = queryString 
    ? `${API_ENDPOINTS.CITAS.LIST}?${queryString}`
    : API_ENDPOINTS.CITAS.LIST;

  const { data } = await apiClient.get<CitasListResponse>(url);
  return data;
};


export const getCitasToDoctors = async (filters?: CitasFilters) => {
  const params = new URLSearchParams();

  if (filters?.estado) {
    params.append('estado', filters.estado);
  }
  if (filters?.fechaDesde) {
    params.append('fechaDesde', filters.fechaDesde);
  }
  if (filters?.fechaHasta) {
    params.append('fechaHasta', filters.fechaHasta);
  }
  if (filters?.pagina) {
    params.append('pagina', filters.pagina.toString());
  }
  if (filters?.limite) {
    params.append('limite', filters.limite.toString());
  }
  if (filters?.target) {
    params.append('target', filters.target);
  }
  if (filters?.source) {
    params.append('source', filters.source);
  }
  if (filters?.translate_fields) {
    params.append('translate_fields', filters.translate_fields);
  }

  const queryString = params.toString();
  const url = queryString 
    ? `${API_ENDPOINTS.CITAS.TO_DOCTORS}?${queryString}`
    : API_ENDPOINTS.CITAS.TO_DOCTORS;

  const { data } = await apiClient.get<CitasListResponse>(url);
  return data;
}

/**
 * Obtiene una cita específica por ID
 * @param id - ID de la cita
 * @returns Promise con los detalles de la cita
 */
export const getCitaById = async (id: string | number) : Promise<CitasListResponse> => {
  const { data } = await apiClient.get<CitasListResponse>(API_ENDPOINTS.CITAS.BY_ID(id));
  return data;
};



export const cancelCita = async (id: string | number, motivo: string) => {
  try {
    const { data } = await apiClient.patch(API_ENDPOINTS.CITAS.CANCEL(id), { motivoCancelacion: motivo });
    return data;
  } catch (error) {
    console.error('Error cancelando la cita:', error);
    throw error;
  }
}