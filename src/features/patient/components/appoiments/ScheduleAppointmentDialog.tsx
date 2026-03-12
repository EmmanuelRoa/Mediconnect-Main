import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { Calendar } from "@/shared/ui/calendar";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import MCSelect from "@/shared/components/forms/MCSelect";
import { useNavigate } from "react-router-dom";
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/shared/ui/morphing-popover";
import { appointmentSchema } from "@/schema/appointment.schema";
import { useTranslation } from "react-i18next";
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import {
  CalendarIcon,
  Minus,
  Plus,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import MCButton from "@/shared/components/forms/MCButton";
import { cn } from "@/lib/utils";
import type { scheduleAppointment } from "@/types/AppointmentTypes";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import ServiceCards from "./ServiceCards";
import FilterAppointments from "@/features/patient/components/filters/FilterAppointments";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import React from "react";
import type { GetServicesOfDoctor, GetSlotsAvailableForServiceResponse, ServiceDetail, ServiceDetailDoctor } from "@/shared/navigation/userMenu/editProfile/doctor/services/doctor.types";
import { getUserFullName } from "@/services/auth/auth.types";
import { useMyInsurances } from "../../hooks";
import { doctorService } from "@/shared/navigation/userMenu/editProfile/doctor/services";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import apiClient from "@/services/api/client";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { getCitaById } from "@/services/api/appointments.service";
import type { CitaDetalle } from "@/types/AppointmentTypes";

interface AppointmentFilters {
  serviceTypes: string[];
  specialties: string[];
  modalities: string[];
  priceRange: [number, number];
  rating: number;
}

interface ScheduleAppointmentDialogProps {
  idProvider: string;
  idAppointment?: string;
  idService?: string;
  children: React.ReactNode;
  serviceData?: ServiceDetail;
  initialRescheduleData?: Partial<scheduleAppointment>;
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const formatDateForStorage = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateFromStorage = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

function ScheduleAppointmentForm({
  isRescheduling,
  serviceData,
  isSubmitting,
}: {
  isRescheduling: boolean;
  idService?: string;
  serviceData?: ServiceDetail;
  isSubmitting: boolean;
}) {
  const { t, i18n } = useTranslation("patient");
  const currentLocale = i18n.language === "es" ? es : enUS;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { watch, setValue } = useFormContext<scheduleAppointment>();
  const formValues = watch();
  const initialValuesRef = useRef<scheduleAppointment | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<GetServicesOfDoctor[]>([]);
  const { data: availableInsurances = [], isLoading: isLoadingInsurances } = useMyInsurances();
  
  const [slotHorarioMap, setSlotHorarioMap] = useState<Record<string, Record<string, number>>>({});

  const [insuranceStatus, setInsuranceStatus] = useState<{
    isChecking: boolean;
    isCompatible: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isCompatible: null,
    message: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getSlotsForService = async (serviceId: string): Promise<GetSlotsAvailableForServiceResponse> => {
    const slotResponse = await doctorService.getSlotsAvailableForService(Number(serviceId), {
      fecha: formValues.date ? formatDateForStorage(parseDateFromStorage(formValues.date)) : formatDateForStorage(new Date()),
    });

    return slotResponse;
  };

  const verificarCompatibilidadSeguro = useCallback(async (seguroId: string) => {
    if (!seguroId || !serviceData?.doctorId) {
      setInsuranceStatus({
        isChecking: false,
        isCompatible: null,
        message: "",
      });
      return;
    }

    const seguroSeleccionado = availableInsurances.find(
      (insurance) => insurance.id.toString() === seguroId
    );

    if (!seguroSeleccionado) {
      setInsuranceStatus({
        isChecking: false,
        isCompatible: null,
        message: "",
      });
      return;
    }

    setInsuranceStatus({
      isChecking: true,
      isCompatible: null,
      message: t("insurance.verifying", "Verificando compatibilidad..."),
    });

    try {
      const response = await apiClient.get(
        `/seguros/verificar-compatibilidad/${seguroSeleccionado.id}/${seguroSeleccionado.idTipoSeguro}/doctor/${serviceData.doctorId}`,
        {
          params: {
            target: i18n.language || "es",
            source: i18n.language === "es" ? "en" : "es",
            translate_fields: "mensaje",
          },
        }
      );

      setInsuranceStatus({
        isChecking: false,
        isCompatible: response.data.data.compatible,
        message: response.data.data.mensaje || (response.data.data.compatible 
          ? t("insurance.compatible", "Este seguro es aceptado por el doctor")
          : t("insurance.notCompatible", "Este seguro no es aceptado por el doctor")),
      });
    } catch (error: any) {
      console.error("Error al verificar compatibilidad del seguro:", error);
      setInsuranceStatus({
        isChecking: false,
        isCompatible: false,
        message: t("insurance.verificationError", "Error al verificar compatibilidad"),
      });
    }
  }, [serviceData?.doctorId, availableInsurances, t, i18n.language]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formValues.useInsurance && formValues.insuranceProvider) {
        verificarCompatibilidadSeguro(formValues.insuranceProvider);
      } else {
        setInsuranceStatus({
          isChecking: false,
          isCompatible: null,
          message: "",
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formValues.insuranceProvider, formValues.useInsurance, verificarCompatibilidadSeguro]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        if (!serviceData?.doctorId) return;

        setIsLoading(true);

        const response = await doctorService.getServicesOfDoctor(
          Number(serviceData.doctorId),
          {
            target: i18n.language || "es",
            source: i18n.language === "es" ? "en" : "es",
            translate_fields: "nombre,descripcion,modalidad",
          }
        );

        if (response && response.success && Array.isArray(response.data)) {
            const slotMap: Record<string, Record<string, number>> = {};
            const updated = await Promise.all(
            response.data.map(async (s) => {
              try {
                const resp = await getSlotsForService(s.id.toString());
                let slots = resp && resp.data && Array.isArray(resp.data)
                  ? resp.data.map((d: any) => d.horaInicio)
                  : [];
                
                if (resp && resp.data && Array.isArray(resp.data)) {
                  slotMap[s.id.toString()] = {};
                  resp.data.forEach((d: any) => {
                    slotMap[s.id.toString()][d.horaInicio] = d.horarioId;
                  });
                }
                
                if (isRescheduling && formValues.serviceId === s.id.toString() && formValues.time) {
                  const currentSlot = formValues.time;
                  if (!slots.includes(currentSlot)) {
                    slots = [...slots, currentSlot];
                    if (formValues.horarioId) {
                      if (!slotMap[s.id.toString()]) {
                        slotMap[s.id.toString()] = {};
                      }
                      slotMap[s.id.toString()][currentSlot] = formValues.horarioId;
                    }
                  }
                }
                
                return { ...s, timeSlots: slots };
              } catch (e) {
                console.error("Error fetching slots for service", s.id, e);
                return { ...s, timeSlots: [] };
              }
            }),
          );
          setSlotHorarioMap(slotMap);
          setServices(updated);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error al cargar los servicios del doctor:", error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [serviceData?.doctorId, i18n.language]);

  useEffect(() => {
    if (!isRescheduling || !formValues.serviceId || !formValues.time) return;

    setServices(prevServices => {
      if (prevServices.length === 0) return prevServices;

      const serviceIndex = prevServices.findIndex(s => s.id.toString() === formValues.serviceId);
      if (serviceIndex === -1) return prevServices;

      const service = prevServices[serviceIndex] as GetServicesOfDoctor & { timeSlots?: string[] };
      const currentSlot = formValues.time;

      if (service.timeSlots?.includes(currentSlot)) {
        return prevServices;
      }

      return prevServices.map(s => {
        if (s.id.toString() === formValues.serviceId) {
          const serviceWithSlots = s as GetServicesOfDoctor & { timeSlots?: string[] };
          return {
            ...serviceWithSlots,
            timeSlots: [...(serviceWithSlots.timeSlots || []), currentSlot]
          };
        }
        return s;
      });
    });

    if (formValues.horarioId) {
      setSlotHorarioMap(prev => ({
        ...prev,
        [formValues.serviceId]: {
          ...(prev[formValues.serviceId] || {}),
          [formValues.time]: formValues.horarioId!
        }
      }));
    }
  }, [isRescheduling, formValues.serviceId, formValues.time, formValues.horarioId]);

  useEffect(() => {
    const fetchSlotsForAllServices = async () => {
      if (!services || services.length === 0) return;
      try {
        setIsLoading(true);
        const slotMap: Record<string, Record<string, number>> = {};
        const updated = await Promise.all(
          services.map(async (s) => {
            try {
              const resp = await getSlotsForService(s.id.toString());
              let slots = resp && resp.data && Array.isArray(resp.data)
                ? resp.data.map((d: any) => d.horaInicio)
                : [];
              
              if (resp && resp.data && Array.isArray(resp.data)) {
                slotMap[s.id.toString()] = {};
                resp.data.forEach((d: any) => {
                  slotMap[s.id.toString()][d.horaInicio] = d.horarioId;
                });
              }
              
              if (isRescheduling && formValues.serviceId === s.id.toString() && formValues.time) {
                const currentSlot = formValues.time;
                if (!slots.includes(currentSlot)) {
                  slots = [...slots, currentSlot];
                  if (formValues.horarioId) {
                    if (!slotMap[s.id.toString()]) {
                      slotMap[s.id.toString()] = {};
                    }
                    slotMap[s.id.toString()][currentSlot] = formValues.horarioId;
                  }
                }
              }
              
              return { ...s, timeSlots: slots };
            } catch (e) {
              console.error("Error fetching slots for service", s.id, e);
              return { ...s, timeSlots: [] };
            }
          }),
        );
        setSlotHorarioMap(slotMap);
        setServices(updated);
      } catch (err) {
        console.error("Error fetching slots for services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlotsForAllServices();
  }, [formValues.date]);

  useEffect(() => {
    if (isRescheduling && !initialValuesRef.current) {
      initialValuesRef.current = { ...formValues };
    }
  }, [isRescheduling, formValues]);

  const [appointmentFilters, setAppointmentFilters] =
    useState<AppointmentFilters>({
      serviceTypes: [],
      specialties: [],
      modalities: [],
      priceRange: [0, 10000],
      rating: 0,
    });

  const updateAppointmentFilters = (
    newFilters: Partial<AppointmentFilters>,
  ) => {
    console.log("Updating filters with:", newFilters);
    setAppointmentFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetAppointmentFilters = () => {
    setAppointmentFilters({
      serviceTypes: [],
      specialties: [],
      modalities: [],
      priceRange: [0, 10000],
      rating: 0,
    });
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (
        appointmentFilters.specialties.length > 0 &&
        !appointmentFilters.specialties.includes(service.especialidad.id.toString() || "")
      ) {
        return false;
      }
      if (
        appointmentFilters.modalities.length > 0 &&
        !appointmentFilters.modalities.includes(service.modalidad || "")
      ) {
        return false;
      }
      if (
        service.precio &&
        (service.precio < appointmentFilters.priceRange[0] ||
          service.precio > appointmentFilters.priceRange[1])
      ) {
        return false;
      }
      if (
        appointmentFilters.rating > 0 &&
        service.calificacionPromedio < appointmentFilters.rating
      ) {
        return false;
      }
      return true;
    });
  }, [services, appointmentFilters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appointmentFilters.serviceTypes.length) count++;
    if (appointmentFilters.specialties.length) count++;
    if (appointmentFilters.modalities.length) count++;
    if (
      appointmentFilters.priceRange[0] !== 0 ||
      appointmentFilters.priceRange[1] !== 10000
    )
      count++;
    if (appointmentFilters.rating > 0) count++;
    return count;
  };

  const selectedDate = formValues.date
    ? parseDateFromStorage(formValues.date)
    : new Date();
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedTimeSlots = useMemo(() => {
    if (formValues.serviceId && formValues.time) {
      const convertTo12Hour = (time24: string): string => {
        const [hours, minutes] = time24.split(":");
        let hour = parseInt(hours);
        const period = hour >= 12 ? "p.m." : "a.m.";
        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;
        return `${hour}:${minutes} ${period}`;
      };
      return { [formValues.serviceId]: convertTo12Hour(formValues.time) };
    }
    return {};
  }, [formValues.serviceId, formValues.time]);

  const selectedModalityByService = useMemo(() => {
    if (formValues.serviceId && formValues.selectedModality) {
      return { [formValues.serviceId]: formValues.selectedModality };
    }
    return {};
  }, [formValues.serviceId, formValues.selectedModality]);

  const isSubmitDisabled = useMemo(() => {
    const hasTimeSlot = !!formValues.time;
    const hasModality = !!formValues.selectedModality;
    const hasRequiredFields =
      formValues.date && formValues.reason && (formValues.useInsurance ? !!formValues.insuranceProvider : true);
    const isInsuranceCompatible = !formValues.useInsurance || (insuranceStatus.isCompatible === true && !insuranceStatus.isChecking);

    if (!isRescheduling) {
      return !hasRequiredFields || !hasTimeSlot || !hasModality || !isInsuranceCompatible || isSubmitting;
    }

    const hasAllFields = hasRequiredFields && hasTimeSlot && hasModality && isInsuranceCompatible;
    if (!initialValuesRef.current) return true;

    const hasChanges =
      formValues.date !== initialValuesRef.current.date ||
      formValues.time !== initialValuesRef.current.time ||
      formValues.selectedModality !==
        initialValuesRef.current.selectedModality ||
      formValues.numberOfSessions !==
        initialValuesRef.current.numberOfSessions ||
      formValues.reason !== initialValuesRef.current.reason ||
      formValues.insuranceProvider !==
        initialValuesRef.current.insuranceProvider ||
      formValues.useInsurance !== initialValuesRef.current.useInsurance ||
      formValues.serviceId !== initialValuesRef.current.serviceId;

    return !hasAllFields || !hasChanges || isSubmitting;
  }, [formValues, isRescheduling, insuranceStatus, isSubmitting]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("date", formatDateForStorage(date));
      setCalendarOpen(false);
    }
  };

  const convertTimeToHour = (timeSlot: string): string => {
    const time = timeSlot.replace(/\s*(a\.m\.|p\.m\.)/g, "");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);
    if (timeSlot.includes("p.m.") && hour24 !== 12) hour24 += 12;
    else if (timeSlot.includes("a.m.") && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleTimeSlotSelect = (serviceId: string, time: string) => {
    if (time === "") {
      setValue("time", "");
      setValue("serviceId", "");
      setValue("selectedModality", "presencial");
      setValue("horarioId", undefined);
    } else {
      const time24 = convertTimeToHour(time);
      setValue("time", time24);
      setValue("serviceId", serviceId);
      
      const horarioId = slotHorarioMap[serviceId]?.[time24];

      if (horarioId) {
        setValue("horarioId", horarioId);
      }
      
      if (!formValues.selectedModality || formValues.serviceId !== serviceId) {
        setValue("selectedModality", "presencial");
      }
    }
  };

  const handleModalitySelect = (
    _: string,
    modality: "presencial" | "teleconsulta",
  ) => {
    setValue("selectedModality", modality);
  };

  const handlePatientsChange = (newPatients: number) => {
    setValue("numberOfSessions", newPatients);
  };

  const DoctorHeader = ({ doctor, especialidad }: { doctor?: ServiceDetailDoctor; especialidad?: string }) => {
    return (
    <div className="flex items-center gap-3 sm:gap-4">
      <img
        src={doctor?.usuario.fotoPerfil || "/default-avatar.png"}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-primary truncate">
            {getUserFullName(doctor) || t("doctors.profile")}
          </h3>
          <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-background flex-shrink-0" fill="#8bb1ca" />
        </div>
        <p className="text-sm sm:text-base text-primary truncate">{especialidad || t("doctors.specialty")}</p>
      </div>
    </div>
    );
  };

  const PatientCounter = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-primary gap-3 sm:gap-0">
      <span className="font-medium text-sm sm:text-base">
        {formValues.numberOfSessions} {t("appointments.patient")}
        {formValues.numberOfSessions > 1
          ? t("appointments.patient_plural")
          : ""}
      </span>
      <div className="flex items-center gap-2">
        <MCButton
          type="button"
          variant="outline"
          size="m"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
          onClick={() =>
            handlePatientsChange(Math.max(1, formValues.numberOfSessions - 1))
          }
          disabled={formValues.numberOfSessions <= 1}
          icon={<Minus className="h-3 w-3 sm:h-4 sm:w-4" />}
        />
        <MCButton
          type="button"
          variant="outline"
          size="m"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
          onClick={() => handlePatientsChange(formValues.numberOfSessions + 1)}
          icon={<Plus className="h-3 w-3 sm:h-4 sm:w-4" />}
        />
      </div>
    </div>
  );

  const WeekDaySelector = () => (
    <div className="grid grid-cols-7 gap-1 text-center">
      {weekDays.map((day, index) => {
        const isPast = day < today;
        return (
          <div key={index} className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-muted-foreground mb-1">
              {format(day, "EEE", { locale: currentLocale })}
            </span>
            <MCButton
              type="button"
              variant={isSameDay(day, selectedDate) ? "primary" : "outline"}
              size="sm"
              disabled={isPast}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors",
                !isSameDay(day, selectedDate) &&
                  !isPast &&
                  "hover:bg-time-slot-hover",
                isPast && "opacity-40 cursor-not-allowed",
              )}
              onClick={() => !isPast && handleDateSelect(day)}
            >
              {format(day, "d")}
            </MCButton>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
      <DoctorHeader doctor={serviceData?.doctor} especialidad={serviceData?.especialidad?.nombre} />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={formValues.useInsurance === true}
            onCheckedChange={(v) => {
              setValue("useInsurance", v ? true : false);
              if (!v) {
                setValue("insuranceProvider", "");
                setInsuranceStatus({ isChecking: false, isCompatible: null, message: "" });
              }
            }}
            id="use-insurance"
          />
          <Label htmlFor="use-insurance" className="text-sm sm:text-base text-primary flex items-center gap-2 cursor-pointer">
            {t("appointments.withInsurance", "Con seguro")}
          </Label>
        </div>

        <MCSelect
          name="insuranceProvider"
          label={t("insurance.title")}
          options={availableInsurances.map((insurance) => ({
            value: insurance.id.toString(),
            label: `${insurance.nombre} ${insurance.tipoSeguro ? `- ${typeof insurance.tipoSeguro === "string" ? insurance.tipoSeguro : insurance.tipoSeguro.nombre}` : ""}`,
          }))}
          placeholder={isLoadingInsurances ? t("insurance.loading") : t("insurance.select")}
          required={formValues.useInsurance === true}
          disabled={formValues.useInsurance === false}
        />
        {formValues.useInsurance && formValues.insuranceProvider && (
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
            {insuranceStatus.isChecking && (
              <>
                <Loader2 className="size-3 sm:size-4 animate-spin text-blue-500" />
                <span className="text-blue-600">{insuranceStatus.message}</span>
              </>
            )}
            {!insuranceStatus.isChecking && insuranceStatus.isCompatible === true && (
              <>
                <CheckCircle2 className="size-3 sm:size-4 text-green-500" />
                <span className="text-green-600">{insuranceStatus.message}</span>
              </>
            )}
            {!insuranceStatus.isChecking && insuranceStatus.isCompatible === false && (
              <>
                <XCircle className="size-3 sm:size-4 text-red-500" />
                <span className="text-red-600">{insuranceStatus.message}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <MCTextArea
          name="reason"
          label={t("appointments.reason")}
          className="rounded-2xl text-sm sm:text-base"
          placeholder={t("appointments.reasonPlaceholder")}
          charLimit={100}
          showCharCount
        />
      </div>
      <PatientCounter />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium capitalize text-primary text-sm sm:text-base">
            {format(
              selectedDate,
              i18n.language === "en" ? "MMMM yyyy" : "MMMM 'de' yyyy",
              { locale: currentLocale },
            )}
          </span>
          <div className="flex items-center gap-2">
            <MorphingPopover
              open={calendarOpen}
              onOpenChange={setCalendarOpen}
              className="relative"
            >
              <MorphingPopoverTrigger>
                <MCButton
                  type="button"
                  variant="outline"
                  size="ml"
                  className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
                  icon={<CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
                />
              </MorphingPopoverTrigger>
              <MorphingPopoverContent className="w-auto p-0 right-0 top-10 z-[9999] rounded-3xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={{ before: new Date() }}
                  initialFocus
                  className="p-3"
                />
              </MorphingPopoverContent>
            </MorphingPopover>
          </div>
        </div>
        <WeekDaySelector />
      </div>
      <div className="flex gap-2">
        <MCFilterPopover
          activeFiltersCount={getActiveFiltersCount()}
          onClearFilters={resetAppointmentFilters}
        >
          <FilterAppointments
            filters={appointmentFilters}
            onFiltersChange={updateAppointmentFilters}
          />
        </MCFilterPopover>
      </div>

      {isLoading ? (
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <p className="text-sm sm:text-base">{t("filters.loading", "Cargando servicios...")}</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <p className="text-sm sm:text-base">
            {t(
              "filters.noResults",
              "No hay servicios que coincidan con los filtros seleccionados",
            )}
          </p>
        </div>
      ) : (
        <ServiceCards
          services={filteredServices}
          selectedTimeSlots={selectedTimeSlots}
          selectedModality={selectedModalityByService}
          onTimeSlotSelect={handleTimeSlotSelect}
          onModalitySelect={handleModalitySelect}
        />
      )}

      <MCButton 
        type="submit" 
        className="w-full text-sm sm:text-base" 
        disabled={isSubmitDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            {t("appointments.submitting", "Procesando...")}
          </>
        ) : (
          <>
            {isRescheduling
              ? t("appointments.reschedule")
              : t("appointments.next")}
            <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </>
        )}
      </MCButton>
    </div>
  );
}

function ScheduleAppointmentDialog({
  idProvider,
  idAppointment,
  serviceData: externalServiceData,
  initialRescheduleData,
  children,
  onSuccess,
  isOpen,
  onClose,
}: ScheduleAppointmentDialogProps) {
  const { t, i18n } = useTranslation("patient");
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const setIsRescheduling = useAppointmentStore((s) => s.setIsRescheduling);
  const appointment = useAppointmentStore((s) => s.appointment);
  const resetAppointment = useAppointmentStore((s) => s.clearAppointments);
  const isRescheduling = !!idAppointment;
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const closeRef = useRef<{ close: () => void } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState<ServiceDetail | undefined>(externalServiceData);
  const [isLoadingDoctorData, setIsLoadingDoctorData] = useState(false);
  const [doctorDataError, setDoctorDataError] = useState<string | null>(null);
  
  const { data: availableInsurances = [] } = useMyInsurances();

  useEffect(() => {
    if (externalServiceData) {
      setServiceData(externalServiceData);
    }
  }, [externalServiceData]);

  // Reset service data when provider changes to avoid showing stale data
  useEffect(() => {
    if (!externalServiceData) {
      setServiceData(undefined);
      setDoctorDataError(null);
    }
  }, [idProvider, externalServiceData]);

  // Load doctor data function - defined first to avoid dependency issues
  const loadDoctorData = useCallback(async () => {
    if (isLoadingDoctorData) return;
    
    setIsLoadingDoctorData(true);
    setDoctorDataError(null);
    
    try {
      const [servicesResponse, doctorResponse] = await Promise.all([
        doctorService.getServicesOfDoctor(
          Number(idProvider),
          {
            target: i18n.language || "es",
            source: i18n.language === "es" ? "en" : "es",
            translate_fields: "nombre,descripcion,modalidad",
          }
        ),
        doctorService.getDoctorById(Number(idProvider))
      ]);
      
      if (!servicesResponse?.success || !Array.isArray(servicesResponse.data) || servicesResponse.data.length === 0) {
        throw new Error(t("errors.noDoctorServices", "No se encontraron servicios del doctor"));
      }

      if (!doctorResponse?.success || !doctorResponse.data) {
        throw new Error(t("errors.noDoctorData", "No se encontró información del doctor"));
      }

      const firstService = servicesResponse.data[0];
      const doctorData = doctorResponse.data;
      
      const mockServiceDetail: ServiceDetail = {
        id: firstService.id,
        doctorId: Number(idProvider),
        especialidadId: firstService.especialidad?.id || 0,
        nombre: firstService.nombre || "",
        descripcion: firstService.descripcion || "",
        precio: firstService.precio || 0,
        duracionMinutos: firstService.duracionMinutos || 30,
        maxPacientesDia: firstService.maxPacientesDia || 10,
        calificacionPromedio: firstService.calificacionPromedio || 0,
        modalidad: firstService.modalidad || "presencial",
        estado: firstService.estado || "activo",
        creadoEn: firstService.creadoEn || new Date().toISOString(),
        actualizadoEn: firstService.actualizadoEn || new Date().toISOString(),
        imagenes: firstService.imagenes || [],
        doctor: {
          usuarioId: doctorData.usuarioId || Number(idProvider),
          nombre: doctorData.nombre || "",
          apellido: doctorData.apellido || "",
          tipoDocIdentificacion: doctorData.tipoDocIdentificacion || "",
          numeroDocumentoIdentificacion: doctorData.numeroDocumentoIdentificacion || "",
          fechaNacimiento: doctorData.fechaNacimiento || "",
          genero: doctorData.genero || "",
          nacionalidad: doctorData.nacionalidad || "",
          exequatur: doctorData.exequatur || "",
          biografia: doctorData.biografia || "",
          anosExperiencia: doctorData.anosExperiencia || 0,
          estadoVerificacion: doctorData.estadoVerificacion || "pendiente",
          calificacionPromedio: typeof doctorData.calificacionPromedio === "string" 
            ? parseFloat(doctorData.calificacionPromedio) || firstService.calificacionPromedio || 0
            : doctorData.calificacionPromedio || firstService.calificacionPromedio || 0,
          estado: doctorData.estado || "activo",
          creadoEn: doctorData.creadoEn || new Date().toISOString(),
          actualizadoEn: doctorData.actualizadoEn || new Date().toISOString(),
          duracionCitaPromedio: doctorData.duracionCitaPromedio || firstService.duracionMinutos || 30,
          tarifas: doctorData.tarifas || firstService.precio || 0,
          usuario: {
            id: doctorData.usuario?.id || Number(idProvider),
            email: doctorData.usuario?.email || "",
            fotoPerfil: doctorData.usuario?.fotoPerfil || "/default-avatar.png",
          },
        },
        especialidad: firstService.especialidad || { id: 0, nombre: "" },
        horarios: firstService.horarios || [],
        centros: [],
        ubicacionId: null,
        ubicacion: [],
        resenas: [],
      };
      
      setServiceData(mockServiceDetail);
    } catch (error: any) {
      console.error("Error cargando datos del doctor:", error);
      const errorMessage = error.message || error.response?.data?.message || t("errors.loadDoctorData", "Error al cargar datos del doctor");
      setDoctorDataError(errorMessage);
    } finally {
      setIsLoadingDoctorData(false);
    }
  }, [idProvider, i18n.language, isLoadingDoctorData, t]);

  // Handle trigger click for traditional modal opening
  const handleTriggerClick = useCallback(() => {
    setShouldLoadData(true);
    if (!externalServiceData && !serviceData) {
      loadDoctorData();
    }
  }, [externalServiceData, serviceData, loadDoctorData]);

  // Effect to handle when modal is opened via isOpen prop (e.g., from map popup)
  // This ensures data loads even when the trigger is not clicked
  useEffect(() => {
    if (isOpen && !externalServiceData && !serviceData && !isLoadingDoctorData && !doctorDataError) {
      setShouldLoadData(true);
      loadDoctorData();
    }
  }, [isOpen, externalServiceData, serviceData, isLoadingDoctorData, doctorDataError, loadDoctorData]);

  const loadAppointmentData = useCallback(async () => {
    if (!idAppointment) return;

    try {
      const response = await getCitaById(idAppointment, {
        target: i18n.language,
        source: 'es',
        translate_fields: 'motivoConsulta'
      });

      if (!response.success || !response.data) {
        console.error('No se pudieron cargar los datos de la cita');
        return;
      }

      const cita: CitaDetalle = Array.isArray(response.data) 
        ? response.data[0] 
        : response.data;

      if (!cita) {
        console.error('No se encontró la cita');
        return;
      }

      const formatTimeForForm = (hora: string): string => {
        const [hours, minutes] = hora.split(':');
        return `${hours}:${minutes}`;
      };

      const modalidadFormatted = cita.modalidad.toLowerCase() === 'teleconsulta' 
        ? 'teleconsulta' 
        : 'presencial';

      const appointmentData: scheduleAppointment = {
        date: cita.fechaInicio,
        time: formatTimeForForm(cita.horaInicio),
        selectedModality: modalidadFormatted as 'presencial' | 'teleconsulta',
        numberOfSessions: cita.numPacientes,
        reason: cita.motivoConsulta || '',
        useInsurance: cita.seguro !== null,
        insuranceProvider: cita.seguro?.id.toString() || '',
        serviceId: cita.servicioId?.toString() || '',
        doctorId: cita.doctorId?.toString() || idProvider,
        appointmentId: idAppointment,
        horarioId: cita.horario?.id || undefined,
      };

      setIsRescheduling(true);
      addAppointment(appointmentData);

      if (!externalServiceData && !serviceData) {
        await loadDoctorData();
      }

    } catch (error: any) {
      console.error('Error al cargar datos de la cita:', error);
    }
  }, [idAppointment, i18n.language, idProvider, addAppointment, setIsRescheduling, externalServiceData, serviceData, loadDoctorData]);

  useEffect(() => {
    if (!shouldLoadData) return;
    
    if (isRescheduling && idAppointment) {
      loadAppointmentData();
      setShouldLoadData(false);
      return;
    }
    
    if (!appointment.doctorId) {
      setIsRescheduling(false);
      addAppointment({
        date: formatDateForStorage(new Date()),
        time: "",
        selectedModality: "presencial",
        numberOfSessions: 1,
        reason: "",
        insuranceProvider: "",
        useInsurance: true,
        serviceId: "",
        doctorId: idProvider,
        appointmentId: undefined,
        horarioId: undefined,
      });
      setShouldLoadData(false);
      return;
    }
    
    if (appointment.doctorId !== idProvider) {
      resetAppointment();
      addAppointment({
        doctorId: idProvider,
        date: formatDateForStorage(new Date()),
        time: "",
        selectedModality: "presencial",
        numberOfSessions: 1,
        reason: "",
        insuranceProvider: "",
        useInsurance: true,
        serviceId: "",
        appointmentId: undefined,
        horarioId: undefined,
      });
    }
    setShouldLoadData(false);
  }, [
    shouldLoadData,
    idProvider,
    appointment,
    addAppointment,
    resetAppointment,
    isRescheduling,
    idAppointment,
    loadAppointmentData,
    setIsRescheduling,
    i18n.language,
  ]);

  const onSubmit = async (data: scheduleAppointment) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const modalidadFormatted = data.selectedModality.charAt(0).toUpperCase() + data.selectedModality.slice(1);

      const seguroSeleccionado = availableInsurances.find(
        (insurance: any) => insurance.id.toString() === data.insuranceProvider
      );

      const completeAppointmentData: any = {
        ...data,
        servicioId: Number(data.serviceId),
        fecha: data.date,
        hora: data.time,
        modalidad: modalidadFormatted,
        numPacientes: data.numberOfSessions,
        motivoConsulta: data.reason,
        useInsurance: data.useInsurance,
        ...(isRescheduling && idAppointment ? { appointmentId: idAppointment } : {}),
      };

      if (data.useInsurance && data.insuranceProvider) {
        completeAppointmentData.seguroId = Number(data.insuranceProvider);
        completeAppointmentData.tipoSeguroId = seguroSeleccionado?.idTipoSeguro || 0;
      }

      console.log("completeAppointmentData a guardar:", completeAppointmentData);

      addAppointment(completeAppointmentData);
      if (isRescheduling) {
        setIsRescheduling(true);
      }

      requestAnimationFrame(() => {
        closeRef.current?.close();
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else if(navigate) {
            navigate("/patient/schedule-appointment", { replace: true });
          }
        }, 0);
      });
    } catch (error) {
      console.error("Error al guardar appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formDefaultValues = useMemo(() => {
    if (isRescheduling && idAppointment) {
      const isSameAppointment = appointment.appointmentId === idAppointment;
      const baseData = isSameAppointment ? appointment : (initialRescheduleData || {});
      return {
        date: baseData.date || formatDateForStorage(new Date()),
        time: baseData.time || "",
        selectedModality: baseData.selectedModality || "presencial",
        numberOfSessions: baseData.numberOfSessions || 1,
        reason: baseData.reason || "",
        useInsurance: baseData.useInsurance ?? true,
        insuranceProvider: baseData.insuranceProvider || "",
        serviceId: baseData.serviceId || "",
        doctorId: idProvider,
        appointmentId: idAppointment,
        horarioId: isSameAppointment ? appointment.horarioId : undefined,
      };
    }
    return {
      date: appointment.date || formatDateForStorage(new Date()),
      time: appointment.time || "",
      selectedModality: appointment.selectedModality || "presencial",
      numberOfSessions: appointment.numberOfSessions || 1,
      reason: appointment.reason || "",
      useInsurance: appointment.useInsurance !== undefined ? appointment.useInsurance : true,
      insuranceProvider: appointment.insuranceProvider || "",
      serviceId: appointment.serviceId || "",
      doctorId: appointment.doctorId || idProvider,
      appointmentId: undefined,
      horarioId: appointment.horarioId || undefined,
    };
  }, [isRescheduling, appointment, idProvider, idAppointment, initialRescheduleData]);

  const triggerWithHandler = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleTriggerClick,
      })
    : children;

  const modalTitle = isRescheduling
    ? t("appointments.rescheduleTitle")
    : t("appointments.schedule");

  return (
    <MCModalBase
      id={
        isRescheduling
          ? `reschedule-appointment-${idAppointment}`
          : "schedule-appointment-modal"
      }
      title={modalTitle}
      trigger={triggerWithHandler}
      triggerClassName="w-full"
      size="xl"
      closeRef={closeRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoadingDoctorData ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm sm:text-base">{t("appointments.loadingDoctorData", "Cargando información del doctor...")}</p>
        </div>
      ) : doctorDataError ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
          <XCircle className="h-8 w-8 text-destructive" />
          <p className="text-destructive text-center text-sm sm:text-base">{doctorDataError}</p>
          <MCButton onClick={loadDoctorData} variant="outline">
            {t("common.retry", "Reintentar")}
          </MCButton>
        </div>
      ) : serviceData ? (
        <MCFormWrapper
          key={
            isRescheduling
              ? `reschedule-${idAppointment}-${appointment.date}-${i18n.language}`
              : `new-appointment-${appointment.doctorId}-${i18n.language}`
          }
          schema={appointmentSchema(t)}
          defaultValues={formDefaultValues}
          onValidationChange={() => {}}
          onSubmit={onSubmit}
        >
          <ScheduleAppointmentForm
            isRescheduling={isRescheduling}
            serviceData={serviceData}
            isSubmitting={isSubmitting}
          />
        </MCFormWrapper>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
          <p className="text-muted-foreground text-sm sm:text-base">{t("appointments.noDoctorData", "No se pudo cargar la información del doctor")}</p>
          <MCButton onClick={loadDoctorData} variant="outline">
            {t("common.retry", "Reintentar")}
          </MCButton>
        </div>
      )}
    </MCModalBase>
  );
}

export default ScheduleAppointmentDialog;