import React from "react";
import { useTranslation } from "react-i18next";
import { Eye, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

interface StaffActionsProps {
  doctor: {
    id: string;
    name: string;
    status: string;
  };
}

function StaffActions({ doctor }: StaffActionsProps) {
  const { t } = useTranslation("center");
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(
      ROUTES.DOCTOR.DOCTOR_PROFILE_PUBLIC.replace(":doctorId", doctor.id),
    );
  };

  const handleDisconnect = () => {
    // Lógica para desconectar al médico
    console.log("Desconectar médico:", doctor.id);
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div
        className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 transition text-sm flex items-center gap-2"
        onClick={handleViewProfile}
      >
        <Eye className="h-4 w-4" />
        {t("staff.viewProfile", "Ver Perfil")}
      </div>
      <div
        className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm flex items-center gap-2"
        onClick={handleDisconnect}
      >
        <UserX className="h-4 w-4" />
        {t("staff.disconnect", "Desconectar")}
      </div>
    </div>
  );
}

export default StaffActions;
