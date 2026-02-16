import { Plus, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCreateServicesStore } from "@/stores/useCreateServicesStore";
import ServicesLayoutsSteps from "./ServicesLayoutsSteps";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import { useTranslation } from "react-i18next";

const MIN_IMAGES = 1;
const MAX_IMAGES = 8;

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
}

function ServiceImagesStep() {
  const { t } = useTranslation("doctor");
  const setCreateServiceField = useCreateServicesStore(
    (state) => state.setCreateServiceField,
  );
  const storeImages = useCreateServicesStore(
    (state) => state.createServiceData.images,
  );
  const goToNextStep = useCreateServicesStore((s) => s.goToNextStep);
  const goToPreviousStep = useCreateServicesStore((s) => s.goToPreviousStep);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con el store cuando cambia
  useEffect(() => {
    if (storeImages && storeImages.length > 0) {
      setImages(
        storeImages.map((img: any) => ({
          id: img.id || crypto.randomUUID(),
          url: img.url,
          file: img.file,
        })),
      );
    }
  }, [storeImages]);

  // Limpiar URLs solo de archivos nuevos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const available = MAX_IMAGES - images.length;
    if (available <= 0) return;

    const newImages: UploadedImage[] = Array.from(files)
      .slice(0, available)
      .map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      setCreateServiceField(
        "images",
        updated.map((img) => ({
          id: img.id,
          url: img.url,
          file: img.file,
        })),
      );
      return updated;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.file) {
        URL.revokeObjectURL(img.url);
      }
      const updated = prev.filter((i) => i.id !== id);
      setCreateServiceField(
        "images",
        updated.map((img) => ({
          id: img.id,
          url: img.url,
          file: img.file,
        })),
      );
      return updated;
    });
  };

  const remaining = Math.max(0, MIN_IMAGES - images.length);

  return (
    <ServicesLayoutsSteps
      title={t("Muestra tus servicios y experiencia")}
      description={t(
        "Agrega al menos 1 foto que represente tus habilidades médicas.",
      )}
    >
      {/* Counter */}
      {images.length > 0 && (
        <p className="mt-6 text-sm text-muted-foreground text-center">
          {remaining > 0
            ? `${remaining} de ${MIN_IMAGES} imágenes mínimas`
            : `${images.length} de ${MAX_IMAGES} imágenes agregadas`}
        </p>
      )}

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-44 w-44 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
          >
            <Plus className="h-8 w-8 text-muted-foreground/60" />
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 content-start">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg"
            >
              <img
                src={img.url}
                alt={`Imagen ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/60 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[4/5] items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
            >
              <Plus className="h-8 w-8 text-muted-foreground/60" />
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <AuthFooterContainer
        continueButtonProps={{
          disabled: images.length < MIN_IMAGES,
          onClick: () => goToNextStep(),
        }}
        backButtonProps={{
          onClick: () => goToPreviousStep(),
        }}
      />
    </ServicesLayoutsSteps>
  );
}

export default ServiceImagesStep;
