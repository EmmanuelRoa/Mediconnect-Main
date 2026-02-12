import type { StateCreator } from "zustand";
import type {
  CreateServiceType,
  LocationType,
  ComercialScheduleType,
} from "@/types/CreateServiceType";

interface CreateServicesSlice {
  createServiceData: CreateServiceType;
  setCreateServiceData: (data: Partial<CreateServiceType>) => void;
  setCreateServiceField: (field: keyof CreateServiceType, value: any) => void;

  locationData: LocationType;
  setLocationData: (data: Partial<LocationType>) => void;

  comercialScheduleData: ComercialScheduleType;
  setComercialScheduleData: (data: Partial<ComercialScheduleType>) => void;
}

const createServicesSlice: StateCreator<CreateServicesSlice> = (set) => ({
  createServiceData: {
    name: "",
    specialty: "",
    selectedModality: "presencial",
    price: 0,
    numberOfSessions: 1,
    duration: {
      hours: 0,
      minutes: 1,
    },
    pricePerSession: 0,
    images: [],
    comercial_schedule: [],
    description: "",
    insuranceAccepted: "",
    location: undefined,
  },
  setCreateServiceData: (data) =>
    set((state) => ({
      createServiceData: { ...state.createServiceData, ...data },
    })),
  setCreateServiceField: (field, value) =>
    set((state) => ({
      createServiceData: { ...state.createServiceData, [field]: value },
    })),

  locationData: {
    name: "",
    address: "",
    province: "",
    municipality: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
  },
  setLocationData: (data) =>
    set((state) => ({
      locationData: { ...state.locationData, ...data },
    })),

  comercialScheduleData: {
    name: "",
    day: [],
    startTime: "",
    endTime: "",
    locationId: "",
  },
  setComercialScheduleData: (data) =>
    set((state) => ({
      comercialScheduleData: {
        ...state.comercialScheduleData,
        ...data,
      },
    })),
});

export default createServicesSlice;
