import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConsultationInfoVertical } from "@/features/teleconsultation/components/ConsultationInfoVertical";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";

import { ConsultationInfo } from "@/features/teleconsultation/components/ConsultationInfo";
import Prescription from "@/features/teleconsultation/components/chatPanel/Prescription";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { MessageSquare, Info } from "lucide-react";

function AppointmentConsultation() {
  const { appointmentId } = useParams();

  return (
    <MCDashboardContent mainWidth="w-[100%] " noBg>
      <div className="grid grid-cols-[7fr_3fr] gap-4 w-full items-start justify-center">
        <div className="flex flex-col gap-3">
          <div className="bg-background p-4 md:p-6 rounded-2xl md:rounded-3xl border border-primary/15 shadow-sm flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold text-primary ">
              Registro de Notas Médicas
            </h2>
            <Prescription minHeight="500px" maxHeight="900px" />
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <ConsultationInfoVertical appointmentId={"1"} />
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default AppointmentConsultation;
