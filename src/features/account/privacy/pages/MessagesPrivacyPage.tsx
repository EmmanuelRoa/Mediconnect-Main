import React from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCSelect from "@/shared/components/forms/MCSelect";
import { useProfileStore } from "@/stores/useProfileStore";
import { useAppStore } from "@/stores/useAppStore";
import {
  doctorMessageConfigSchema,
  centerMessageConfigSchema,
  patientMessageConfigSchema,
} from "@/schema/account.schema";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function MessagesPrivacyPage() {
  const isMobile = useIsMobile();
  const userRole = useAppStore((state) => state.user?.role);

  const doctorConfig = useProfileStore(
    (state) => state.doctorMessageConfigData,
  );
  const setDoctorConfig = useProfileStore(
    (state) => state.setDoctorMessageConfigData,
  );
  const centerConfig = useProfileStore(
    (state) => state.centerMessageConfigData,
  );
  const setCenterConfig = useProfileStore(
    (state) => state.setCenterMessageConfigData,
  );
  const patientConfig = useProfileStore(
    (state) => state.patientMessageConfigData,
  );
  const setPatientConfig = useProfileStore(
    (state) => state.setPatientMessageConfigData,
  );

  // Handlers for each config
  const handleDoctorConfigSubmit = (data: any) => setDoctorConfig(data);
  const handleCenterConfigSubmit = (data: any) => setCenterConfig(data);
  const handlePatientConfigSubmit = (data: any) => setPatientConfig(data);

  let configForm = null;
  if (userRole === "DOCTOR") {
    configForm = (
      <MCFormWrapper
        schema={doctorMessageConfigSchema}
        onSubmit={handleDoctorConfigSubmit}
        defaultValues={
          doctorConfig || { patientMessage: "NONE", centerMessage: "NONE" }
        }
        className={`${isMobile ? "w-full" : "w-md"} mt-4 flex flex-col items-center gap-4 h-full`}
      >
        <MCSelect
          name="patientMessage"
          label="Mensajes a Pacientes"
          options={[
            { label: "Con cita", value: "WITH_APPOINTMENT" },
            { label: "Previas", value: "PREVIOUS" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
        <MCSelect
          name="centerMessage"
          label="Mensajes a Centros"
          options={[
            { label: "Conexión establecida", value: "CONNECTION_ESTABLISHED" },
            { label: "Cualquier centro", value: "ANY_CENTER" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
      </MCFormWrapper>
    );
  } else if (userRole === "CENTER") {
    configForm = (
      <MCFormWrapper
        schema={centerMessageConfigSchema}
        onSubmit={handleCenterConfigSubmit}
        defaultValues={
          centerConfig || { patientMessage: "NONE", doctorMessage: "NONE" }
        }
        className={`${isMobile ? "w-full" : "w-md"} mt-4 flex flex-col items-center gap-4 h-full`}
      >
        <MCSelect
          name="patientMessage"
          label="Mensajes a Pacientes"
          options={[
            { label: "Cualquiera", value: "ANY" },
            { label: "Con cita", value: "WITH_APPOINTMENT" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
        <MCSelect
          name="doctorMessage"
          label="Mensajes a Doctores"
          options={[
            { label: "Cualquiera", value: "ANY" },
            { label: "Afiliados", value: "AFFILIATED" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
      </MCFormWrapper>
    );
  } else if (userRole === "PATIENT") {
    configForm = (
      <MCFormWrapper
        schema={patientMessageConfigSchema}
        onSubmit={handlePatientConfigSubmit}
        defaultValues={
          patientConfig || { doctorMessage: "NONE", centerMessage: "NONE" }
        }
        className={`${isMobile ? "w-full" : "w-md"} mt-4 flex flex-col items-center gap-4 h-full`}
      >
        <MCSelect
          name="doctorMessage"
          label="Mensajes a Doctores"
          options={[
            { label: "Cualquiera", value: "ANY" },
            { label: "Mis doctores", value: "MY_DOCTORS" },
            { label: "Con cita", value: "WITH_APPOINTMENT" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
        <MCSelect
          name="centerMessage"
          label="Mensajes a Centros"
          options={[
            { label: "Cualquiera", value: "ANY" },
            { label: "Con cita", value: "WITH_APPOINTMENT" },
            { label: "Nadie", value: "NONE" },
          ]}
          className="w-full"
        />
      </MCFormWrapper>
    );
  }

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${isMobile ? "min-w-0" : "min-w-xl"}`}
        >
          <h1
            className={`${isMobile ? "text-3xl" : "text-5xl"} font-medium text-center mb-2`}
          >
            Configuración de privacidad de mensajes
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Elige quién puede enviarte mensajes según tu tipo de cuenta.
          </p>
          {configForm}
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default MessagesPrivacyPage;
