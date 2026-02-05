import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWeekend,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import type { Appointment } from "@/types/CalendarTypes";
import { AppointmentBadge } from "./AppointmentBadge";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  selectedDate: Date | null;
}

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const MonthView = ({
  currentDate,
  appointments,
  onSelectDate,
  onSelectAppointment,
  selectedDate,
}: MonthViewProps) => {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(apt.date, date));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center py-3 text-sm font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {calendarDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);
          const isWeekendDay = isWeekend(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "calendar-cell cursor-pointer rounded-2xl border border-primary/15", // border-primary/15 para todos los días
                !isCurrentMonth && "opacity-40",
                isWeekendDay &&
                  isCurrentMonth &&
                  "bg-accent/40  dark:bg-accent/20", // bg-accent para sábados y domingos del mes actual
                isDayToday && "calendar-cell-today",
                isSelected && "ring-2 ring-primary ring-offset-2",
              )}
            >
              <div className="flex justify-end mb-2 p-2">
                <span
                  className={cn(
                    "w-7 h-7 flex items-center justify-center  rounded-full text-sm font-medium",
                    isDayToday && "bg-primary  text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1 px-2">
                {dayAppointments.slice(0, 2).map((apt) => (
                  <AppointmentBadge
                    key={apt.id}
                    appointment={apt}
                    onClick={() => onSelectAppointment(apt)}
                  />
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayAppointments.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
