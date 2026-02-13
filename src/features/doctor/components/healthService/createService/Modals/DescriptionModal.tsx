import { MCModalBase } from "@/shared/components/MCModalBase";

interface DescriptionModalProps {
  children?: React.ReactNode;
}

function DescriptionModal({ children }: DescriptionModalProps) {
  return (
    <MCModalBase
      id="description-modal"
      title="Descripción del servicio"
      trigger={children}
      variant="decide"
      confirmText="Guardar"
      secondaryText="Cancelar"
      triggerClassName="w-full"
      size="mdAuto"
    >
      holi
    </MCModalBase>
  );
}

export default DescriptionModal;
