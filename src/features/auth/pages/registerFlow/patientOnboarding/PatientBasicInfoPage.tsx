import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "@/features/auth/components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
// Importa zod si usas validación
import { z } from "zod";

const basicInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  document: z.string().min(1),
});

function PatientBasicInfoPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "Juan Luis",
    lastName: "Guerrero Matos",
    document: "000-00000-0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Aquí puedes manejar el envío del formulario
    navigate("/siguiente-paso"); // Cambia la ruta según tu flujo
  };

  return (
    <AuthContentContainer
      title={t("Crear cuenta en MediConnect")}
      subtitle={t(
        "Por favor, completa tu información básica para continuar con el proceso de registro."
      )}
    >
      <MCFormWrapper
        onSubmit={handleSubmit}
        schema={basicInfoSchema}
        defaultValues={{
          firstName: form.firstName,
          lastName: form.lastName,
          document: form.document,
        }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            label={t("Nombre(s)")}
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <MCInput
            label={t("Apellido(s)")}
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <MCInput
            label={t("Documento de identificación")}
            name="document"
            value={form.document}
            onChange={handleChange}
            required
          />
        </div>
      </MCFormWrapper>
      <AuthFooterContainer
        continueButtonProps={{
          onClick() {
            navigate("/auth/patient-onboarding/password-setup");
          },
        }}
        backButtonProps={{
          onClick() {
            navigate("/auth/otp-verification");
          },
        }}
      />
    </AuthContentContainer>
  );
}

export default PatientBasicInfoPage;
