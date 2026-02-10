import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <MCModalBase
      id="delete"
      title={
        action === "activate"
          ? "Activar Servicio"
          : action === "deactivate"
            ? "Desactivar Servicio"
            : "Eliminar Servicio"
      }
      trigger={<span className={triggerClassName}>{children}</span>}
      onConfirm={onConfirm}
      onSecondary={onSecondary}
      variant={action === "activate" ? "decide" : "warning"}
      size="sm"
    >
      <div className="flex flex-col">
        {action === "activate" && (
          <p className="text-primary text-justify">
            ¿Estás seguro que quieres activar el servicio?
          </p>
        )}
        {action === "deactivate" && (
          <p className="text-primary text-justify">
            ¿Estás seguro que quieres desactivar el servicio?
          </p>
        )}
        {action === "delete" && (
          <p className="text-primary text-justify">
            ¿Estás seguro que quieres eliminar el servicio?
          </p>
        )}
      </div>
    </MCModalBase>
  );
}

export default ChangeStatusServiceModal;
