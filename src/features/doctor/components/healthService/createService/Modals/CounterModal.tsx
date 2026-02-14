import MCCounterInput from "@/shared/components/forms/MCCounterInput";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { serviceSchema } from "@/schema/createService.schema";
import { useTranslation } from "react-i18next";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { useRef } from "react";

interface CounterModalProps {
  children?: React.ReactNode;
  updateField: (
    fieldName:
      | "name"
      | "description"
      | "specialty"
      | "selectedModality"
      | "pricePerSession"
      | "numberOfSessions"
      | "duration"
      | "images"
      | "location"
      | "comercial_schedule",
    value: any,
  ) => void;
}

function CounterModal({ children, updateField }: CounterModalProps) {
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);
  const submitRef = useRef<(() => void) | null>(null);

  const { t } = useTranslation();
  const sessionsSchema = serviceSchema(t).pick({ numberOfSessions: true });

  const handleSubmit = (data: any) => {
    console.log("Datos enviados desde modal:", data);
    updateField("numberOfSessions", data.numberOfSessions);
  };

  const handleConfirm = () => {
    submitRef.current?.();
  };

  return (
    <MCModalBase
      id="counter-modal"
      title={t("form.numberOfSessions")}
      trigger={children}
      variant="decide"
      size="smWide"
      confirmText="Guardar"
      onConfirm={handleConfirm}
      secondaryText="Cancelar"
      triggerClassName="w-full h-auto"
    >
      <MCFormWrapper
        schema={sessionsSchema}
        defaultValues={{
          numberOfSessions: createServiceData.numberOfSessions || 1,
        }}
        onSubmit={handleSubmit}
        submitRef={submitRef}
      >
        <MCCounterInput
          name="numberOfSessions"
          variant="participants"
          min={1}
          max={5}
          step={1}
          defaultValue={createServiceData.numberOfSessions || 1}
          label={t("form.numberOfSessions")}
        />
      </MCFormWrapper>
    </MCModalBase>
  );
}

export default CounterModal;
