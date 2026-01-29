import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { changeEmailSchema } from "@/schema/account.schema";
import { useIsMobile } from "@/lib/hooks/useIsMobile"; // <-- Importa el hook

// Alias solo para otp
const newEmail = changeEmailSchema.pick({ newEmail: true });

function ChangeEmailPage() {
  const isMobile = useIsMobile(); // <-- Usa el hook
  const navigate = useNavigate();
  const sessionUser = useAppStore((state) => state.user);

  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );
  const setVerificationContext = useGlobalUIStore(
    (state) => state.setVerificationContext,
  );
  const changeEmailData = useProfileStore((state) => state.changeEmailData);
  const setChangeEmailData = useProfileStore(
    (state) => state.setChangeEmailData,
  );

  useEffect(() => {
    if (!sessionUser) {
      navigate("/settings");
    }
  }, [sessionUser, navigate]);

  useEffect(() => {
    if (
      VerificationContext !== "CHANGE_EMAIL" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  const handleSubmit = (data: { newEmail: string }) => {
    setChangeEmailData({
      ...changeEmailData,
      newEmail: data.newEmail,
      otp: changeEmailData?.otp ?? "",
    });
    navigate("/settings");
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div
        className={`flex flex-col gap-6 items-center justify-center w-full mb-8 ${isMobile ? "px-4" : "px-0"}`}
      >
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${isMobile ? "min-w-0" : "min-w-xl"}`}
        >
          <h1
            className={`font-medium mb-2 text-center ${isMobile ? "text-3xl" : "text-5xl"}`}
          >
            Cambiar correo electrónico
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Ingresa tu nueva dirección de correo. Te enviaremos un código de
            verificación.
          </p>
          <MCFormWrapper
            schema={newEmail}
            onSubmit={handleSubmit}
            defaultValues={{
              newEmail: changeEmailData?.newEmail || "",
            }}
            className={`mt-4 flex flex-col items-center gap-4 h-full ${isMobile ? "w-full" : "w-md"}`}
          >
            <MCInput
              label="Nuevo correo electrónico"
              name="newEmail"
              placeholder="Ingresa tu nuevo correo electrónico"
              className="w-full"
            />
            <MCButton
              type="submit"
              className={isMobile ? "w-full" : "w-xs"}
              icon={<ArrowRight />}
              iconPosition="right"
            >
              Cambiar correo
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangeEmailPage;
