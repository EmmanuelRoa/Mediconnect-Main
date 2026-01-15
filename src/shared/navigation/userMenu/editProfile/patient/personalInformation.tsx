import MCButton from "../../../../components/forms/MCButton";
import MCInput from "../../../../components/forms/MCInput";
import { useRef, useState } from "react";
import MCFormWrapper from "../../../../components/forms/MCFormWrapper";
import MCProfileImageUploader from "../../../../components/MCProfileImageUploader";
import { useProfileStore } from "@/stores/useProfileStore";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import { MCUserBanner } from "../../MCUserBanner";
import { Trash2 } from "lucide-react";

interface PersonalInformationProps {
  schema: any;
  onOpenChange: (open: boolean) => void;
}

type CropType = "banner" | "profile";

function PersonalInformation({
  schema,
  onOpenChange,
}: PersonalInformationProps) {
  const patientProfile = useProfileStore((s) => s.patientProfile);
  const setPatientProfile = useProfileStore((s) => s.setPatientProfile);

  // Estado local para cropper
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<CropType>("profile");
  const [tempImage, setTempImage] = useState<string>("");

  // Estado local para las imágenes
  const [bannerImage, setBannerImage] = useState<string>(
    patientProfile?.banner?.url || ""
  );
  const [profileImage, setProfileImage] = useState<string>(
    patientProfile?.avatar?.url || ""
  );

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: CropType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempImage(ev.target?.result as string);
        setCropType(type);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    if (cropType === "banner") {
      setBannerImage(croppedImage);
    } else {
      setProfileImage(croppedImage);
    }
    setCropModalOpen(false);
  };

  // Borrar imagen de perfil
  const handleRemoveProfileImage = () => {
    setProfileImage("");
  };

  // Borrar imagen de banner
  const handleRemoveBannerImage = () => {
    setBannerImage("");
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const handleSubmit = (data: any) => {
    if (data && patientProfile) {
      setPatientProfile({
        ...patientProfile,
        ...data,
        avatar: profileImage
          ? { url: profileImage, type: "image", name: "avatar" }
          : undefined,
        banner: bannerImage
          ? { url: bannerImage, type: "image", name: "banner" }
          : undefined,
      });
      onOpenChange(false);
    }
  };

  return (
    <>
      <MCProfileImageUploader
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={tempImage}
        aspectRatio={cropType === "banner" ? 3.5 : 1}
        isCircular={cropType === "profile"}
        onCropComplete={handleCropComplete}
        title={
          cropType === "banner" ? "Recortar banner" : "Recortar foto de perfil"
        }
      />

      <MCFormWrapper
        schema={schema}
        defaultValues={patientProfile || undefined}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Imagen de Banner */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Imagen de Banner</h3>
          <div className="relative w-full h-40 bg-accent/30 rounded-2xl overflow-hidden group">
            <label
              className="absolute inset-0 cursor-pointer"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MCUserBanner name={patientProfile?.fullName || "Sin nombre"} />
              )}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBannerImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                  e.target.value = "";
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold text-lg">
                  Cambiar imagen
                </span>
              </div>
            </label>
            {bannerImage && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                onClick={handleRemoveBannerImage}
                aria-label="Borrar banner"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Foto de perfil */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Foto de perfil</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 rounded-full bg-accent/30 overflow-hidden group">
              <label
                className="absolute inset-0 cursor-pointer"
                onClick={() => profileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MCUserAvatar
                    name={patientProfile?.fullName || "Sin nombre"}
                    size={128}
                    className="w-full h-full"
                  />
                )}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profile")}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white font-semibold text-sm">
                    Cambiar imagen
                  </span>
                </div>
              </label>
              {profileImage && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                  onClick={handleRemoveProfileImage}
                  aria-label="Borrar foto de perfil"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Recomendado: 400x400px, formato JPG o PNG
              </p>
            </div>
          </div>
        </div>

        {/* ...inputs restantes... */}
        <MCInput
          name="fullName"
          label="Nombre Completo"
          type="text"
          placeholder="Ingresa tu nombre completo"
        />

        <MCInput
          name="identityDocument"
          label="Cédula"
          type="text"
          placeholder="000-0000000-0"
        />

        <MCInput
          name="email"
          label="Email"
          type="email"
          placeholder="correo@ejemplo.com"
        />

        <MCInput name="age" label="Edad" type="number" placeholder="45" />

        <MCInput
          name="height"
          label="Altura (cm)"
          type="number"
          placeholder="175"
        />

        <MCInput
          name="weight"
          label="Peso (kg)"
          type="number"
          placeholder="80"
        />

        <MCInput
          name="bloodType"
          label="Tipo de Sangre"
          type="text"
          placeholder="O+"
        />

        <div className="flex gap-3 mt-4">
          <MCButton variant="primary" size="m" type="submit">
            Guardar cambios
          </MCButton>
          <MCButton
            variant="secondary"
            size="m"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </MCButton>
        </div>
      </MCFormWrapper>
    </>
  );
}

export default PersonalInformation;
