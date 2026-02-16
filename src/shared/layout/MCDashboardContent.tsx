import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import MCBackButton from "@/shared/components/forms/MCBackButton";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { MCModalBase } from "../components/MCModalBase";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import { useCallback, useRef } from "react";

interface Props {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  disabledBackButton?: boolean;
  mainWidth?: string;
  mainClassName?: string;
  noBg?: boolean;
  isTele?: boolean;
  create?: boolean;
  abandonarTrigger?: React.ReactNode; // <-- Nueva prop para pasar el trigger del modal
}

const MCDashboardContent: React.FC<Props> = ({
  children,
  showBackButton = true,
  onBack,
  disabledBackButton,
  mainWidth = "max-w-2xl",
  mainClassName = "",
  noBg = false,
  isTele = false,
  create = false,
  abandonarTrigger, // <-- Recibir el trigger
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createServiceData = useCreateServicesStore((s) => s.createServiceData);

  // Referencia para abrir el modal desde el trigger
  const modalRef = useRef<{ open: () => void }>(null);

  // Función para verificar si hay datos sin guardar
  const hasUnsavedData = useCallback(() => {
    return (
      createServiceData?.name !== "" ||
      createServiceData?.specialty !== "" ||
      createServiceData?.description !== "" ||
      (createServiceData?.images && createServiceData.images.length > 0) ||
      createServiceData?.comercial_schedule !== null ||
      createServiceData?.location !== undefined
    );
  }, [createServiceData]);

  // Trigger personalizado
  const abandonarButton = (
    <div
      role="button"
      tabIndex={0}
      className="group flex items-center gap-2 text-primary transition-all duration-150 hover:opacity-80 active:scale-95 cursor-pointer"
      style={{ background: "none", border: "none" }}
      onClick={() => {
        if (hasUnsavedData()) {
          modalRef.current?.open();
        } else {
          navigate(-1);
        }
      }}
    >
      <ArrowLeft
        className="transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-110"
        size={20}
      />
      <span className="font-medium text-lg">{t("Abandonar")}</span>
    </div>
  );

  return (
    <div
      className={`${noBg ? "bg-transparent" : "bg-background"} min-h-screen flex gap-4 rounded-4xl ${isMobile ? "py-4 px-4" : "py-10 px-4"}`}
    >
      <div
        className={`w-full ${
          isMobile
            ? "flex flex-col"
            : isTele
              ? "grid grid-cols-[0.5fr_9fr_0.5fr]"
              : "grid grid-cols-[1fr_8fr_1fr]"
        } justify-items-center `}
      >
        <aside className={isMobile ? "w-full mb-4" : ""}>
          {create
            ? abandonarTrigger || (
                <LeaveCreateService trigger={abandonarButton} />
              )
            : showBackButton && (
                <MCBackButton
                  onClick={onBack || (() => navigate(-1))}
                  disabled={disabledBackButton}
                  variant={noBg ? "background" : "default"}
                />
              )}
        </aside>
        <motion.main
          {...fadeInUp}
          className={`${isMobile ? "w-full" : mainWidth} flex flex-col gap-4 ${mainClassName}`}
        >
          {children}
        </motion.main>
        {!isMobile && <div />}
      </div>
    </div>
  );
};

export default MCDashboardContent;

interface LeaveCreateServiceProps {
  trigger: React.ReactNode;
}

const LeaveCreateService = React.forwardRef(function LeaveCreateService({
  trigger,
}: LeaveCreateServiceProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clearComercialScheduleData } = useCreateServicesStore();

  const handleConfirmLeave = () => {
    console.log("sallll mmg");

    clearComercialScheduleData();
    navigate("/doctor/services");
  };

  return (
    <MCModalBase
      id="leave-create-service"
      trigger={trigger}
      title={t("Abandonar creación")}
      description={t(
        "¿Estás seguro de que quieres abandonar la creación del servicio? Se perderán los cambios no guardados.",
      )}
      variant="warning"
      onConfirm={handleConfirmLeave}
      confirmText={t("Sí, abandonar")}
      secondaryText={t("No, continuar editando")}
      size="smWide"
    >
      <></>
    </MCModalBase>
  );
});
