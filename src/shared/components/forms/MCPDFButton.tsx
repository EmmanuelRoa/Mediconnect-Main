import React from "react";
import { Button } from "@/shared/ui/button";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils"; // Asegúrate de importar cn

interface MCPDFButtonProps {
  onClick?: () => void;
  loading?: boolean;
  className?: string; // Permite pasar clases extra si lo necesitas
}

function MCPDFButton({ onClick, loading, className }: MCPDFButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
      variant="outline"
      className={cn(
        "flex w-full items-center text-primary px-4 py-3.5 text-base sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-5 lg:py-5 lg:text-md rounded-4xl border-primary/20 bg-bg-btn-secondary",
        "gap-2",
        "hover:bg-bg-btn-secondary/20 hover:text-primary",
        "active:bg-bg-btn-secondary/30 active:text-primary",
        "active:scale-95", // <-- efecto de escala al hacer click
        "transition-colors duration-150",
        className,
      )}
    >
      <FileText className="w-4 h-4" />
      <span>{loading ? "Generando PDF..." : "Generar PDF"}</span>
    </Button>
  );
}

export default MCPDFButton;
