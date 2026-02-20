import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { serviceSchema } from "@/schema/createService.schema";
import MCAnimatedInput from "@/shared/components/forms/MCAnimatedInput";
import ServicesLayoutsSteps from "./ServicesLayoutsSteps";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import { useEffect, useState } from "react";

function ServiceTittleStep() {
  const { t } = useTranslation("doctor");
  const nameSchema = serviceSchema(t).pick({ name: true });
  const setName = useCreateServicesStore((s) => s.setCreateServiceField);
  const name = useCreateServicesStore((s) => s.createServiceData.name);
  const setIsTitleSeted = useCreateServicesStore((s) => s.setIsTitleSeted);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = (data: { name: string }) => {
    setName("name", data.name);
    setIsTitleSeted(true);
  };

  const isButtondisabled = !isFormValid || !name || name.trim() === "";

  return (
    <ServicesLayoutsSteps title={t("createService.title")}>
      <MCFormWrapper
        schema={nameSchema}
        defaultValues={{ name }}
        onSubmit={handleSubmit}
        onValidationChange={setIsFormValid}
        className="w-full"
      >
        <MCAnimatedInput
          name="name"
          label={t("createService.inputs.nameLabel")}
          onChange={(value) => setName("name", value)}
        />
        <AuthFooterContainer
          backButtonProps={{
            disabled: true,
          }}
          continueButtonProps={{
            type: "submit",
            disabled: isButtondisabled,
          }}
        />
      </MCFormWrapper>
    </ServicesLayoutsSteps>
  );
}

export default ServiceTittleStep;
