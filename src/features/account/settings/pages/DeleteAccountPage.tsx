import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile"; // <-- Importa el hook

function DeleteAccountPage() {
  const isMobile = useIsMobile(); // <-- Usa el hook
  const navigate = useNavigate();
  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );

  useEffect(() => {
    if (
      VerificationContext !== "DELETE_ACCOUNT" ||
      VerificationContextStatus !== "VERIFIED"
    ) {
      navigate("/settings");
    }
  }, [VerificationContext, VerificationContextStatus, navigate]);

  const handleSubmit = () => {
    // Aquí deberías llamar a tu API para eliminar la cuenta
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
            className={`font-medium mb-2 text-center text-destructive ${isMobile ? "text-3xl" : "text-5xl"}`}
          >
            Eliminar cuenta
          </h1>
          <p className="text-base max-w-md text-center text-muted-foreground">
            Esta acción eliminará tu cuenta de MediConnect de forma permanente.
            Una vez confirmada, no podrás recuperarla ni acceder a tu
            información nuevamente.
          </p>
          <div className="bg-destructive/10 border border-destructive rounded-3xl p-4 my-2 max-w-md text-sm text-destructive">
            <b>¿Qué sucederá?</b>
            <ul className="list-disc ml-5 mt-2">
              <li>
                Tu perfil y todos tus datos personales serán eliminados del
                sistema.
              </li>
              <li>No podrás iniciar sesión ni recuperar tu cuenta.</li>
              <li>
                Se cancelarán todas tus citas y conexiones con médicos o centros
                de salud.
              </li>
              <li>
                Los mensajes y registros asociados se eliminarán de manera
                irreversible, siguiendo las políticas de privacidad de
                MediConnect.
              </li>
            </ul>
          </div>
          <div
            className={`flex gap-4 mt-6 ${isMobile ? "flex-col w-full" : ""}`}
          >
            <MCButton
              type="button"
              variant="outline"
              className={isMobile ? "w-full" : ""}
              onClick={() => navigate("/settings")}
            >
              Cancelar
            </MCButton>
            <MCButton
              type="submit"
              variant="delete"
              className={isMobile ? "w-full" : ""}
              onClick={handleSubmit}
            >
              Eliminar Cuenta
            </MCButton>
          </div>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default DeleteAccountPage;
