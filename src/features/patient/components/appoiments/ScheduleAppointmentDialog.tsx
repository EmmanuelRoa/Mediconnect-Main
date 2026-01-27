import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { Calendar } from "@/shared/ui/calendar";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import MCSelect from "@/shared/components/forms/MCSelect";
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
import { useFiltersStore } from "@/stores/useFiltersStore";
import FilterAppointments from "@/features/patient/components/filters/FilterAppointments";
import { useNavigate } from "react-router-dom";

import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useState, useMemo } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  modality: string;
  location: string;
  timeSlots: string[];
}

const SERVICES: Service[] = [
  {
    id: "1",
    name: "Consulta dermatológica general",
    description: "Evaluación completa de la piel",
    price: "RD$1500",
    duration: "30 minutos",
    modality: "Modalidad Mixta",
    location: "Av. Principal 123, San José",
    timeSlots: [
      "10:00 a.m.",
      "10:30 a.m.",
      "11:00 a.m.",
      "11:30 a.m.",
      "12:00 p.m.",
      "12:30 p.m.",
      "1:00 p.m.",
      "1:30 p.m.",
      "2:00 p.m.",
      "2:30 p.m.",
      "3:00 p.m.",
      "3:30 p.m.",
      "4:00 p.m.",
      "4:30 p.m.",
    ],
  },
  {
    id: "2",
    name: "Tratamiento de rejuvenecimiento facial",
    description: "Tratamiento con láser y productos especializados",
    price: "RD$1500",
    duration: "30 minutos",
    modality: "Modalidad Mixta",
    location: "Av. Principal 123, San José",
    timeSlots: [
      "10:00 a.m.",
      "10:30 a.m.",
      "11:00 a.m.",
      "11:30 a.m.",
      "12:00 p.m.",
      "12:30 p.m.",
      "1:00 p.m.",
      "1:30 p.m.",
      "2:00 p.m.",
      "2:30 p.m.",
      "3:00 p.m.",
      "3:30 p.m.",
      "4:00 p.m.",
      "4:30 p.m.",
    ],
  },
];

const INSURANCE_OPTIONS = [
  { value: "universal", label: "Seguro Universal" },
  { value: "humano", label: "Humano Seguros" },
  { value: "mapfre", label: "Mapfre Salud" },
  { value: "particular", label: "Particular" },
];

interface ScheduleAppointmentDialogProps {
  idProvider: string;
  children: React.ReactNode | React.ComponentType;
}

