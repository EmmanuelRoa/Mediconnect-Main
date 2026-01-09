import type React from "react";
import { useEffect } from "react";
import MCButton from "@/shared/components/forms/MCButton";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/shared/ui/morphing-dialog";

interface MCModalBaseProps {
  id: string;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  triggerClassName?: string;
  title?: string;
  size?: "small" | "medium" | "large" | "full";
  className?: string;
  variant?: "warning" | "confirm" | "decide" | "info";
  onConfirm?: () => void;
  onSecondary?: () => void;
  confirmText?: string;
  secondaryText?: string;
  typeclose?: "Arrow" | "Cross";
  zIndex?: number;
}

export function MCModalBase({
  trigger,
  isOpen,
  onClose,
  children,
  title,
  typeclose = "Cross",
  triggerClassName,
  size = "medium",
  className = "",
  variant = "info",
  onConfirm,
  onSecondary,
  confirmText = "Confirmar",
  secondaryText = "Cancelar",
  zIndex = 50,
}: MCModalBaseProps) {
  const isControlled = isOpen !== undefined;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isControlled || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isControlled, isOpen, onClose]);

  // Clases de tamaño adaptativas para móvil y desktop
  const sizeClasses = {
    small: isMobile
      ? "w-full max-w-[95vw] mx-2 max-h-[70vh]"
      : "max-w-md max-h-[60vh] w-full",
    medium: isMobile
      ? "w-full max-w-[95vw] mx-2 max-h-[80vh]"
      : "max-w-lg max-h-[70vh] w-full",
    large: isMobile
      ? "w-full max-w-[95vw] mx-2 max-h-[90vh]"
      : "max-w-2xl max-h-[85vh] w-full",
    full: isMobile
      ? "w-full max-w-[100vw] mx-0 max-h-[95vh]"
      : "max-w-6xl max-h-[95vh] w-full mx-4",
  };

  // Espaciado adaptativo para móvil
  const paddingClasses = isMobile ? "p-3" : "p-4";
  const headerPadding = isMobile ? "px-4 pt-4 pb-3" : "px-6 pt-4 pb-3";
  const contentPadding = isMobile ? "px-4 py-2" : "px-6 py-2";
  const footerPadding = isMobile ? "px-4 pb-4 pt-3" : "px-6 pb-4 pt-3";

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  if (isControlled && !isOpen) return null;

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      {trigger && (
        <MorphingDialogTrigger className={triggerClassName}>
          {trigger}
        </MorphingDialogTrigger>
      )}
      <MorphingDialogContainer className={paddingClasses} zIndex={zIndex}>
        <MorphingDialogContent
          className={`bg-white rounded-3xl shadow-lg ${sizeClasses[size]} ${className} flex flex-col`}
        >
          {/* Header */}
          {(title || typeclose) && (
            <div
              className={`flex justify-between items-center ${headerPadding} flex-shrink-0 `}
            >
              {title && (
                <MorphingDialogTitle>
                  <h2
                    className={`font-semibold text-primary ${
                      isMobile ? "text-lg" : "text-xl"
                    }`}
                  >
                    {title}
                  </h2>
                </MorphingDialogTitle>
              )}
              <MorphingDialogClose
                typeclose={typeclose}
                className="text-primary flex-shrink-0"
              />
            </div>
          )}

          {/* Content (scrollable) */}
          <MorphingDialogDescription
            className={`${contentPadding} flex-1 min-h-0 overflow-y-auto`}
          >
            <div className="min-h-0">{children}</div>
          </MorphingDialogDescription>

          {/* Footer por variante (fijo) */}
          {variant === "warning" && (
            <div
              className={`flex gap-2 justify-end ${footerPadding} flex-shrink-0  ${
                isMobile ? "flex-col-reverse" : ""
              }`}
            >
              <MorphingDialogClose>
                <MCButton
                  variant="secondary"
                  size={isMobile ? "l" : "m"}
                  onClick={onSecondary}
                  className={isMobile ? "w-full" : ""}
                >
                  {secondaryText}
                </MCButton>
              </MorphingDialogClose>
              <MCButton
                variant="delete"
                size={isMobile ? "l" : "m"}
                onClick={handleConfirm}
                className={isMobile ? "w-full" : ""}
              >
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "confirm" && (
            <div
              className={`flex justify-end ${footerPadding} flex-shrink-0  `}
            >
              <MCButton
                variant="primary"
                size={isMobile ? "l" : "m"}
                onClick={handleConfirm}
                className={isMobile ? "w-full" : ""}
              >
                {confirmText}
              </MCButton>
            </div>
          )}

          {variant === "decide" && (
            <div
              className={`flex gap-2 justify-end ${footerPadding} flex-shrink-0  ${
                isMobile ? "flex-col-reverse" : ""
              }`}
            >
              <MorphingDialogClose>
                <MCButton
                  variant="secondary"
                  size={isMobile ? "l" : "m"}
                  onClick={onSecondary}
                  className={isMobile ? "w-full" : ""}
                >
                  {secondaryText}
                </MCButton>
              </MorphingDialogClose>
              <MCButton
                variant="primary"
                size={isMobile ? "l" : "m"}
                onClick={handleConfirm}
                className={isMobile ? "w-full" : ""}
              >
                {confirmText}
              </MCButton>
            </div>
          )}
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
