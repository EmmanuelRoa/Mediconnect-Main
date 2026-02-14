import React from "react";
import MCCounterInput from "@/shared/components/forms/MCCounterInput";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { serviceSchema } from "@/schema/createService.schema";
import { useTranslation } from "react-i18next";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";

function CounterModal({ children }: { children?: React.ReactNode }) {
  const setCreateServiceField = useCreateServicesStore(
    (s) => s.setCreateServiceField,
  );
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);

  const { t } = useTranslation();
  const numberOfSessionsSchema = serviceSchema(t).pick({
    numberOfSessions: true,
  });

  const handleSubmit = (data: any) => {
    setCreateServiceField("numberOfSessions", data.numberOfSessions);
  };

  return (
    <MCModalBase
      id="counter-modal"
      title={t("Número de sesiones")}
      trigger={children}
      variant="decide"
      size="smWide"
      confirmText={t("Guardar")}
      onConfirm={() =>
        handleSubmit({ numberOfSessions: createServiceData.numberOfSessions })
      }
      secondaryText={t("Cancelar")}
      triggerClassName="w-full h-auto"
    >
      <MCFormWrapper
        schema={numberOfSessionsSchema}
        defaultValues={{
          numberOfSessions:
            typeof createServiceData.numberOfSessions === "number"
              ? createServiceData.numberOfSessions
              : 1,
        }}
        onSubmit={handleSubmit}
      >
        <MCCounterInput
          name="numberOfSessions"
          variant="participants"
          min={1}
          max={5}
          step={1}
          onChange={(value) => setCreateServiceField("numberOfSessions", value)}
          defaultValue={
            typeof createServiceData.numberOfSessions === "number"
              ? createServiceData.numberOfSessions
              : 1
          }
        />
      </MCFormWrapper>
    </MCModalBase>
  );
}

export default CounterModal;