// Función auxiliar para manejar fechas sin problemas de timezone
const formatDateForStorage = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Función auxiliar para parsear fechas correctamente
const parseDateFromStorage = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Componente interno que usa el FormContext
function ScheduleAppointmentForm() {
  const { t, i18n } = useTranslation("patient");
  const currentLocale = i18n.language === "es" ? es : enUS;
  const { filters, resetFilters } = useFiltersStore();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const appointment = useAppointmentStore((state) => state.appointment);
  const setAppointmentField = useAppointmentStore(
    (state) => state.setAppointmentField,
  );

  const activeFiltersCount = [
    filters.serviceTypes.length,
    filters.specialties.length,
    filters.modalities.length,
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000 ? 1 : 0,
    filters.durations.length,
  ].reduce((a, b) => a + (b ? 1 : 0), 0);

  // Obtener la fecha actual del store o usar hoy
  const selectedDate = appointment.date
    ? parseDateFromStorage(appointment.date)
    : new Date();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Crear un objeto para selectedTimeSlots basado en el store
  const selectedTimeSlots = useMemo(() => {
    if (appointment.serviceId && appointment.time) {
      // Convertir el tiempo de formato 24h a formato display (a.m./p.m.)
      const convertTo12Hour = (time24: string): string => {
        const [hours, minutes] = time24.split(":");
        let hour = parseInt(hours);
        const period = hour >= 12 ? "p.m." : "a.m.";

        if (hour > 12) hour -= 12;
        if (hour === 0) hour = 12;

        return `${hour}:${minutes} ${period}`;
      };

      return {
        [appointment.serviceId]: convertTo12Hour(appointment.time),
      };
    }
    return {};
  }, [appointment.serviceId, appointment.time]);

  // Crear un objeto para selectedModality basado en el store
  const selectedModalityByService = useMemo(() => {
    if (appointment.serviceId && appointment.selectedModality) {
      return {
        [appointment.serviceId]: appointment.selectedModality,
      };
    }
    return {};
  }, [appointment.serviceId, appointment.selectedModality]);

  // Calculate if submit should be disabled
  const isSubmitDisabled = useMemo(() => {
    const hasTimeSlot = !!appointment.time;
    const hasModality = !!appointment.selectedModality;
    const hasRequiredFields =
      appointment.date && appointment.insuranceProvider && appointment.reason;

    return !hasRequiredFields || !hasTimeSlot || !hasModality;
  }, [appointment]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDateForStorage(date);

      if (setAppointmentField) {
        setAppointmentField("date", formattedDate);
      }
      setCalendarOpen(false);
    }
  };

  const convertTimeToHour = (timeSlot: string): string => {
    const time = timeSlot.replace(/\s*(a\.m\.|p\.m\.)/g, "");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);

    if (timeSlot.includes("p.m.") && hour24 !== 12) {
      hour24 += 12;
    } else if (timeSlot.includes("a.m.") && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleTimeSlotSelect = (serviceId: string, time: string) => {
    if (time === "") {
      // Deseleccionar
      if (setAppointmentField) {
        setAppointmentField("time", "");
        setAppointmentField("serviceId", "");
        setAppointmentField("selectedModality", "presencial");
      }
    } else {
      // Seleccionar nuevo horario
      const convertedTime = convertTimeToHour(time);

      if (setAppointmentField) {
        setAppointmentField("time", convertedTime);
        setAppointmentField("serviceId", serviceId);

        // Si cambiamos de servicio, resetear la modalidad
        if (appointment.serviceId && appointment.serviceId !== serviceId) {
          setAppointmentField("selectedModality", "presencial");
        }
      }
    }
  };

  const handleModalitySelect = (
    serviceId: string,
    modality: "presencial" | "teleconsulta",
  ) => {
    if (setAppointmentField) {
      setAppointmentField("selectedModality", modality);
    }
  };

  const handlePatientsChange = (newPatients: number) => {
    if (setAppointmentField) {
      setAppointmentField("numberOfSessions", newPatients);
    }
  };

  const DoctorHeader = () => {
    const doctorAvatar =
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop";

    return (
      <div className="flex items-center gap-4">
        <img
          src={doctorAvatar}
          alt={t("doctors.profile", "Dr. Cristiano Ronaldo")}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-primary">
              {t("doctors.profile")}
            </h3>
            <BadgeCheck className="w-5 h-5 text-background" fill="#8bb1ca" />
          </div>
          <p className="text-primary">{t("doctors.specialty")}</p>
        </div>
      </div>
    );
  };

  const PatientCounter = () => (
    <div className="flex items-center justify-between text-primary">
      <span className="font-medium">
        {appointment.numberOfSessions} {t("appointments.patient")}
        {appointment.numberOfSessions > 1
          ? t("appointments.patient_plural")
          : ""}
      </span>
      <div className="flex items-center gap-2">
        <MCButton
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 rounded-full"
          onClick={() =>
            handlePatientsChange(Math.max(1, appointment.numberOfSessions - 1))
          }
          disabled={appointment.numberOfSessions <= 1}
          icon={<Minus className="h-4 w-4" />}
        />
        <MCButton
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 rounded-full"
          onClick={() => handlePatientsChange(appointment.numberOfSessions + 1)}
          icon={<Plus className="h-4 w-4" />}
        />
      </div>
    </div>
  );

  const WeekDaySelector = () => (
    <div className="grid grid-cols-7 gap-1 text-center">
      {weekDays.map((day, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-1">
            {format(day, "EEE", { locale: currentLocale })}
          </span>
          <MCButton
            type="button"
            variant={isSameDay(day, selectedDate) ? "primary" : "outline"}
            size="sm"
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              !isSameDay(day, selectedDate) && "hover:bg-time-slot-hover",
            )}
            onClick={() => handleDateSelect(day)}
          >
            {format(day, "d")}
          </MCButton>
        </div>
      ))}
    </div>
  );

  return (
    <div className="px-6 pb-6 space-y-6">
      {/* Doctor Info */}
      <DoctorHeader />

      {/* Insurance Selection */}
      <div className="space-y-2">
        <MCSelect
          name="insuranceProvider"
          label={t("insurance.title")}
          options={INSURANCE_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`insurance.${option.value}`, option.label),
          }))}
          placeholder={t("insurance.select")}
          required
          onChange={(value) => {
            if (setAppointmentField) {
              const insuranceValue = Array.isArray(value)
                ? (value[0] ?? "")
                : value;
              setAppointmentField("insuranceProvider", insuranceValue);
            }
          }}
        />
      </div>

      {/* Reason for Visit */}
      <div className="space-y-2">
        <MCTextArea
          name="reason"
          label={t("appointments.reason")}
          className="rounded-2xl"
          placeholder={t("appointments.reasonPlaceholder")}
          charLimit={100}
          showCharCount
          onChange={(value) => {
            if (setAppointmentField) {
              const reasonValue =
                typeof value === "string" ? value : value?.target?.value;
              setAppointmentField("reason", reasonValue);
            }
          }}
        />
      </div>

      {/* Patient Counter */}
      <PatientCounter />

      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium capitalize text-primary">
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
                  className="rounded-full h-10 w-10"
                  icon={<CalendarIcon className="h-6 w-6" />}
                />
              </MorphingPopoverTrigger>
              <MorphingPopoverContent className="w-auto p-0 right-0 top-10 z-[9999] rounded-3xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  compact
                  className="p-3 pointer-events-auto"
                />
              </MorphingPopoverContent>
            </MorphingPopover>
          </div>
        </div>

        <WeekDaySelector />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <MCFilterPopover
          activeFiltersCount={activeFiltersCount}
          onClearFilters={resetFilters}
        >
          <FilterAppointments />
        </MCFilterPopover>
      </div>

      {/* Service Cards */}
      <ServiceCards
        services={SERVICES}
        selectedTimeSlots={selectedTimeSlots}
        selectedModality={selectedModalityByService}
        onTimeSlotSelect={handleTimeSlotSelect}
        onModalitySelect={handleModalitySelect}
      />

      {/* Submit Button */}
      <MCButton type="submit" className="w-full" disabled={isSubmitDisabled}>
        {t("appointments.next", "Siguiente")}
        <ChevronRight className="ml-2 h-5 w-5" />
      </MCButton>
    </div>
  );
}

