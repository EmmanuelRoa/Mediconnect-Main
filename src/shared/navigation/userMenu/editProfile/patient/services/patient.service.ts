import apiClient from '@/services/api/client';
import type { 
  UpdatePatientProfileRequest, 
  UpdatePatientProfileResponse,
  UpdatePatientProfileError 
} from './patient.types';

/**
 * Servicio para actualizar el perfil del paciente autenticado
 */
export const patientService = {
  /**
   * Actualiza el perfil del paciente autenticado
   * @param data - Datos del perfil a actualizar
   * @returns Respuesta con los datos actualizados
   */
  updateProfile: async (
    data: UpdatePatientProfileRequest
  ): Promise<UpdatePatientProfileResponse> => {
    try {
      const response = await apiClient.patch<UpdatePatientProfileResponse>(
        '/pacientes/me',
        data
      );

      console.log('✅ [Patient Service] Perfil actualizado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Patient Service] Error al actualizar perfil:', error);
      
      // El apiClient ya maneja los errores comunes (401, 403, etc.)
      // Aquí solo manejamos errores específicos del endpoint
      const errorData = error.response?.data as UpdatePatientProfileError;
      
      if (error.response?.status === 404) {
        throw new Error('Perfil de paciente no encontrado.');
      }
      
      if (error.response?.status === 409) {
        throw new Error('El documento de identidad ya está registrado.');
      }
      
      // Error genérico del servidor o del cliente API
      throw new Error(
        errorData?.message || 
        error.message || 
        'Error al actualizar el perfil. Intenta nuevamente.'
      );
    }
  },
};
