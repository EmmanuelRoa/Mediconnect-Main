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

function ChangePasswordPage() {
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
  // Redirige si el usuario no está autenticado
  useEffect(() => {
    if (!sessionUser) {
      navigate("/settings");
    }
  }, [sessionUser, navigate]);

  // Redirige si no está en el contexto correcto o no tiene datos pendientes
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
    // Aquí deberías llamar a tu API para cambiar la contraseña
    navigate("/settings");
  };

  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2">Cambiar contraseña</h1>
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
            className="w-md mt-4 flex flex-col items-center gap-4 h-full"
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
              className="w-xs"
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