function ScheduleAppointmentDialog({
  idProvider,
  children,
}: ScheduleAppointmentDialogProps) {
  const { t } = useTranslation("patient");
  const navigate = useNavigate();
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const appointment = useAppointmentStore((state) => state.appointment);

  const triggerNode = (
    <div className="w-full h-full">
      {typeof children === "function" ||
      (typeof children === "object" &&
        (children as any)?.prototype?.isReactComponent)
        ? (() => {
            const Comp = children as React.ComponentType;
            return <Comp />;
          })()
        : children}
    </div>
  );

  const onSubmit = (data: scheduleAppointment) => {
    const appointmentData: scheduleAppointment = {
      date: data.date,
      time: data.time,
      reason: data.reason,
      insuranceProvider: data.insuranceProvider,
      selectedModality: data.selectedModality,
      numberOfSessions: data.numberOfSessions,
      serviceId: data.serviceId,
    };

    addAppointment(appointmentData);
    console.log(appointmentData);

    navigate("/patient/schedule-appointment");
  };

  // Crear defaultValues basados DIRECTAMENTE en el estado del store
  const formDefaultValues = {
    date: appointment.date || formatDateForStorage(new Date()),
    time: appointment.time || "",
    selectedModality: appointment.selectedModality || "presencial",
    numberOfSessions: appointment.numberOfSessions || 1,
    reason: appointment.reason || "",
    insuranceProvider: appointment.insuranceProvider || "",
    serviceId: appointment.serviceId || "",
  };

  // Crear un key único basado en TODOS los valores importantes del store
  const formKey = `form-${appointment.date}-${appointment.time}-${appointment.selectedModality}-${appointment.insuranceProvider}-${appointment.numberOfSessions}-${appointment.serviceId}`;

  return (
    <MCModalBase
      id="schedule-appointment-modal"
      title={t("appointments.schedule", "Agendar Cita")}
      trigger={triggerNode}
      triggerClassName="w-full h-full"
      size="wider"
    >
      <MCFormWrapper
        schema={appointmentSchema(t)}
        defaultValues={formDefaultValues}
        onValidationChange={() => {}}
        onSubmit={onSubmit}
        key={formKey}
      >
        <ScheduleAppointmentForm />
      </MCFormWrapper>
    </MCModalBase>
  );
}

export default ScheduleAppointmentDialog;
