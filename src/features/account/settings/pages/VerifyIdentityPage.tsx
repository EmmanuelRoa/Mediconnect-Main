import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { useProfileStore } from "@/stores/useProfileStore";
import { verifyAccountSchema } from "@/schema/account.schema";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import MCButton from "@/shared/components/forms/MCButton";
import { ArrowRight } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile"; // <-- Importa el hook

const CONTEXT_ROUTES: Record<string, string> = {
  CHANGE_EMAIL: "/settings/change-email",
  CHANGE_PASSWORD: "/settings/change-password",
  DELETE_ACCOUNT: "/settings/delete-account",
};

function VerifyIdentityPage() {
  const isMobile = useIsMobile(); // <-- Usa el hook
  const navigate = useNavigate();

  const sessionUser = useAppStore((state) => state.user);
  const setVerifyAccountPassword = useProfileStore(
    (state) => state.setVerifyAccountPassword,
  );

  const setToast = useGlobalUIStore((state) => state.setToast);

  const verificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const setVerificationStatus = useGlobalUIStore(
    (state) => state.setVerificationContextStatus,
  );

  React.useEffect(() => {
    if (!verificationContext) {
      navigate("/settings");
    }
  }, [verificationContext, navigate]);

  const handleSubmitSuccess = (password: { password: string }) => {
    setToast({
      type: "success",
      message: "Identidad verificada sin implementar lógica real.",
      open: true,
    });
    setVerificationStatus("VERIFIED");
    setVerifyAccountPassword(password);
    if (verificationContext && CONTEXT_ROUTES[verificationContext]) {
      navigate(CONTEXT_ROUTES[verificationContext]);
    } else {
      navigate("/settings");
    }
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-2xl"}>
      <div
        className={`flex flex-col gap-6 items-center justify-center w-full mb-8 ${
          isMobile ? "px-4" : "px-0"
        }`}
      >
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${
            isMobile ? "min-w-0" : "min-w-xl"
          }`}
        >
          <h1
            className={`font-medium mb-2 text-center ${
              isMobile ? "text-3xl" : "text-5xl"
            }`}
          >
            Verificar tu identidad
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Por seguridad, necesitamos verificar que eres tú. Ingresa tu
            contraseña actual.
          </p>
          <MCFormWrapper
            schema={verifyAccountSchema}
            onSubmit={handleSubmitSuccess}
            defaultValues={{
              password: "",
            }}
            className={`mt-4 flex flex-col items-center gap-4 h-full ${
              isMobile ? "w-full" : "w-md"
            }`}
          >
            <MCInput
              label="Contraseña"
              type="password"
              name="password"
              placeholder={`Ingresa la contraseña de ${sessionUser?.name}`}
              className="w-full"
            />
            <MCButton
              type="submit"
              className={isMobile ? "w-full" : "w-xs"}
              icon={<ArrowRight size={isMobile ? 18 : 24} />}
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

export default VerifyIdentityPage;
