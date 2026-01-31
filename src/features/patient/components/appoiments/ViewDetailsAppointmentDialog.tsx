import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import MapScheduleLocation from "@/shared/components/maps/MapScheduleLocation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { mockAppointments } from "@/data/appointments";
import { type Appointment } from "@/data/appointments";
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-[#6A1B9A]/12 text-[#6A1B9A]" },
  pending: { label: "Pending", color: "bg-[#C77A1F]/12 text-[#C77A1F]" },
  in_progress: {
    label: "In Progress",
    color: "bg-[#1565C0]/12 text-[#1565C0]",
  },
  completed: { label: "Completed", color: "bg-[#2E7D32]/12 text-[#2E7D32]" },
  cancelled: { label: "Cancelled", color: "bg-[#C62828]/12 text-[#C62828]" },
};

interface ViewDetailsAppointmentDialogProps {
  children?: React.ReactNode;
  appointmentId: string;
  appointmentDetails?: React.ReactNode;
  hospitalDetails?: React.ReactNode;
  status?: string; // <-- Añade status aquí
}

function DetailsTabContent({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Servicio</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.Service}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Especialidad</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.doctorSpecialty}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Fecha</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.date}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Horario</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.time}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Precio</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            ${appointment.price}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">
            Numeros de Pacientes
          </h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.numberOfPatients}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Modalidad</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.appointmentType}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-md text-primary/75 font-medium">Doctor</h3>
          <p className="text-lg text-primary font-medium break-words max-w-xs">
            {appointment.doctorName}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-md text-primary/75 font-medium">Descripción</h3>
        <p className="text-lg text-primary font-medium break-words max-w-xs">
          {appointment.description}
        </p>
      </div>
      <div className="flex flex-col items-start gap-1 pb-4">
        <h3 className="text-md text-primary/75 font-medium">Ubicación</h3>
        <div className="w-full rounded-lg overflow-hidden">
          <MapScheduleLocation
            initialLocation={{
              lat: appointment.location.latitude,
              lng: appointment.location.longitude,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HistoryTabContent() {
  return <div className="">Historial de la cita médica</div>;
}

function ViewDetailsAppointmentDialog({
  children,
  appointmentId,
  appointmentDetails,
  hospitalDetails,
  status = "pending", // Valor por defecto
}: ViewDetailsAppointmentDialogProps) {
  const { t } = useTranslation();

  const appointmentStatus = mockAppointments.find(
    (appt) => appt.id === appointmentId,
  )?.status;

  const statusInfo = STATUS_MAP[appointmentStatus || status] || {
    label: appointmentStatus || status,
    color: "bg-gray-200 text-gray-600",
  };

  return (
    <MCModalBase
      id={appointmentId}
      title={t("appointment.detailsTitle") || "Detalles de la cita"}
      trigger={children}
      triggerClassName="w-full flex-1"
      size="xl"
      variant="info"
    >
      <Tabs defaultValue="details">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="details">
            {t("appointment.detailsTab") || "Detalles de la cita"}
          </TabsTrigger>
          <TabsTrigger value="hospital">
            {t("appointment.historyTab") || "Historial"}
          </TabsTrigger>
        </TabsList>
        {/* Estado visual */}
        <div
          className={`flex w-full text-lg rounded-xl py-2 px-4 ${statusInfo.color}`}
        >
          <p> {statusInfo.label}</p>
        </div>
        <TabsContent value="details">
          {appointmentDetails ? (
            appointmentDetails
          ) : (
            <div className="mt-4 text-center text-muted-foreground">
              <DetailsTabContent
                appointment={
                  mockAppointments.find((Q) => Q.id === appointmentId)!
                }
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="hospital">
          {hospitalDetails ? (
            hospitalDetails
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <HistoryTabContent />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MCModalBase>
  );
}

export default ViewDetailsAppointmentDialog;
