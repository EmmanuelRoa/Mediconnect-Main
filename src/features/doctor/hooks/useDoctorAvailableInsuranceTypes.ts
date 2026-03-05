import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { QUERY_KEYS } from '@/lib/react-query/config';
import { doctorService } from '@/shared/navigation/userMenu/editProfile/doctor/services/doctor.service';

/**
 * Hook para obtener los tipos de seguros disponibles del catálogo (Doctor)
 * Implementa caché agresivo ya que estos datos cambian raramente
 * 
 * @param options - Opciones de configuración del hook
 * @returns Query con los tipos de seguros disponibles
 * 
 * @example
 * const { data: insuranceTypes = [], isLoading } = useDoctorAvailableInsuranceTypes();
 */
export const useDoctorAvailableInsuranceTypes = (options?: {
  enabled?: boolean;
  staleTime?: number;
}) => {
  const { i18n } = useTranslation();
  const language = i18n.language || 'es';

  return useQuery({
    queryKey: QUERY_KEYS.INSURANCE_TYPES(language),
    queryFn: async () => {
      const response = await doctorService.getAvailableInsuranceTypes(language);
      if (!response.success) {
        throw new Error('Error al cargar tipos de seguros');
      }
      return response.data;
    },
    // Caché agresivo: 30 minutos
    staleTime: options?.staleTime ?? 1000 * 60 * 30,
    // Garbage collection: 1 hora
    gcTime: 1000 * 60 * 60,
    // No refetch automático (los datos son muy estables)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: options?.enabled ?? true,
  });
};

export default useDoctorAvailableInsuranceTypes;
