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

// Alias solo para otp
const newEmail = changeEmailSchema.pick({ newEmail: true });

function ChangeEmailPage() {
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

  // Redirige si no está en el contexto correcto o no está verificado
  useEffect(() => {
    if (
      VerificationContext !== "CHANGE_EMAIL" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  const hanbdleSubmit = (data: { newEmail: string }) => {
    setChangeEmailData({
      ...changeEmailData,
      newEmail: data.newEmail,
      otp: changeEmailData?.otp ?? "",
    });
    navigate("/settings/verify-email");
  };
  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2">
            Cambiar dirección de correo
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Ingresa tu nueva dirección de correo. Te enviaremos un código de
            verificación.
          </p>
          <MCFormWrapper
            schema={newEmail}
            onSubmit={hanbdleSubmit}
            defaultValues={{
              newEmail: changeEmailData?.newEmail || "",
            }}
            className=" w-md mt-4 flex flex-col items-center gap-4 h-full "
          >
            <MCInput
              label="Nuevo correo electrónico"
              name="newEmail"
              placeholder="Ingresa tu nuevo correo electrónico"
              className="w-full"
            />
            <MCButton
              type="submit"
              className="w-xs"
              icon={<ArrowRight />}
              iconPosition="right"
            >
              Verificar
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangeEmailPage;
