import { MCModalBase } from "@/shared/components/MCModalBase";

interface DurationModalProps {
  children?: React.ReactNode;
}

function DurationModal({ children }: DurationModalProps) {
  return (
    <MCModalBase
      id="duration-modal"
      title="Duración de la sesión"
      trigger={children}
      variant="decide"
      confirmText="Guardar"
      secondaryText="Cancelar"
    >
      holi
    </MCModalBase>
  );
}

export default DurationModal;
