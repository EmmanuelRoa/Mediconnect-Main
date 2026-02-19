import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

interface RejectAppointmentProps {
  children?: React.ReactNode;
  appointmentId: string;
}

function RejectAppointment({
  children,
  appointmentId,
}: RejectAppointmentProps) {
  const { t } = useTranslation("patient");
  const setToast = useGlobalUIStore((state) => state.setToast);

  const handleConfirm = () => {
    console.log("Confirm pressed");
    setToast({
      message: t("appointment.rejectedSuccess", "Cita rechazada correctamente"),
      type: "success",
      open: true,
    });
    console.log("Cita rechazada:", appointmentId);
  };

  const handleSecondary = () => {
    console.log("Cancel pressed");
    setToast({
      message: t(
        "appointment.rejectAborted",
        "Acción de rechazar cita cancelada",
      ),
      type: "info",
      open: true,
    });
    console.log("Acción de rechazo cancelada:", appointmentId);
  };

  return (
    <MCModalBase
      id={appointmentId}
      title={t("appointment.rejectTitle", "Rechazar cita")}
      trigger={children}
      description={t(
        "appointment.rejectDescription",
        "¿Estás seguro de que deseas rechazar esta cita? El paciente será notificado automáticamente.",
      )}
      triggerClassName="w-full flex-1"
      variant="warning"
      size="sm"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={t("appointment.confirmReject", "Rechazar")}
      secondaryText={t("appointment.cancelAction", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}

export default RejectAppointment;
