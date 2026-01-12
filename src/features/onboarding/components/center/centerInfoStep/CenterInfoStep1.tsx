import MCInput from "@/shared/components/forms/MCInput";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { useAppStore } from "@/stores/useAppStore";
import { CenterBasicInfoSchema } from "@/schema/OnbordingSchema";
import { useEffect } from "react";

type CenterInfoStep1Props = {
  children?: React.ReactNode;
  onValidationChange?: (isValid: boolean) => void;
  onNext?: () => void;
};

function CenterInfoStep1({
  children,
  onValidationChange,
  onNext,
}: CenterInfoStep1Props) {
  const centerOnboardingData = useAppStore(
    (state) => state.centerOnboardingData
  );
  const setCenterField = useAppStore((state) => state.setCenterField);

  const typeOptions = [
    { value: "clinica", label: "Clínica" },
    { value: "hospital", label: "Hospital" },
    { value: "laboratorio", label: "Laboratorio" },
    { value: "centro_diagnostico", label: "Centro Diagnóstico" },
    { value: "otro", label: "Otro" },
  ];

  const handleSubmit = (data: any) => {
    onValidationChange?.(true);
    onNext?.();
  };

  useEffect(() => {
    console.log("Center Onboarding Data:", centerOnboardingData);
  }, [centerOnboardingData]);

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Información del centro
        </h1>
        <p className="text-primary/60 text-sm sm:text-base">
          Complete la información básica de su centro
        </p>
      </div>

      <MCFormWrapper
        schema={CenterBasicInfoSchema((t) => t)}
        onSubmit={handleSubmit}
        defaultValues={centerOnboardingData}
        onValidationChange={onValidationChange}
      >
        <div className="space-y-4">
          {/* Nombre y tipo de centro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MCInput
              name="name"
              label="Nombre del centro"
              placeholder="Centro Médico Vitalia"
              onChange={(e) => setCenterField?.("name", e.target.value)}
            />
            <MCSelect
              name="centerType"
              label="Tipo de centro"
              placeholder="Seleccionar tipo"
              options={typeOptions}
              onChange={(value) =>
                setCenterField?.(
                  "centerType",
                  Array.isArray(value) ? value[0] : value
                )
              }
            />
          </div>

          {/* Descripción */}
          <MCTextArea
            name="Description"
            label="Descripción"
            placeholder="Describe brevemente el centro"
            onChange={(e) => setCenterField?.("Description", e.target.value)}
          />

          {/* Website y RNC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MCInput
              name="website"
              label="Sitio web"
              placeholder="https://tucentro.com"
              onChange={(e) => setCenterField?.("website", e.target.value)}
            />
            <MCInput
              name="rnc"
              label="RNC"
              placeholder="123456789"
              onChange={(e) => setCenterField?.("rnc", e.target.value)}
            />
          </div>

          {/* Teléfono */}
          <MCInput
            name="phone"
            label="Teléfono"
            type="tel"
            placeholder="+1 (809) 000-0000"
            onChange={(e) => setCenterField?.("phone", e.target.value)}
          />
        </div>
        {children}
      </MCFormWrapper>
    </div>
  );
}

export default CenterInfoStep1;
