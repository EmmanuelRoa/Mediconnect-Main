import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/lib/react-query/config';
import { patientService } from '../services/patient.service';
import { emitConditionsChanged } from '@/lib/events/clinicalHistoryEvents';

/**
 * Hook para agregar una condición médica al historial del paciente
 * Invalida automáticamente el caché de "mis condiciones"
 * 
 * @example
 * const addCondition = useAddCondition();
 * await addCondition.mutateAsync({ condicionId: 123, notas: 'Notas adicionales' });
 */
export const useAddCondition = () => {
  const { t, i18n } = useTranslation('patient');
  const queryClient = useQueryClient();
  const language = i18n.language || 'es';

  return useMutation({
    mutationFn: async (data: { condicionId: number; notas: string }) => {
      const response = await patientService.addCondition(data);
      if (!response.success) {
        throw new Error(response.message || 'Error al agregar condición médica');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar el caché de mis condiciones para forzar refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_CONDITIONS(language),
      });
      
      // Emitir evento para notificar a otros componentes
      emitConditionsChanged();
      
      toast.success(
        t('clinicalHistory.conditionAdded', 'Condición médica agregada exitosamente')
      );

      return data;
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t('clinicalHistory.errorAddingCondition', 'Error al agregar condición médica')
      );
    },
  });
};

/**
 * Hook para agregar una condición médica personal al historial del paciente
 * Invalida automáticamente el caché de "mis condiciones"
 * 
 * @example
 * const addPersonalCondition = useAddPersonalCondition();
 * await addPersonalCondition.mutateAsync({ notas: 'Mi condición personal' });
 */
export const useAddPersonalCondition = () => {
  const { t, i18n } = useTranslation('patient');
  const queryClient = useQueryClient();
  const language = i18n.language || 'es';

  return useMutation({
    mutationFn: async (data: { notas: string }) => {
      const response = await patientService.addPersonalCondition(data);
      if (!response.success) {
        throw new Error(response.message || 'Error al agregar condición médica personal');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidar el caché de mis condiciones para forzar refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_CONDITIONS(language),
      });
      
      // Emitir evento para notificar a otros componentes
      emitConditionsChanged();
      
      toast.success(
        t('clinicalHistory.personalConditionAdded', 'Condición médica personal agregada exitosamente')
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t('clinicalHistory.errorAddingPersonalCondition', 'Error al agregar condición médica personal')
      );
    },
  });
};

/**
 * Hook para eliminar una condición médica del historial del paciente
 * Invalida automáticamente el caché de "mis condiciones"
 * 
 * @example
 * const removeCondition = useRemoveCondition();
 * await removeCondition.mutateAsync(123);
 */
export const useRemoveCondition = () => {
  const { t, i18n } = useTranslation('patient');
  const queryClient = useQueryClient();
  const language = i18n.language || 'es';

  return useMutation({
    mutationFn: async (condicionId: number) => {
      const response = await patientService.removeCondition(condicionId);
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar condición médica');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidar el caché de mis condiciones para forzar refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_CONDITIONS(language),
      });
      
      // Emitir evento para notificar a otros componentes
      emitConditionsChanged();
      
      toast.success(
        t('clinicalHistory.conditionRemoved', 'Condición médica eliminada exitosamente')
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t('clinicalHistory.errorRemovingCondition', 'Error al eliminar condición médica')
      );
    },
  });
};
