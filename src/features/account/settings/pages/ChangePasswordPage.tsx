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
import { changePasswordSchema } from "@/schema/account.schema";
import { useIsMobile } from "@/lib/hooks/useIsMobile"; // <-- Importa el hook

function ChangePasswordPage() {
  const isMobile = useIsMobile(); // <-- Usa el hook
  const navigate = useNavigate();
  const sessionUser = useAppStore((state) => state.user);

  const changePasswordData = useProfileStore(
    (state) => state.changePasswordData,
  );
  const setChangePasswordData = useProfileStore(
    (state) => state.setChangePasswordData,
  );

  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );
  useEffect(() => {
    if (!sessionUser) {
      navigate("/settings");
    }
  }, [sessionUser, navigate]);

  useEffect(() => {
    if (
      VerificationContext !== "CHANGE_PASSWORD" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  const handleSubmit = (data: {
    confirmNewPassword: string;
    newPassword: string;
  }) => {
    setChangePasswordData({
      ...changePasswordData,
      confirmNewPassword: data.confirmNewPassword,
      newPassword: data.newPassword,
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
            Cambiar contraseña
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Ingresa tu contraseña actual y la nueva contraseña que deseas
            establecer.
          </p>
          <MCFormWrapper
            schema={changePasswordSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              newPassword: changePasswordData?.newPassword || "",
              confirmNewPassword: changePasswordData?.confirmNewPassword || "",
            }}
            className={`mt-4 flex flex-col items-center gap-4 h-full ${isMobile ? "w-full" : "w-md"}`}
          >
            <MCInput
              label="Contraseña actual"
              name="newPassword"
              type="password"
              placeholder="Ingresa tu contraseña actual"
              className="w-full"
            />
            <MCInput
              label="Nueva contraseña"
              name="confirmNewPassword"
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              className="w-full"
            />
            <MCButton
              type="submit"
              className={isMobile ? "w-full" : "w-xs"}
              icon={<ArrowRight />}
              iconPosition="right"
            >
              Cambiar contraseña
            </MCButton>
          </MCFormWrapper>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ChangePasswordPage;
