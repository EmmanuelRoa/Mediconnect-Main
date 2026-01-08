import { useEffect } from "react";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "@/features/auth/components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import { useNavigate } from "react-router-dom";

function DoctorOnboardingPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  return (
    <AuthContentContainer
      title="Documentos y datos requeridos para registro de doctores en MediConnect"
      subtitle="Por favor, asegúrate de tener los siguientes documentos e información a mano para completar tu registro como doctor en MediConnect:"
      titleAndSubtitleStart={false}
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <p>hola</p>
      </div>
    </AuthContentContainer>
  );
}

export default DoctorOnboardingPage;
