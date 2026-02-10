import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { Ellipsis } from "lucide-react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/router/routes";
import { useNavigate } from "react-router-dom";
import ChangeStatusServiceModal from "./ChangeStatusServiceModal";

interface ServicesActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDeactivate?: () => void;
  onActivate?: () => void;
  onDelete?: () => void;
  status?: "active" | "inactive";
  isCard?: boolean;
  serviceId?: string; // <-- nuevo prop
}

const ServicesActions: React.FC<ServicesActionsProps> = ({
  onView,
  onEdit,
  onDeactivate,
  onActivate,
  onDelete,
  status = "active",
  isCard = false,
  serviceId, // <-- nuevo prop
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Estado para el modal
  const [modalAction, setModalAction] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);

  () => setModalAction("delete");

  // Confirmar acción
  const handleConfirm = () => {
    if (modalAction === "deactivate" && onDeactivate) onDeactivate();
    if (modalAction === "activate" && onActivate) onActivate();
    if (modalAction === "delete" && onDelete) onDelete();
    setModalAction(null);
  };

  // Cancelar modal
  const handleSecondary = () => setModalAction(null);

  const handleView = () => {
    if (onView) {
      onView();
    } else if (serviceId) {
      navigate(`${ROUTES.COMMON.SERVICE}/${serviceId}`);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {isCard ? (
            <button
              className={`
                z-30 rounded-full border-none border-white/60
                bg-black/20 backdrop-blur-xl shadow-2xl
                transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,2.2)]
                pointer-events-auto
                ${isMobile ? "p-1" : "p-1.5"}
              `}
              type="button"
            >
              <Ellipsis className="text-white" size={isMobile ? 18 : 20} />
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="bg-bg-btn-secondary rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20 group"
            >
              <Ellipsis className="h-4 w-4 text-primary group-hover:text-primary/80 group-active:text-primary/60" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          isTablet
          className={`
            p-1 flex flex-col gap-0.5 z-40 rounded-xl 
            border border-primary/10 shadow-lg
            ${isMobile ? "min-w-[140px] text-xs" : "min-w-[150px] text-sm"}
          `}
          align="end"
          sideOffset={5}
        >
          <div className="flex flex-col items-center">
            <button
              className={`
                text-left text-center rounded-lg hover:bg-accent transition
                dark:hover:text-background
                ${isMobile ? "px-2 py-1" : "px-2.5 py-1.5"}
              `}
              type="button"
              onClick={handleView}
            >
              Ver servicio
            </button>
            <button
              className={`
                text-left text-center rounded-lg hover:bg-accent transition
                dark:hover:text-background
                ${isMobile ? "px-2 py-1" : "px-2.5 py-1.5"}
              `}
              type="button"
              onClick={onEdit}
            >
              Editar servicio
            </button>
            {status === "active" ? (
              <ChangeStatusServiceModal
                serviceId={serviceId || ""}
                action="deactivate"
                onConfirm={handleConfirm}
                onSecondary={handleSecondary}
              >
                <button
                  className={`
                    text-left text-center rounded-lg hover:bg-accent transition
                    dark:hover:text-background
                    ${isMobile ? "px-2 py-1" : "px-2.5 py-1.5"}
                  `}
                  type="button"
                >
                  Desactivar servicio
                </button>
              </ChangeStatusServiceModal>
            ) : (
              <ChangeStatusServiceModal
                serviceId={serviceId || ""}
                action="activate"
                onConfirm={handleConfirm}
                onSecondary={handleSecondary}
              >
                <button
                  className={`
                    text-left text-center rounded-lg hover:bg-accent transition
                    dark:hover:text-background
                    ${isMobile ? "px-2 py-1" : "px-2.5 py-1.5"}
                  `}
                  type="button"
                >
                  Activar servicio
                </button>
              </ChangeStatusServiceModal>
            )}
            <ChangeStatusServiceModal
              serviceId={serviceId || ""}
              action="delete"
              onConfirm={handleConfirm}
              onSecondary={handleSecondary}
            >
              <button
                className={`
                  text-left text-center rounded-lg hover:bg-destructive/10 
                  text-destructive transition
                  ${isMobile ? "px-2 py-1" : "px-2.5 py-1.5"}
                `}
                type="button"
              >
                Eliminar servicio
              </button>
            </ChangeStatusServiceModal>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ServicesActions;
