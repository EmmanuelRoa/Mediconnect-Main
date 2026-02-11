import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface ChangeStatusServiceModalProps {
  serviceId: string;
  action: "activate" | "deactivate" | "delete";
  children?: React.ReactNode;
  triggerClassName?: string;
  variant?: string;
  size?: string;
  onConfirm?: () => void;
  onSecondary?: () => void;
  confirmText?: string;
  secondaryText?: string;
}

function ChangeStatusServiceModal({
  serviceId,
  action,
  children,
  triggerClassName = "w-full flex-1",
  onConfirm,
  onSecondary,
  confirmText,
  secondaryText,
}: ChangeStatusServiceModalProps) {
  const { t } = useTranslation("doctor");
  const isMobile = useIsMobile();

  const getTitleKey = () => {
    switch (action) {
      case "activate":
        return "services.modals.activate.title";
      case "deactivate":
        return "services.modals.deactivate.title";
      case "delete":
        return "services.modals.delete.title";
      default:
        return "";
    }
  };

  const getMessageKey = () => {
    switch (action) {
      case "activate":
        return "services.modals.activate.message";
      case "deactivate":
        return "services.modals.deactivate.message";
      case "delete":
        return "services.modals.delete.message";
      default:
        return "";
    }
  };

  const getConfirmKey = () => {
    switch (action) {
      case "activate":
        return "services.modals.activate.confirm";
      case "deactivate":
        return "services.modals.deactivate.confirm";
      case "delete":
        return "services.modals.delete.confirm";
      default:
        return "";
    }
  };

  return (
    <MCModalBase
      id={`${action}-service-${serviceId}`}
      title={t(getTitleKey())}
      trigger={<span className={triggerClassName}>{children}</span>}
      onConfirm={onConfirm}
      onSecondary={onSecondary}
      confirmText={confirmText || t(getConfirmKey())}
      secondaryText={secondaryText || t("common.cancel")}
      variant={action === "activate" ? "decide" : "warning"}
      size="sm"
    >
      <div className="flex flex-col">
        <p
          className={`text-primary text-justify ${
            isMobile ? "text-sm" : "text-base"
          }`}
        >
          {t(getMessageKey())}
        </p>
      </div>
    </MCModalBase>
  );
}

export default ChangeStatusServiceModal;
