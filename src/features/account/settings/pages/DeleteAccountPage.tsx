import React, { useEffect } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCButton from "@/shared/components/forms/MCButton";
import { useNavigate } from "react-router-dom";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

function DeleteAccountPage() {
  const navigate = useNavigate();
  const VerificationContext = useGlobalUIStore(
    (state) => state.verificationContext,
  );
  const VerificationContextStatus = useGlobalUIStore(
    (state) => state.verificationContextStatus,
  );

  // Redirige si no está en el contexto correcto
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
    // Redirigir o mostrar confirmación
  };

  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2 text-destructive">
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
          <div className="flex gap-4 mt-6">
            <MCButton
              type="button"
              variant="outline"
              onClick={() => navigate("/settings")}
            >
              Cancelar
            </MCButton>
            <MCButton type="submit" variant="delete" onClick={handleSubmit}>
              Eliminar Cuenta
            </MCButton>
          </div>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default DeleteAccountPage;
