import MCImageUpload from "@/shared/components/MCAuthImageUpload";
import centerImg from "@/assets/centerOnboarding/centerpfp.png";
import { useAppStore } from "@/stores/useAppStore";
import React from "react";

type ProfilePhotoUploadProps = {
  children?: React.ReactNode;
};

export function ProfilePhotoUpload({
  children,
  ...modalProps
}: ProfilePhotoUploadProps) {
  const centerOnboardingData = useAppStore(
    (state) => state.centerOnboardingData
  );

  const setCenterOnboardingData = useAppStore(
    (state) => state.setCenterOnboardingData
  );

  const handleFileUpload = (fileUrl: string) => {
    if (!centerOnboardingData || !setCenterOnboardingData) return;

    setCenterOnboardingData({
      ...centerOnboardingData,
      urlImg: {
        url: fileUrl,
        type: "image",
        name: "Foto de perfil",
      },
    });
  };

  const handleFileRemove = () => {
    if (!centerOnboardingData || !setCenterOnboardingData) return;

    setCenterOnboardingData({
      ...centerOnboardingData,
      urlImg: undefined,
    });
  };

  return (
    <MCImageUpload
      title="Foto de perfil"
      description="Sube una foto clara y profesional para el perfil del centro."
      imageSrc={centerImg}
      modalId="center-profile-photo"
      cropTitle="Recorta la foto de perfil del centro"
      aspectRatio={1}
      isCircular={true}
      accept="image/*"
      onFileUpload={handleFileUpload}
      onFileRemove={handleFileRemove}
      uploadedFiles={
        centerOnboardingData?.urlImg
          ? [
              {
                url: centerOnboardingData.urlImg.url,
                type: centerOnboardingData.urlImg.type,
                name: centerOnboardingData.urlImg.name,
              },
            ]
          : []
      }
      {...modalProps}
    >
      {children}
    </MCImageUpload>
  );
}

export default ProfilePhotoUpload;
