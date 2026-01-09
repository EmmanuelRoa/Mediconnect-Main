import { useEffect, useRef } from "react";

interface UseNestedModalProps {
  isOpen: boolean;
  zIndex: number;
  onClose?: () => void;
}

export function useNestedModal({
  isOpen,
  zIndex,
  onClose,
}: UseNestedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Verificar si este modal es el más alto en la jerarquía
        const allModals = document.querySelectorAll("[data-modal-z-index]");
        let highestZIndex = 0;

        allModals.forEach((modal) => {
          const zIndexValue = parseInt(
            modal.getAttribute("data-modal-z-index") || "0"
          );
          if (zIndexValue > highestZIndex) {
            highestZIndex = zIndexValue;
          }
        });

        // Solo cerrar si este es el modal con mayor z-index
        if (zIndex >= highestZIndex) {
          event.stopPropagation();
          onClose?.();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;

      const target = event.target as Node;

      // Verificar si el click fue dentro de este contenedor
      if (modalRef.current?.contains(target)) {
        return;
      }

      // Verificar si hay modales con mayor z-index abiertos
      const allModals = document.querySelectorAll("[data-modal-z-index]");
      let hasHigherModal = false;

      allModals.forEach((modal) => {
        const zIndexValue = parseInt(
          modal.getAttribute("data-modal-z-index") || "0"
        );
        if (zIndexValue > zIndex) {
          hasHigherModal = true;
        }
      });

      // Solo cerrar si no hay modales con mayor z-index
      if (!hasHigherModal) {
        onClose?.();
      }
    };

    // Usar setTimeout para evitar que el click que abre el modal lo cierre inmediatamente
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, zIndex, onClose]);

  return { modalRef };
}
