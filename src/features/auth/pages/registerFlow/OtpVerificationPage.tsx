import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../../components/AuthContentContainer";
import MCOtpInput from "@/shared/components/forms/MCOtpInput";
import { OtpSchema } from "@/schema/AuthSchema";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../../components/AuthFooterContainer";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function OtpVerificationPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  // FIX: Obtener el email del basicInfo o patientOnboardingData
  const basicInfo = useAppStore((state) => state.patientOnboardingData);
  const confirmedEmail = basicInfo?.email;

  const otpData = useAppStore((state) => state.otp);
  const setOtp = useAppStore((state) => state.setOtp);
  const selectedRole = useAppStore((state) => state.selectedRole);
  console.log(basicInfo);
  // Validar que exista email confirmado
  useEffect(() => {
    if (!confirmedEmail) {
      console.log("No confirmed email, redirecting...");
      navigate("/auth/reg-email-verification", { replace: true });
    }
  }, [confirmedEmail, navigate]);

  const handleSubmit = (data: { otp: string }) => {
    console.log("OTP Data:", data);
    setOtp(data.otp);

    // FIX: Remover la validación innecesaria de otpData
    if (selectedRole === "Patient") {
      navigate("/auth/patient-onboarding/basic-info", { replace: true });
    } else if (selectedRole === "Doctor") {
      navigate("/auth/doctor-onboarding", { replace: true });
    } else if (selectedRole === "Center") {
      navigate("/auth/center-onboarding", { replace: true });
    } else {
      // Si no hay rol, redirigir al registro
      navigate("/auth/register", { replace: true });
    }
  };

  // Early return si no hay email confirmado
  if (!confirmedEmail) {
    return null;
  }

  return (
    <AuthContentContainer
      title={t("verifyEmail.title")}
      subtitle={
        <div>
          {t("verifyEmail.subtitle")}
          <br />
          <span className="font-semibold text-primary">{confirmedEmail}</span>
        </div>
      }
    >
      <MCFormWrapper
        schema={OtpSchema((key) => t(key))}
        onSubmit={handleSubmit}
        defaultValues={{ otp: otpData || "" }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCOtpInput
            onChange={(value) => {
              setOtp(value);
            }}
          />
          {/* Solo para debugging, remover en producción */}
          {otpData && (
            <p className="text-center mt-2 w-full text-sm text-gray-500">
              {otpData}
            </p>
          )}
        </div>

        <div className="w-full max-w-md m-4 flex flex-col items-center gap-4">
          <p className="text-md text-primary/80 mb-2 text-center">
            <span className="font-semibold text-primary">
              {t("verifyEmail.tip").split(":")[0]}:
            </span>{" "}
            {t("verifyEmail.tip").split(":")[1]}
          </p>
          <MCButton
            variant="tercero"
            size="m"
            type="button"
            onClick={() => {
              // TODO: Implementar lógica de reenvío de OTP
              console.log("Resending OTP to:", confirmedEmail);
            }}
          >
            {t("verifyEmail.resend")}
          </MCButton>
        </div>

        <AuthFooterContainer
          backButtonProps={{
            onClick: () => {
              navigate("/auth/reg-email-verification", { replace: true });
            },
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default OtpVerificationPage;
