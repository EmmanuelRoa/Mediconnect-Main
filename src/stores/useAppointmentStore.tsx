import { create } from "zustand";
import type { scheduleAppointment } from "@/types/AppointmentTypes";

type AppointmentStore = {
  appointment: scheduleAppointment;
  addAppointment: (appointment: scheduleAppointment) => void;
  clearAppointments: () => void;
};

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointment: {
    date: "",
    time: "",
    reason: "",
    insuranceProvider: "",
    selectedModality: "presencial",
    numberOfSessions: 1,
  },
  addAppointment: (data) => set({ appointment: data }),
  clearAppointments: () =>
    set({
      appointment: {
        date: "",
        time: "",
        reason: "",
        insuranceProvider: "",
        selectedModality: "presencial",
        numberOfSessions: 1,
      },
    }),
}));
