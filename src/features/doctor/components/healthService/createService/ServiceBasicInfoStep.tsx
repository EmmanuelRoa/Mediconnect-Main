import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { serviceSchema } from "@/schema/createService.schema";
import ServicesLayoutsSteps from "./ServicesLayoutsSteps";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import DescriptionModal from "./Modals/DescriptionModal";
import CounterModal from "./Modals/CounterModal";
import PriceModal from "./Modals/PriceModal";
import DurationModal from "./Modals/DurationModal";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCInput from "@/shared/components/forms/MCInput";
import { useEffect, useRef } from "react";

function ServiceBasicInfoStep() {
  const { t } = useTranslation();
  const formRef = useRef<any>(null);
  const submitRef = useRef<any>(null);

  const basicInfoSchema = serviceSchema(t).pick({
    specialty: true,
    selectedModality: true,
    pricePerSession: true,
    description: true,
    numberOfSessions: true,
    duration: true,
  });

  const createServiceData = useCreateServicesStore((s) => s.createServiceData);
  const setCreateServiceData = useCreateServicesStore(
    (s) => s.setCreateServiceData,
  );
  const setCreateServiceField = useCreateServicesStore(
    (s) => s.setCreateServiceField,
  );
  const goToNextStep = useCreateServicesStore((s) => s.goToNextStep);
  const goToPreviousStep = useCreateServicesStore((s) => s.goToPreviousStep);

  // UPDATED: With correct typing
  const updateField = (
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
  ) => {
    setCreateServiceField(fieldName, value);
    if (formRef.current?.setValue) {
      formRef.current.setValue(fieldName, value);
    }
  };

  useEffect(() => {
    if (formRef.current?.reset) {
      formRef.current.reset({
        specialty: createServiceData.specialty || "",
        selectedModality: createServiceData.selectedModality || "presencial",
        pricePerSession: createServiceData.pricePerSession || 1,
        description: createServiceData.description || "",
        numberOfSessions: createServiceData.numberOfSessions || 1,
        duration: createServiceData.duration || { hours: 0, minutes: 30 },
      });
    }
  }, [createServiceData]);

  const handleSubmit = (data: any) => {
    const formattedData = {
      ...data,
      specialty: data.specialty,
      selectedModality: data.selectedModality,
      pricePerSession: Number(data.pricePerSession),
      numberOfSessions: Number(data.numberOfSessions),
      duration: {
        hours: Number(data.duration?.hours || 0),
        minutes: Number(data.duration?.minutes || 30),
      },
    };

    setCreateServiceData(formattedData);
    goToNextStep();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const modalityOptions = [
    { value: "presencial", label: t("modality.presencial") },
    { value: "teleconsulta", label: t("modality.teleconsulta") },
    { value: "Mixta", label: t("modality.mixed") },
  ];

  const specialtyOptions = [
    { value: "cardiologia", label: t("specialty.cardiology") },
    { value: "pediatria", label: t("specialty.pediatrics") },
  ];

  const formatDurationDisplay = (duration: any) => {
    if (!duration) return "0m";
    if (typeof duration === "object" && duration !== null) {
      const h = parseInt(duration.hours, 10) || 0;
      const m = parseInt(duration.minutes, 10) || 0;
      if (h === 0) return `${m}m`;
      return `${h}h : ${m}m`;
    }
    if (typeof duration === "string") {
      const [hours, minutes] = duration.split(":");
      const h = parseInt(hours, 10) || 0;
      const m = parseInt(minutes, 10) || 0;
      if (h === 0) return `${m}m`;
      return `${h}h : ${m}m`;
    }
    return "0m";
  };

  return (
    <ServicesLayoutsSteps
      title="Haz crecer tu servicio médico con información detallada"
      description="Empieza con una opción accesible para atraer a más pacientes y optimizar tu agenda de manera eficiente."
    >
      <MCFormWrapper
        submitRef={submitRef}
        formRef={formRef} // IMPORTANTE: pasar formRef
        schema={basicInfoSchema}
        defaultValues={{
          specialty: createServiceData.specialty || "",
          selectedModality: createServiceData.selectedModality || "presencial",
          pricePerSession: createServiceData.pricePerSession || 1,
          description: createServiceData.description || "",
          numberOfSessions: createServiceData.numberOfSessions || 1,
          duration: createServiceData.duration || { hours: 0, minutes: 30 },
        }}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="space-y-4 mb-6">
          <MCSelect
            name="specialty"
            label={t("form.specialty")}
            options={specialtyOptions}
            placeholder={t("form.selectSpecialty")}
          />
          <MCSelect
            name="selectedModality"
            label={t("form.modality")}
            options={modalityOptions}
            placeholder={t("form.selectModality")}
          />
          <DescriptionModal updateField={updateField}>
            <MCInput
              name="description"
              label={t("form.description")}
              placeholder={t("form.serviceDescription")}
              variant="internal-vertical"
              internalTitle={t("form.optional")}
              internalPlaceholder={t("form.descriptionPlaceholder")}
            />
          </DescriptionModal>
          <CounterModal updateField={updateField}>
            <MCInput
              name="numberOfSessions"
              label={t("form.numberOfSessions")}
              type="number"
              className="my-input"
              variant="internal-horizontal"
              internalTitle={t("form.sessions")}
              internalPlaceholder={t("form.numberOfSessionsPlaceholder")}
              displayMode="value"
            />
          </CounterModal>
          <DurationModal updateField={updateField}>
            <MCInput
              name="duration"
              label={t("form.durationHours")}
              variant="internal-horizontal"
              internalTitle={t("form.hours")}
              internalPlaceholder="0h : 0m"
              displayMode="value"
              customDisplayValue={formatDurationDisplay(
                createServiceData.duration,
              )}
            />
          </DurationModal>
          <PriceModal updateField={updateField}>
            <MCInput
              name="pricePerSession"
              label={t("form.price")}
              type="number"
              isPrice
              variant="internal-horizontal"
              internalTitle={t("form.pricePerSession")}
              internalPlaceholder={t("form.pricePerSessionPlaceholder")}
              displayMode="value"
            />
          </PriceModal>
        </div>
        <AuthFooterContainer
          backButtonProps={{
            onClick: handleBack,
          }}
          continueButtonProps={{
            type: "submit",
          }}
        />
      </MCFormWrapper>
    </ServicesLayoutsSteps>
  );
}

export default ServiceBasicInfoStep;
