import apiClient from "@/services/api/client";
import type { CreateScheduleServiceRequest, CreateScheduleServiceResponse, GetScheduleServicesResponse, ScheduleServiceResponse, ValidateScheduleRequest, ValidateScheduleResponse } from "./schedule.types";

export const scheduleService = {
  getScheduleServices: async (doctorId: string): Promise<GetScheduleServicesResponse> => {
    try {
      const response = await apiClient.get<GetScheduleServicesResponse>(
        `/horarios/doctor/${doctorId}`
      );

      return response.data;
    }catch (error) {
      console.error("Error en scheduleService.getScheduleServices:", error);
      throw error;
    }
  },

  createScheduleService: async (schedule: CreateScheduleServiceRequest): Promise<CreateScheduleServiceResponse> => {
    try {
      const response = await apiClient.post<CreateScheduleServiceResponse>(
        `/horarios`,
        schedule
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data as ScheduleServiceResponse;
      console.error("Error en scheduleService.createScheduleService:", error);
      throw errorData || error;
    }
  },


  validateSchedule: async (schedule: ValidateScheduleRequest): Promise<ValidateScheduleResponse> => {
    try {
      const response = await apiClient.post<ValidateScheduleResponse>(
        `/horarios/verificar-conflictos`,
        schedule
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data as ValidateScheduleResponse;
      console.error("Error en scheduleService.validateSchedule:", error);
      throw errorData || error;
    }
  },

};