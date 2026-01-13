import MCImageUpload from "@/shared/components/MCAuthImageUpload";
import centerDocImg from "@/assets/centerOnboarding/center.png";
import { useAppStore } from "@/stores/useAppStore";
import React from "react";

type HealthCertificateUploadProps = {
  children?: React.ReactNode;
};

export function HealthCertificateUpload({
  children,
  ...modalProps
}: HealthCertificateUploadProps) {
  const centerOnboardingData = useAppStore(
    (state) => state.centerOnboardingData
  );

  const setCenterOnboardingData = useAppStore(
    (state) => state.setCenterOnboardingData
  );

  const handleFileUpload = (fileUrl: string, fileType: string) => {
    if (!centerOnboardingData || !setCenterOnboardingData) return;

    setCenterOnboardingData({
      ...centerOnboardingData,
      healthCertificateFile: {
        url: fileUrl,
        type: fileType,
      },
    });
  };

  const handleFileRemove = () => {
    if (!centerOnboardingData || !setCenterOnboardingData) return;

    setCenterOnboardingData({
      ...centerOnboardingData,
      healthCertificateFile: undefined,
    });
  };

  return (
    <MCImageUpload
      title="Certificado de Salud"
      description="Sube una imagen clara y legible del certificado de salud del centro."
      imageSrc={centerDocImg}
      modalId="health-certificate"
      cropTitle="Recorta el certificado de salud"
      aspectRatio={1.6}
      isCircular={false}
      accept="image/*"
      onFileUpload={handleFileUpload}
      onFileRemove={handleFileRemove}
      uploadedFiles={
        centerOnboardingData?.healthCertificateFile
          ? [centerOnboardingData.healthCertificateFile]
          : []
      }
      {...modalProps}
    >
      {children}
    </MCImageUpload>
  );
}

export default HealthCertificateUpload;
