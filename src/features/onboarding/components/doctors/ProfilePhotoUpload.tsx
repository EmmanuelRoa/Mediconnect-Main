import MCImageUpload from "@/shared/components/MCAuthImageUpload";
import documentImg from "@/assets/doctorOnbording/profile-picture.png";
import { useAppStore } from "@/stores/useAppStore";

type ProfilePhotoUploadProps = {
  children?: React.ReactNode;
};

export function ProfilePhotoUploadTrigger({
  children,
  ...modalProps
}: ProfilePhotoUploadProps) {
  const doctorOnboardingData = useAppStore(
    (state) => state.doctorOnboardingData
  );

  const setDoctorOnboardingData = useAppStore(
    (state) => state.setDoctorOnboardingData
  );

  const handleFileUpload = (fileUrl: string) => {
    if (!doctorOnboardingData || !setDoctorOnboardingData) return;

    setDoctorOnboardingData({
      ...doctorOnboardingData,
      urlImg: {
        url: fileUrl,
        type: "image",
        name: "Foto de perfil",
      },
    });
  };

  const handleFileRemove = () => {
    if (!doctorOnboardingData || !setDoctorOnboardingData) return;

    setDoctorOnboardingData({
      ...doctorOnboardingData,
      urlImg: undefined,
    });
  };

  return (
    <MCImageUpload
      title="Foto de perfil"
      description="Sube una foto clara y profesional para tu perfil."
      imageSrc={documentImg}
      modalId="profile-photo"
      cropTitle="Recorta tu foto de perfil"
      aspectRatio={1}
      isCircular={true}
      accept="image/*"
      onFileUpload={handleFileUpload}
      onFileRemove={handleFileRemove}
      uploadedFiles={
        doctorOnboardingData?.urlImg
          ? [
              {
                url: doctorOnboardingData.urlImg.url,
                type: doctorOnboardingData.urlImg.type,
                name: doctorOnboardingData.urlImg.name,
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

export default ProfilePhotoUploadTrigger;
