import { format, isAfter, isSameDay, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import type { Appointment } from "@/types/CalendarTypes";
import {
  Clock,
  User,
  Stethoscope,
  Calendar,
  ChevronRight,
  MapPin,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";
import type { AppointmentStatus } from "@/types/CalendarTypes";
import { useAppStore } from "@/stores/useAppStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
// Agrega esta línea
interface ListViewProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  pending: "Pendiente",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "bg-[#6A1B9A]/15 text-[#6A1B9A]",
  pending: "bg-[#C77A1F]/15 text-[#C77A1F]",
  in_progress: "bg-[#1565C0]/15 text-[#1565C0]",
  completed: "bg-[#2E7D32]/15 text-[#2E7D32]",
  cancelled: "bg-[#C62828]/15 text-[#C62828]",
};

export const ListView = ({
  appointments,
  onSelectAppointment,
}: ListViewProps) => {
  const today = startOfToday();
  const userRole = useAppStore((state) => state.user?.role); // Agrega esta línea

  // Filter and sort appointments (upcoming first)
  const sortedAppointments = [...appointments]
    .filter((apt) => isAfter(apt.date, today) || isSameDay(apt.date, today))
    .sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

  // Group by date
  const groupedAppointments = sortedAppointments.reduce(
    (groups, apt) => {
      const dateKey = format(apt.date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(apt);
      return groups;
    },
    {} as Record<string, Appointment[]>,
  );

  if (sortedAppointments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay citas próximas</h3>
          <p className="text-muted-foreground">
            Las próximas citas aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6 h-full">
      {Object.entries(groupedAppointments).map(([dateKey, dayAppointments]) => {
        const date = new Date(dateKey);
        const isToday = isSameDay(date, today);

        return (
          <div key={dateKey}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {isToday
                  ? "Hoy"
                  : format(date, "EEEE, d 'de' MMMM", { locale: es })}
              </div>
              <div className="flex-1 h-px bg-primary/15" />
              <span className="text-sm text-muted-foreground">
                {dayAppointments.length} cita
                {dayAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {dayAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectAppointment(apt)}
                  className="w-full text-left p-4 bg-background rounded-4xl border border-primary/15 hover:border-primary/30 hover:shadow-md transition-all group h-28 overflow-y-auto"
                >
                  <div className="flex items-center justify-between  h-full">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {/* Aquí se condiciona el nombre y el ícono */}
                          {userRole === "DOCTOR" ? (
                            <>
                              <div className="h-10 w-10 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                                {apt.patientAvatarUrl ? (
                                  <Avatar className="h-10 w-10 rounded-full overflow-hidden">
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
                                    size={40}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                  />
                                )}
                              </div>
                              <span className="font-semibold">
                                {apt.patientName}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="h-10 w-10 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                                {apt.doctorAvatarUrl ? (
                                  <Avatar className="h-10 w-10 rounded-full overflow-hidden">
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
                                    size={40}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                  />
                                )}
                              </div>
                              <span className="font-semibold">
                                {apt.doctorName}
                              </span>
                            </>
                          )}
                          <Badge
                            className={cn("text-xs", statusColors[apt.status])}
                          >
                            {statusLabels[apt.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
