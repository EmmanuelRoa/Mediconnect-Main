import {
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  History,
  FileText,
  User,
  File,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import ViewDetailsAppointmentDialog from "@/features/patient/components/appoiments/ViewDetailsAppointmentDialog";
import MedicalPrescriptionDialog from "@/features/patient/components/appoiments/MedicalPrescriptionDialog";
import { useAppStore } from "@/stores/useAppStore";
import { mockAppointments } from "@/data/appointments";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

const consultationData = {
  doctor: {
    name: "Dr. Cristiano Ronaldo",
    specialty: "Especialista en Medicina Interna",
    avatar: "",
  },
  date: "15 de octubre, 2025",
  time: "10:00 AM - 10:45 AM",
  type: "Plan Nutricional",
  location: "Consultorio 305, sede Centro",
};

const additionalSections = [
  { icon: History, label: "Citas pasadas" },
  { icon: FileText, label: "Última Consulta" },
  { icon: User, label: "Detalle del Paciente" },
  { icon: File, label: "Detalles de la cita" },
];

interface ConsultationInfoProps {
  appointmentId: string;
}

export const ConsultationInfo = (props: ConsultationInfoProps) => {
  const userRole = useAppStore((state) => state.user?.role);
  const isMobile = useIsMobile();

  const appointment = mockAppointments.find(
    (a) => a.id === props.appointmentId,
  );
  const mostRecentHistoryId =
    appointment?.history?.[appointment.history.length - 1]?.id;

  return (
    <div className="bg-background p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary/15 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Doctor Info Section */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
            Información de la consulta
          </h3>

          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 bg-background border border-none rounded-2xl md:rounded-3xl">
            <div className="h-16 w-16 md:h-20 md:w-20 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center flex-shrink-0">
              {consultationData.doctor.avatar ? (
                <Avatar className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden">
                  <AvatarImage
                    src={consultationData.doctor.avatar}
                    alt={consultationData.doctor.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {consultationData.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <MCUserAvatar
                  name={consultationData.doctor.name}
                  square={false}
                  size={isMobile ? 64 : 80}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm md:text-base truncate">
                {consultationData.doctor.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                {consultationData.doctor.specialty}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
              <span className="truncate">{consultationData.date}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
              <span className="truncate">{consultationData.time}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <Stethoscope className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
              <span className="truncate">{consultationData.type}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
              <span className="line-clamp-2">{consultationData.location}</span>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
            Secciones Adicionales
          </h3>
          <div className="space-y-1.5 md:space-y-2">
            {additionalSections.map((section, index) => {
              if (section.label === "Detalles de la cita") {
                return (
                  <ViewDetailsAppointmentDialog
                    appointmentId={props.appointmentId}
                    preview="details"
                    key={index}
                  >
                    <button className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-bg-btn-secondary w-full p-2 transition-colors rounded-lg md:rounded-full text-left">
                      <section.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </ViewDetailsAppointmentDialog>
                );
              }
              if (section.label === "Citas pasadas") {
                return (
                  <ViewDetailsAppointmentDialog
                    appointmentId={props.appointmentId}
                    preview="history"
                    key={index}
                  >
                    <button className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-bg-btn-secondary w-full p-2 transition-colors rounded-lg md:rounded-full text-left">
                      <section.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </ViewDetailsAppointmentDialog>
                );
              }
              if (
                section.label === "Detalle del Paciente" &&
                userRole === "PATIENT"
              ) {
                return null;
              }
              if (section.label === "Última Consulta" && mostRecentHistoryId) {
                return (
                  <MedicalPrescriptionDialog
                    appointmentId={props.appointmentId}
                    historyId={mostRecentHistoryId}
                    key={index}
                  >
                    <button className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-bg-btn-secondary w-full p-2 transition-colors rounded-lg md:rounded-full text-left">
                      <section.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </MedicalPrescriptionDialog>
                );
              }
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-bg-btn-secondary w-full p-2 transition-colors rounded-lg md:rounded-full text-left"
                >
                  <section.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
