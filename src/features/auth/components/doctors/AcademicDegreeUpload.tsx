import { MCModalBase } from "@/shared/components/MCModalBase";
import academicImg from "@/assets/doctorOnbording/studies.png";
import MCButton from "@/shared/components/forms/MCButton";
import MCProfileImageUploader from "@/shared/components/MCProfileImageUploader";
import { useState } from "react";
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { ImageUp, Camera, Image as ImageIcon } from "lucide-react";
import { XIcon } from "lucide-react";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type AcademicDegreeUploadProps = {
  children?: React.ReactNode;
};

export function AcademicDegreeUploadTrigger({
  children,
  ...modalProps
}: AcademicDegreeUploadProps) {
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Cuando se sube o arrastra una imagen, abrir crop modal
  const handleImageInput = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImage(event.target?.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0].type.startsWith("image/")) {
      handleImageInput(droppedFiles[0]);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageInput(file);
    };
    input.click();
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("loadedmetadata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setRawImage(imageDataUrl);
        setCropModalOpen(true);
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Cuando el usuario confirma el crop
  const handleCropComplete = (cropped: string) => {
    setCroppedImage(cropped);
    setCropModalOpen(false);
    setRawImage(null);
  };

  return (
    <>
      <MCModalBase
        id="academic-degree"
        {...modalProps}
        trigger={children}
        size="lg"
        typeclose="Arrow"
        triggerClassName="w-full"
      >
        <div className="h-full w-full p-6">
          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-primary mb-2">
              Foto de perfil
            </h2>
          </div>

          {/* Imagen */}
          <div className="flex justify-center mb-6">
            <img
              src={academicImg}
              alt="Academic degree"
              className="w-fit h-60 object-contain"
            />
          </div>

          {/* Texto descriptivo */}
          <div className="text-center mb-8">
            <p className="text-primary text-base max-w-md mx-auto leading-relaxed">
              Sube una foto clara y profesional para tu perfil. Esto ayuda a que
              otros usuarios te reconozcan fácilmente y mejora la confianza en
              la plataforma.
            </p>
          </div>

          {/* Espacio en blanco donde se maneja si se arrastra la imagen */}
          {(isDragging || croppedImage) && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              {croppedImage ? (
                <div className="relative flex justify-center">
                  <img
                    src={croppedImage}
                    alt="Preview"
                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setCroppedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-4 flex justify-center">
                    <ImageIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Arrastra y suelta una imagen aquí, o usa los botones de
                    abajo
                  </p>
                </>
              )}
            </div>
          )}

          {/* Botones al final */}
          <div className="flex flex-col gap-3 justify-center py-4">
            <MCButton
              onClick={handleFileUpload}
              variant="primary"
              icon={<ImageUp />}
            >
              Subir imagen
            </MCButton>

            <MCButton
              onClick={handleTakePhoto}
              variant="secondary"
              icon={<Camera />}
            >
              Tomar foto
            </MCButton>
          </div>
        </div>
      </MCModalBase>

      {/* Crop Modal - Usando MCModalBase a través de MCProfileImageUploader */}
      {rawImage && (
        <MCProfileImageUploader
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={rawImage}
          aspectRatio={1}
          isCircular={false}
          onCropComplete={handleCropComplete}
          title="Recorta tu foto de perfil"
        />
      )}
    </>
  );
}

export default AcademicDegreeUploadTrigger;
