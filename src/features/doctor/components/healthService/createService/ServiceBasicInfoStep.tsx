import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { serviceSchema } from "@/schema/createService.schema";
import MCAnimatedInput from "@/shared/components/forms/MCAnimatedInput";
import ServicesLayoutsSteps from "./ServicesLayoutsSteps";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import DescriptionModal from "./Modals/DescriptionModal";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCInput from "@/shared/components/forms/MCInput";
function ServiceBasicInfoStep() {
  const { t } = useTranslation();
  const basicInfoSchema = serviceSchema(t).pick({
    specialty: true,
    selectedModality: true,
    pricePerSession: true,
    description: true,
    numberOfSessions: true,
    duration: true,
  });

  const setCreateServiceField = useCreateServicesStore(
    (s) => s.setCreateServiceField,
  );
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);

  const handleSubmit = (data: any) => {
    // Handle form submission logic here
    console.log(data);
  };

  const modalityOptions = [
    { value: "presencial", label: t("modality.presencial") },
    { value: "teleconsulta", label: t("modality.teleconsulta") },
    { value: "Mixta", label: t("modality.mixed") },
  ];

  // Opciones de especialidad (ejemplo)
  const specialtyOptions = [
    { value: "cardiologia", label: t("specialty.cardiology") },
    { value: "pediatria", label: t("specialty.pediatrics") },
    // Agrega más especialidades según tu necesidad
  ];

  return (
    <ServicesLayoutsSteps title="Ponle un título a tu servicio">
      <MCFormWrapper
        schema={basicInfoSchema}
        defaultValues={{
          specialty: createServiceData.specialty || "",
          selectedModality: createServiceData.selectedModality || "presencial",
          pricePerSession: createServiceData.pricePerSession,
          description: createServiceData.description || "",
          numberOfSessions: createServiceData.numberOfSessions,
          duration: createServiceData.duration,
        }}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="space-y-4">
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
          <DescriptionModal>
            <MCInput
              name="description"
              label={t("form.description")}
              placeholder={t("form.serviceDescription")}
              variant="internal-vertical"
              internalTitle={t("form.optional")}
              internalPlaceholder={t("form.descriptionPlaceholder")}
            />
          </DescriptionModal>
          <MCInput
            name="numberOfSessions"
            label={t("form.numberOfSessions")}
            type="number"
            className="my-input"
            variant="internal-horizontal"
            internalTitle={t("form.sessions")}
            internalPlaceholder={t("form.numberOfSessionsPlaceholder")}
          />

          <MCInput
            name="duration"
            label={t("form.durationHours")}
            variant="internal-horizontal"
            internalTitle={t("form.hours")}
            internalPlaceholder={t("form.durationPlaceholder")}
          />

          <MCInput
            name="pricePerSession"
            label={t("form.price")}
            type="number"
            variant="internal-horizontal"
            internalTitle={t("form.pricePerSession")}
            internalPlaceholder={t("form.pricePerSessionPlaceholder")}
            className="my-input"
          />
        </div>
        <AuthFooterContainer
          backButtonProps={{
            disabled: true,
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
