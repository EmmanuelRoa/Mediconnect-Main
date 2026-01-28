import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCOtpInput from "@/shared/components/forms/MCOtpInput";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { changeEmailSchema } from "@/schema/account.schema";
import { useTranslation } from "react-i18next"; // <-- Importa el hook
import { set } from "zod";

// Alias solo para otp
const otpSchema = changeEmailSchema.pick({ otp: true });

function VerifyNewEmailPage() {
  const { t } = useTranslation("common"); // <-- Usa el hook aquí
  const navigate = useNavigate();
  const sessionUser = useAppStore((state) => state.user);

  const changeEmailData = useProfileStore((state) => state.changeEmailData);
  const setChangeEmailData = useProfileStore(
    (state) => state.setChangeEmailData,
  );
  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );

  const setToast = useGlobalUIStore((state) => state.setToast);

  const otpData = useAppStore((state) => state.otp);

  // Redirige si no está en el contexto correcto o no tiene email pendiente
  useEffect(() => {
    if (
      VerificationContext !== "CHANGE_EMAIL" ||
      !changeEmailData?.newEmail ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [
    VerificationContext,
    changeEmailData,
    VerificationContextStatus,
    navigate,
  ]);

  const handleSubmit = (data: { otp: string }) => {
    setChangeEmailData({
      ...changeEmailData,
      otp: data.otp,
      newEmail: changeEmailData?.newEmail || "",
    });

    // Aquí deberías llamar a tu API para verificar el OTP

    setToast({
      message: `${changeEmailData?.otp} pero mandate`,
      type: "success",
      open: true,
    });
    navigate("/settings");
  };

  // Simulación de función para reenviar OTP
  const handleResendOtp = () => {
    // Aquí deberías llamar a tu API para reenviar el OTP
    alert("Código reenviado a " + changeEmailData?.otp);
  };

  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2">
            {t("verifyEmail.title", "Verifica tu nuevo correo")}
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            {t(
              "verifyEmail.instructions",
              "Ingresa el código de verificación que enviamos a",
            )}{" "}
            <b>{changeEmailData?.newEmail}</b>
          </p>
          <MCFormWrapper
            schema={otpSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              otp: changeEmailData?.otp || "",
            }}
            className="w-md mt-4 flex flex-col items-center gap-4 h-full"
          >
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
              <MCOtpInput />

              {changeEmailData?.otp && (
                <p className="text-center mt-2 w-full text-sm bg-red-400/10 rounded-md p-2">
                  OTP actual: {changeEmailData?.otp}
                </p>
              )}
            </div>
            <div className="w-full max-w-md m-4 flex flex-col items-center gap-4">
              <p className="text-md text-primary/80 mb-2 text-center">
                <span className="font-semibold text-primary">
                  {
                    t(
                      "verifyEmail.tip",
                      "¿No recibiste el código?:Revisa tu carpeta de spam o espera unos minutos.",
                    ).split(":")[0]
                  }
                  :
                </span>{" "}
                {
                  t(
                    "verifyEmail.tip",
                    "¿No recibiste el código?:Revisa tu carpeta de spam o espera unos minutos.",
                  ).split(":")[1]
                }
              </p>

              <MCButton variant="tercero" size="ml" onClick={handleResendOtp}>
                {t("verifyEmail.resend", "Reenviar código")}
              </MCButton>
            </div>
            <MCButton
              type="submit"
              className="w-xs"
              icon={<ArrowRight />}
              iconPosition="right"
            >
              {t("verifyEmail.verify", "Verificar")}
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default VerifyNewEmailPage;
