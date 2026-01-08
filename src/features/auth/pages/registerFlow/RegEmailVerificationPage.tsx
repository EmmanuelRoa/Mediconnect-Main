import { useEffect } from "react";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { ForgotPasswordSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../../components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";

function RegEmailVerificationPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const selectedRole = useAppStore((state) => state.selectedRole);
  const basicInfo = useAppStore((state) => state.patientOnboardingData);
  const setBasicInfo = useAppStore((state) => state.setPatientOnboardingData);

  console.log(basicInfo);

  // FIX: Mover la validación a useEffect para evitar el bucle infinito
  useEffect(() => {
    if (!selectedRole) {
      console.log("No role selected, redirecting...");
      navigate("/auth/register", { replace: true });
    }
  }, [selectedRole, navigate]);

  const handlesubmit = (data: { email: string }) => {
    if (data && setBasicInfo && basicInfo) {
      setBasicInfo({
        ...basicInfo,
        email: data.email ?? "",
        role: "Patient",
        name: basicInfo?.name ?? "",
        lastName: basicInfo?.lastName ?? "",
        identityDocument: basicInfo?.identityDocument ?? "",
        password: basicInfo?.password ?? "",
        confirmPassword: basicInfo?.confirmPassword ?? "",
        urlImg: basicInfo?.urlImg ?? "",
      });
      navigate("/auth/otp-verification", { replace: true });
    }
  };

  // Evitar renderizar el contenido si no hay rol seleccionado
  if (!selectedRole) {
    return null;
  }

  return (
    <AuthContentContainer
      title={t("registerEmailVerifyPage.title")}
      // FIX: Pasar string en lugar de JSX para evitar <div> dentro de <p>
      subtitle={t("registerEmailVerifyPage.subtitle")}
    >
      <MCFormWrapper
        schema={ForgotPasswordSchema((key) => t(key))}
        onSubmit={(data) => {
          handlesubmit(data);
        }}
        defaultValues={{
          email: basicInfo?.email || "",
        }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            name="email"
            type="email"
            label={t("forgotPassword.emailLabel")}
            placeholder={t("forgotPassword.emailPlaceholder")}
          />
          <p className="text-center mt-2 w-full">{basicInfo?.email}</p>
        </div>
        <AuthFooterContainer
          backButtonProps={{
            onClick: () => {
              navigate("/auth/register");
            },
          }}
        />
      </MCFormWrapper>
      <p>{selectedRole}</p>
    </AuthContentContainer>
  );
}

export default RegEmailVerificationPage;
