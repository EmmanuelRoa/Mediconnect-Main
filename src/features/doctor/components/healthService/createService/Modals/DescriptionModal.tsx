import { MCModalBase } from "@/shared/components/MCModalBase";
import MCAnimatedInput from "@/shared/components/forms/MCAnimatedInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { serviceSchema } from "@/schema/createService.schema";
import { useTranslation } from "react-i18next";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { useEffect, useRef } from "react";

interface DescriptionModalProps {
  children?: React.ReactNode;
}

function DescriptionModal({ children }: DescriptionModalProps) {
  const setCreateServiceField = useCreateServicesStore(
    (s) => s.setCreateServiceField,
  );
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);
  const submitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    console.log("Descripción actual:", createServiceData.description);
  }, [createServiceData.description]);

  const { t } = useTranslation();
  const descriptionSchema = serviceSchema(t).pick({ description: true });

  const handleSubmit = (data: any) => {
    setCreateServiceField("description", data.description);
  };

  const handleConfirm = () => {
    submitRef.current?.();
  };

  return (
    <MCModalBase
      id="description-modal"
      title="Descripción del servicio"
      trigger={children}
      variant="decide"
      onConfirm={handleConfirm}
      confirmText="Guardar"
      secondaryText="Cancelar"
      triggerClassName="w-full"
      size="mdAuto"
    >
      <div className="w-full">
        <MCFormWrapper
          schema={descriptionSchema}
          defaultValues={{
            description: createServiceData.description,
          }}
          onSubmit={handleSubmit}
          submitRef={submitRef}
        >
          <MCAnimatedInput
            name="description"
            placeholder="Ingresa tu descripción aquí..."
            maxLength={250}
            variant="Description"
          />
        </MCFormWrapper>
      </div>
    </MCModalBase>
  );
}

export default DescriptionModal;
