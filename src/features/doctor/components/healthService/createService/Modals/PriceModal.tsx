import MCCounterInput from "@/shared/components/forms/MCCounterInput";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { serviceSchema } from "@/schema/createService.schema";
import { useTranslation } from "react-i18next";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { useRef } from "react";

interface PriceModalProps {
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

function PriceModal({ children, updateField }: PriceModalProps) {
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);
  const submitRef = useRef<(() => void) | null>(null);

  const { t } = useTranslation();
  const priceSchema = serviceSchema(t).pick({ pricePerSession: true });

  const handleSubmit = (data: any) => {
    updateField("pricePerSession", data.pricePerSession);
  };

  const handleConfirm = () => {
    submitRef.current?.();
  };

  return (
    <MCModalBase
      id="price-modal"
      title={t("form.price")}
      trigger={children}
      variant="decide"
      size="smWide"
      confirmText={t("Guardar")}
      onConfirm={handleConfirm}
      secondaryText={t("Cancelar")}
      triggerClassName="w-full h-auto"
    >
      <MCFormWrapper
        schema={priceSchema}
        defaultValues={{
          pricePerSession:
            typeof createServiceData.pricePerSession === "number"
              ? createServiceData.pricePerSession
              : 1,
        }}
        onSubmit={handleSubmit}
        submitRef={submitRef}
      >
        <MCCounterInput
          name="pricePerSession"
          variant="price"
          min={1}
          step={1}
          defaultValue={
            typeof createServiceData.pricePerSession === "number"
              ? createServiceData.pricePerSession
              : 1
          }
          label={t("form.price")}
        />
      </MCFormWrapper>
    </MCModalBase>
  );
}

export default PriceModal;
