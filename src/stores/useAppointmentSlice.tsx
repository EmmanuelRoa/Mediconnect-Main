import { type StateCreator } from "zustand";
import type {
  scheduleAppointment,
  CancelAppointment,
} from "@/types/AppointmentTypes";

export interface AppointmentSlice {
  isAppointmentInProgress?: boolean;
  appointment: scheduleAppointment & { selectedServiceId?: string };

  cancelAppointment?: CancelAppointment;

  setCancelAppointment?: (data: CancelAppointment) => void;

  addAppointment: (
    appointment: scheduleAppointment & { selectedServiceId?: string },
  ) => void;

  setIsAppointmentInProgress?: (inProgress: boolean) => void;
  clearAppointments: () => void;
}

export const createAppointmentSlice: StateCreator<AppointmentSlice> = (
  set,
) => ({
  appointment: {
    date: "",
    time: "",
    reason: "",
    insuranceProvider: "",
    selectedModality: "presencial",
    numberOfSessions: 1,
    serviceId: "",
    doctorId: "",
    // appointmentId es opcional - solo existe cuando editamos
    appointmentId: undefined,
  },

  addAppointment: (data) => set({ appointment: data }),

  cancelAppointment: {
    cancellationReason: "",
  },

  setCancelAppointment: (data) => set({ cancelAppointment: data }),

  isAppointmentInProgress: false,

  setIsAppointmentInProgress: (inProgress) =>
    set({ isAppointmentInProgress: inProgress }),

  clearAppointments: () =>
    set({
      appointment: {
        date: "",
        time: "",
        reason: "",
        insuranceProvider: "",
        selectedModality: "presencial",
        numberOfSessions: 1,
        serviceId: "",
        doctorId: "",
        appointmentId: undefined,
      },
    }),
});
