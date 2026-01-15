import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { X, User, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import MCButton from "../../../components/forms/MCButton";
import MCInput from "../../../components/forms/MCInput";
import { useState, useRef } from "react";
import MCFormWrapper from "../../../components/forms/MCFormWrapper";
import { profileSchema } from "@/schema/UserSchema";
import MCProfileImageUploader from "../../../components/MCProfileImageUploader";

interface MCSheetPatientProps {
  onOpenChange: (open: boolean) => void;
}

type CropType = "banner" | "profile";

function MCSheetPatient({ onOpenChange }: MCSheetPatientProps) {
  const [formData, setFormData] = useState({
    nombre: "Ilia Topuria",
    cedula: "000-0000000-0",
    email: "Ilia.Topuria@gmail.com",
    edad: "45",
    altura: "175",
    peso: "80",
    tipoSangre: "O+",
  });

  const [banner, setBanner] = useState<string>(
    "https://i.pinimg.com/736x/3b/37/46/3b3746e0878804293202d56d1dda1fe1.jpg"
  );
  const [profile, setProfile] = useState<string>(
    "https://i.pinimg.com/736x/ee/27/85/ee278567d7a890bb390e5a99a4df4936.jpg"
  );

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<CropType>("profile");
  const [tempImage, setTempImage] = useState<string>("");

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    if (cropType === "banner") setBanner(croppedImage);
    else setProfile(croppedImage);
  };

  const handleSubmit = () => {
    console.log("Datos guardados:", formData);
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

      <Tabs
        defaultValue="general"
        className="w-full h-full grid grid-cols-[35%_65%] min-h-full min-w-full"
      >
        <aside className="w-full h-full rounded-l-4xl bg-accent/30 border-r-3 border-accent py-6 m-0 flex flex-col gap-4">
          <div className="w-full px-10 mt-6 flex flex-col gap-2">
            <h1 className="text-xl font-medium">Editar Perfil</h1>
            <p className="text-base max-w-50 text-left">
              Modifica tu información profesional
            </p>
          </div>

          <TabsList className="flex flex-col gap-2 w-full justify-center items-center px-6 h-fit">
            <TabsTrigger
              value="general"
              className="text-md rounded-full w-full"
            >
              <div className="flex items-center gap-2 p-2 rounded-full">
                <User className="h-6 w-6 stroke-2" />
                <span className="text-sm font-medium">Información General</span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="historial"
              className="text-md rounded-full w-full"
            >
              <div className="flex items-center gap-2 p-2 rounded-full">
                <FileText className="h-6 w-6 stroke-2" />
                <span className="text-sm font-medium">Historial Clínico</span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="seguros"
              className="text-md rounded-full w-full"
            >
              <div className="flex items-center gap-2 p-2 rounded-full">
                <Shield className="h-6 w-6 stroke-2" />
                <span className="text-sm font-medium">Seguros</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </aside>

        <main className="w-full h-full overflow-y-auto">
          <div className="flex items-center justify-end p-2">
            <button
              className="rounded-full h-8 w-8 flex items-center border-none outline-none ring-none justify-center hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
              aria-label="Cerrar"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <TabsContent value="general" className="px-10 py-6">
            <div className="flex items-center border-b-2 border-border mb-6">
              <h2 className="text-2xl font-medium pb-2">Información General</h2>
            </div>

            <MCFormWrapper
              schema={profileSchema}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* Imagen de Banner */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Imagen de Banner</h3>
                <label
                  className="relative w-full h-40 bg-accent/30 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <img
                    src={banner}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "banner")}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-semibold text-lg">
                      Cambiar imagen
                    </span>
                  </div>
                </label>
              </div>

              {/* Foto de perfil */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Foto de perfil</h3>
                <div className="flex items-center gap-4">
                  <label
                    className="relative w-32 h-32 rounded-full bg-accent/30 overflow-hidden cursor-pointer group"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <img
                      src={profile}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
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
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Recomendado: 400x400px, formato JPG o PNG
                    </p>
                  </div>
                </div>
              </div>

              <MCInput
                name="nombre"
                label="Nombre Completo"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
              />

              <MCInput
                name="cedula"
                label="Cédula"
                type="text"
                placeholder="000-0000000-0"
                value={formData.cedula}
                onChange={(e) => handleInputChange("cedula", e.target.value)}
              />

              <MCInput
                name="email"
                label="Email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <MCInput
                name="edad"
                label="Edad"
                type="number"
                placeholder="45"
                value={formData.edad}
                onChange={(e) => handleInputChange("edad", e.target.value)}
              />

              <MCInput
                name="altura"
                label="Altura (cm)"
                type="number"
                placeholder="175"
                value={formData.altura}
                onChange={(e) => handleInputChange("altura", e.target.value)}
              />

              <MCInput
                name="peso"
                label="Peso (kg)"
                type="number"
                placeholder="80"
                value={formData.peso}
                onChange={(e) => handleInputChange("peso", e.target.value)}
              />

              <MCInput
                name="tipoSangre"
                label="Tipo de Sangre"
                type="text"
                placeholder="O+"
                value={formData.tipoSangre}
                onChange={(e) =>
                  handleInputChange("tipoSangre", e.target.value)
                }
              />

              <div className="flex gap-3 mt-4">
                <MCButton variant="primary" size="m" onClick={handleSubmit}>
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
          </TabsContent>

          <TabsContent value="historial" className="px-10 py-6">
            <div className="flex items-center border-b-2 border-border mb-6">
              <h2 className="text-2xl font-medium pb-2">Historial Clínico</h2>
            </div>
            <p>Contenido del historial clínico...</p>
          </TabsContent>

          <TabsContent value="seguros" className="px-10 py-6">
            <div className="flex items-center border-b-2 border-border mb-6">
              <h2 className="text-2xl font-medium pb-2">Seguros</h2>
            </div>
            <p>Contenido de seguros...</p>
          </TabsContent>
        </main>
      </Tabs>
    </>
  );
}

export default MCSheetPatient;
