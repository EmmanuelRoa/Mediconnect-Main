import { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { Calendar } from "@/shared/ui/calendar";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCSelect from "@/shared/components/forms/MCSelect";
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/shared/ui/morphing-popover";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { appointmentSchema } from "@/schema/appointment.schema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import { CalendarIcon, Minus, Plus, BadgeCheck } from "lucide-react";
import MCButton from "@/shared/components/forms/MCButton";
import { cn } from "@/lib/utils";
import type { scheduleAppointment } from "@/types/AppointmentTypes";

import ServiceCards from "./ServiceCards";

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

const services: Service[] = [
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

interface ScheduleAppointmentDialogProps {
  idProvider: string;
  children: React.ReactNode | React.ComponentType;
}

function ScheduleAppointmentDialog({
  idProvider,
  children,
}: ScheduleAppointmentDialogProps) {
  const { t } = useTranslation();
  const addAppointment = useAppointmentStore((state) => state.addAppointment);

  const triggerNode = (
    <div className="w-fit rounded-full cursor-pointer">
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [patients, setPatients] = useState(1);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    Record<string, string>
  >({});
  const [selectedModality, setSelectedModality] = useState<
    Record<string, "presencial" | "teleconsulta">
  >({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setWeekStart(startOfWeek(date, { weekStartsOn: 0 }));
      setCalendarOpen(false);
    }
  };

  const handleTimeSlotSelect = (serviceId: string, time: string) => {
    if (time === "") {
      setSelectedTimeSlots((prev) => {
        const newSlots = { ...prev };
        delete newSlots[serviceId];
        return newSlots;
      });

      setSelectedModality((prev) => {
        const newModality = { ...prev };
        delete newModality[serviceId];
        return newModality;
      });
    } else {
      const hasOtherSelection = Object.keys(selectedTimeSlots).some(
        (id) => id !== serviceId && selectedTimeSlots[id],
      );

      if (hasOtherSelection) {
        setSelectedTimeSlots({ [serviceId]: time });
        setSelectedModality({});
      } else {
        setSelectedTimeSlots((prev) => ({ ...prev, [serviceId]: time }));
      }
    }
  };

  const handleModalitySelect = (
    serviceId: string,
    modality: "presencial" | "teleconsulta",
  ) => {
    setSelectedModality((prev) => ({ ...prev, [serviceId]: modality }));
  };

  const doctorAvatar =
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop";

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

  const handleAppointmentSubmit = (data: any) => {
    const selectedServices = Object.keys(selectedTimeSlots).filter(
      (serviceId) => selectedTimeSlots[serviceId],
    );

    if (selectedServices.length === 0) {
      return;
    }

    const firstServiceWithTime = selectedServices[0];
    const selectedTimeSlot = selectedTimeSlots[firstServiceWithTime];
    const selectedModalityForService = selectedModality[firstServiceWithTime];

    if (!selectedModalityForService) {
      return;
    }

    const convertedTime = convertTimeToHour(selectedTimeSlot);

    const appointmentData: scheduleAppointment = {
      date: format(selectedDate, "yyyy-MM-dd"),
      time: convertedTime,
      reason: data.reason || "",
      insuranceProvider: data.insuranceProvider || "",
      selectedModality: selectedModalityForService,
      numberOfSessions: patients,
    };

    addAppointment(appointmentData);
  };

  const isSubmitDisabled =
    Object.keys(selectedTimeSlots).filter(
      (serviceId) => selectedTimeSlots[serviceId],
    ).length === 0 ||
    Object.keys(selectedModality).filter(
      (serviceId) => selectedModality[serviceId],
    ).length === 0;

  return (
    <MCModalBase
      id="schedule-appointment-modal"
      title="Agendar Cita"
      trigger={triggerNode}
      triggerClassName=""
      size="wider"
      actionOne={true}
    >
      <MCFormWrapper
        schema={appointmentSchema(t)}
        onSubmit={handleAppointmentSubmit}
      >
        <div className="px-6 pb-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={doctorAvatar}
              alt="Dr. Cristiano Ronaldo"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-primary">
                  Dr. Cristiano Ronaldo
                </h3>
                <BadgeCheck
                  className="w-5 h-5 text-background"
                  fill="#8bb1ca"
                />
              </div>
              <p className="text-primary">Especialista en Medicina Interna</p>
            </div>
          </div>

          <div className="space-y-2">
            <MCSelect
              name="insuranceProvider"
              label="Seguro Médico"
              options={[
                { value: "universal", label: "Seguro Universal" },
                { value: "humano", label: "Humano Seguros" },
                { value: "mapfre", label: "Mapfre Salud" },
                { value: "particular", label: "Particular" },
              ]}
              placeholder="Selecciona tu seguro"
            />
          </div>

          <div className="space-y-2">
            <MCTextArea
              name="reason"
              label="Motivo de Consulta"
              className="rounded-2xl"
              placeholder="Describe el motivo de tu consulta"
              rows={3}
              charLimit={100}
              showCharCount
            />
          </div>

          <div className="flex items-center justify-between text-primary">
            <span className="font-medium">
              {patients} Paciente{patients > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <MCButton
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => setPatients(Math.max(1, patients - 1))}
                disabled={patients <= 1}
                icon={<Minus className="h-4 w-4" />}
              />
              <MCButton
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => setPatients(patients + 1)}
                icon={<Plus className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize text-primary">
                {format(selectedDate, "MMMM 'de' yyyy", { locale: es })}
              </span>
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
                    className=" rounded-full h-10 w-10"
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

            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">
                    {format(day, "EEE", { locale: es })}
                  </span>
                  <MCButton
                    type="button"
                    variant={
                      isSameDay(day, selectedDate) ? "primary" : "outline"
                    }
                    size="sm"
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      !isSameDay(day, selectedDate) &&
                        "hover:bg-time-slot-hover",
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    {format(day, "d")}
                  </MCButton>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <MCFilterSelect
              name="service"
              options={[
                { value: "all", label: "Todos" },
                { value: "consulta", label: "Consulta" },
                { value: "tratamiento", label: "Tratamiento" },
              ]}
              placeholder="Servicio"
            />
            <MCFilterSelect
              name="modality"
              options={[
                { value: "all", label: "Todas" },
                { value: "presencial", label: "Presencial" },
                { value: "teleconsulta", label: "Teleconsulta" },
              ]}
              placeholder="Modalidades"
            />
          </div>

          <ServiceCards
            services={services}
            selectedTimeSlots={selectedTimeSlots}
            selectedModality={selectedModality}
            onTimeSlotSelect={handleTimeSlotSelect}
            onModalitySelect={handleModalitySelect}
          />

          <MCButton
            type="submit"
            className="w-full"
            disabled={isSubmitDisabled}
          >
            Siguiente
          </MCButton>
        </div>
      </MCFormWrapper>
    </MCModalBase>
  );
}

export default ScheduleAppointmentDialog;
