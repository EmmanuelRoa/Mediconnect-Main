import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Appointment } from "@/types/CalendarTypes";
import { Clock, User, Stethoscope, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/CalendarTypes";
import { useAppStore } from "@/stores/useAppStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "border-l-[#6A1B9A] bg-[#6A1B9A]/10",
  pending: "border-l-[#C77A1F] bg-[#C77A1F]/10",
  in_progress: "border-l-[#1565C0] bg-[#1565C0]/10",
  completed: "border-l-[#2E7D32] bg-[#2E7D32]/10",
  cancelled: "border-l-[#C62828] bg-[#C62828]/10",
};

type DayViewProps = {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
};

export const DayView = ({
  currentDate,
  appointments,
  onSelectAppointment,
}: DayViewProps) => {
  const dayAppointments = appointments.filter((apt) =>
    isSameDay(apt.date, currentDate),
  );

  const getAppointmentsForHour = (hour: number) => {
    return dayAppointments.filter((apt) => {
      const aptHour = parseInt(apt.time.split(":")[0]);
      return aptHour === hour;
    });
  };

  const userRole = useAppStore((state) => state.user?.role);

  return (
    <div className="flex-1 overflow-auto h-full">
      {/* Day header */}
      <div className="p-6 border-b border-primary/15 bg-accent/40  dark:bg-accent/20 rounded-t-2xl  sticky top-0 z-10">
        <h2 className="text-2xl font-bold">
          {format(currentDate, "EEEE, d 'de' MMMM", { locale: es })}
        </h2>
        <p className="text-muted-foreground mt-1">
          {dayAppointments.length} citas programadas
        </p>
      </div>

      {/* Time slots */}
      <div className="divide-y divide-primary/15">
        {hours.map((hour) => {
          const hourAppointments = getAppointmentsForHour(hour);

          return (
            <div key={hour} className="grid grid-cols-[80px_1fr] min-h-[100px]">
              <div className="p-4 text-sm text-muted-foreground text-right border-r border-primary/15 bg-muted/30">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="p-3 space-y-2">
                {hourAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-l-4 transition-all hover:shadow-md",
                      statusColors[apt.status],
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="h-12 w-12 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                          {userRole === "DOCTOR" ? (
                            apt.patientAvatarUrl ? (
                              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                <AvatarImage
                                  src={apt.patientAvatarUrl}
                                  alt={apt.patientName}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                  {apt.patientName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <MCUserAvatar
                                name={apt.patientName}
                                square
                                size={48}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            )
                          ) : apt.doctorAvatarUrl ? (
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                              <AvatarImage
                                src={apt.doctorAvatarUrl}
                                alt={apt.doctorName}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground">
                                {apt.doctorName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <MCUserAvatar
                              name={apt.doctorName}
                              square
                              size={48}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          )}
                        </div>

                        <div>
                          <span className="font-semibold text-lg">
                            {userRole === "DOCTOR"
                              ? apt.patientName
                              : apt.doctorName}
                          </span>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time} - {apt.duration} min
                            </span>
                            <span className="mx-1">·</span>
                            {apt.modality === "presencial" ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {apt.address}
                              </span>
                            ) : apt.modality === "virtual" ? (
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Virtual
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <span className="truncate">{apt.type}</span>
                        {apt.notes && (
                          <>
                            <span className="mx-1">·</span>
                            <span className="truncate">
                              {apt.notes.length > 80
                                ? apt.notes.slice(0, 80) + "..."
                                : apt.notes}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
                {hourAppointments.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Disponible
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
