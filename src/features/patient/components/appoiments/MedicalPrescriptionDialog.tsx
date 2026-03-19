import React, { useState, useCallback, memo } from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/shared/ui/empty";
import { AlertCircle, Download } from "lucide-react";
import PreviewDocumentsDialog from "./PreviewDocumentsDialog";
import { Separator } from "@/shared/ui/separator";
import { ImageCarouselModal } from "@/features/doctor/components/healthService/ImageCarouselModal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shared/ui/tooltip";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import { useAppStore } from "@/stores/useAppStore";
import { MCGeneratePrescriptionPDF } from "@/shared/components/MCGeneratePrescriptionPDF";
import { formatTimeTo12h } from "@/utils/appointmentMapper";
import { formatCurrency } from "@/utils/formatCurrency";
import DOMPurify from "dompurify";

interface MedicalPrescriptionDialogProps {
  children?: React.ReactNode;
  historyItem: any;
  // ✅ FIX: Controlled open state lifted to parent to avoid portal nesting issues
  // Uses MCModalBase's API: isOpen + onClose (not open/onOpenChange)
  isOpen: boolean;
  onClose: () => void;
}

function truncateFileName(name: string, maxLength = 22) {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + "...";
}

// ✅ Memoized attachment card to prevent re-renders when carousel state changes
const AttachmentCard = memo(function AttachmentCard({
  doc,
  idx,
  isMobile,
  imageUrls,
  onImageClick,
  t,
}: {
  doc: any;
  idx: number;
  isMobile: boolean;
  imageUrls: string[];
  onImageClick: (index: number) => void;
  t: any;
}) {
  const truncatedName = truncateFileName(doc.media.nombre, isMobile ? 18 : 22);
  const isTruncated = truncatedName !== doc.media.nombre;
  const isImage = doc.media.tipoMime.includes("image");
  const imageIndex = imageUrls.indexOf(doc.media.archivo);

  return (
    <div className="flex flex-col items-center border border-primary/10 rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-transparent w-full">
      {isImage ? (
        <div
          onClick={() => onImageClick(imageIndex)}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/5 w-full aspect-[4/3] max-h-40 sm:max-h-56 mb-2 flex items-center justify-center bg-background cursor-pointer group hover:opacity-80 transition-opacity"
        >
          <img
            src={doc.media.archivo}
            alt={doc.media.nombre}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ maxHeight: isMobile ? "160px" : "224px" }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm sm:text-lg font-semibold px-2 text-center">
              Ver imagen
            </span>
          </div>
        </div>
      ) : (
        <PreviewDocumentsDialog
          documentUrl={doc.media.archivo}
          documentType={doc.media.tipoMime}
          documentName={doc.media.nombre}
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/5 w-full aspect-[4/3] max-h-40 sm:max-h-56 mb-2 flex items-center justify-center bg-background cursor-pointer group hover:opacity-80 transition-opacity">
            {doc.media.tipoMime.includes("pdf") ? (
              <iframe
                src={doc.media.archivo}
                title={doc.media.nombre}
                className="w-full h-full pointer-events-none"
                style={{
                  border: "none",
                  maxHeight: isMobile ? "160px" : "224px",
                }}
              />
            ) : (
              <span className="text-xs text-primary/10">Click to preview</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm sm:text-lg font-semibold px-2 text-center">
                Ver documento
              </span>
            </div>
          </div>
        </PreviewDocumentsDialog>
      )}

      {isTruncated ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs sm:text-sm font-medium text-primary text-center break-all mb-1 cursor-pointer px-1">
                {truncatedName}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs sm:text-sm">{doc.media.nombre}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-xs sm:text-sm font-medium text-primary text-center break-all mb-1 px-1">
          {doc.media.nombre}
        </span>
      )}

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-xs text-muted-foreground items-center flex">
          {doc.media.tipoMime || "FILE"}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              const response = await fetch(doc.media.archivo);
              const blob = await response.blob();
              const blobUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = blobUrl;
              link.download = doc.media.nombre;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
            } catch {
              // Fallback si el fetch falla por CORS
              window.open(doc.media.archivo, "_blank");
            }
          }}
          className="text-xs text-secondary underline flex items-center cursor-pointer"
        >
          <Download className="inline-block mr-1 size-3" />
          {t("appointment.download") || "Descargar"}
        </button>
      </div>
    </div>
  );
});

function MedicalPrescriptionDialog({
  children,
  historyItem,
  isOpen,
  onClose,
}: MedicalPrescriptionDialogProps) {
  const { t } = useTranslation("patient");
  const isMobile = useIsMobile();
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const user = useAppStore((state) => state.user);
  const userRole = user?.rol || "PATIENT";

  // ✅ useCallback prevents new function reference on every render
  const handleGeneratePDF = useCallback(async () => {
    if (!historyItem) return;

    const pdfData = {
      service: historyItem.cita?.servicio?.nombre || historyItem.nombre_diagnostico || "Consulta Médica",
      specialty: historyItem.cita?.servicio?.especialidad?.nombre || "-",
      date: historyItem.cita?.fechaFin || "-",
      time: historyItem.cita ? `${formatTimeTo12h(historyItem.cita.horaInicio)} - ${formatTimeTo12h(historyItem.cita.horaFin)}` : "-",
      price: historyItem.cita ? formatCurrency(historyItem.cita.totalAPagar) : "-",
      numberOfPatients: historyItem.cita?.numPacientes || 1,
      modality: historyItem.cita?.modalidad || "-",
      location: historyItem.cita?.ubicacion?.nombre || "-",
      diagnosis: historyItem.nombre_diagnostico || "-",
      observations: DOMPurify.sanitize(historyItem.descripcion_diagnostico) || "-",
      documents: historyItem.adjuntos?.map((adjunto: any) => adjunto.media?.archivo) || [],
      insurance: historyItem.cita?.seguro?.nombre || "-",
      doctorName: historyItem.cita?.doctor ? `${historyItem.cita.doctor.nombre} ${historyItem.cita.doctor.apellido}` : "-",
      doctorSpecialty: historyItem.cita?.doctor?.especialidades
        ?.map((e: any) => e.especialidades?.nombre)
        .join(", ") || "-",
      patientName: historyItem.cita?.paciente ? `${historyItem.cita.paciente.nombre} ${historyItem.cita.paciente.apellido}` : "-",
      viewerRole: userRole,
      fileName: `receta-medica-${historyItem.cita?.id}-${historyItem.id}`,
      language: "es" as const,
    };

    await MCGeneratePrescriptionPDF(pdfData);
  }, [historyItem, userRole]);

  // ✅ useCallback for carousel handlers
  const handleImageClick = useCallback((index: number) => {
    setCarouselStartIndex(index);
    setCarouselOpen(true);
  }, []);

  const handleCarouselClose = useCallback(() => {
    setCarouselOpen(false);
  }, []);

  // ✅ Derive imageUrls once — avoids .map() on every render
  const imageUrls: string[] = historyItem?.adjuntos
    ? historyItem.adjuntos.map((adjunto: any) => adjunto.media.archivo)
    : [];

  // ✅ Empty state modal — controlled
  if (!historyItem) {
    return (
      <MCModalBase
        id="prescription-empty"
        title={t("appointment.medicalPrescription")}
        trigger={children}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        variant="info"
        zIndex={100}
      >
        <Empty className="py-12">
          <EmptyContent>
            <EmptyMedia>
              <AlertCircle size={48} className="text-destructive/40" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>{t("appointment.errorTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("appointment.prescriptionNotFound")}
              </EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </MCModalBase>
    );
  }

  return (
    <>
      <MCModalBase
        id={`prescription-${historyItem.cita.id}-${historyItem.id}`}
        title={historyItem.cita.servicio.nombre}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        variant="info"
        zIndex={100}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <MCPDFButton onClick={handleGeneratePDF} />
          </div>

          <Separator className="my-1" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.service")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita.servicio.nombre}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.specialty")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita.servicio.especialidad.nombre}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.date")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita.fechaFin}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.schedule")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {formatTimeTo12h(historyItem.cita.horaInicio)} -{" "}
                {formatTimeTo12h(historyItem.cita.horaFin)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.price")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {formatCurrency(historyItem.cita.totalAPagar)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.numberOfPatients")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita.numPacientes}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.modality")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita.modalidad}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-md text-primary/75 font-medium">
                {t("appointment.insure")}
              </h3>
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.cita?.seguro?.nombre ??
                  t("appointment.noInsurance") ??
                  "—"}
              </p>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg text-primary font-medium">
                {t("appointment.diagnosis")}
              </h3>
              <div className="w-full bg-bg-btn-secondary border border-primary/5 p-3 sm:p-4 rounded-xl">
                <p className="text-sm sm:text-base text-primary font-medium break-words">
                  {historyItem.nombre_diagnostico}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg text-primary font-medium">
                {t("appointment.observations")}
              </h3>
              <div className="w-full bg-bg-btn-secondary border border-primary/5 p-3 sm:p-4 rounded-xl">
                <p
                  className="text-sm sm:text-base text-primary font-medium break-words"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      historyItem.descripcion_diagnostico
                    ),
                  }}
                />
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex flex-col gap-3 sm:gap-4">
            <h3 className="text-base sm:text-lg text-primary font-medium">
              {t("appointment.attachedDocuments")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {historyItem.adjuntos && historyItem.adjuntos.length > 0 ? (
                historyItem.adjuntos.map((doc: any, idx: number) => (
                  <AttachmentCard
                    key={doc.media?.id ?? idx}
                    doc={doc}
                    idx={idx}
                    isMobile={isMobile}
                    imageUrls={imageUrls}
                    onImageClick={handleImageClick}
                    t={t}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Empty className="py-8 w-full">
                    <EmptyContent>
                      <EmptyMedia>
                        <AlertCircle
                          size={isMobile ? 32 : 40}
                          className="text-destructive/40"
                        />
                      </EmptyMedia>
                      <EmptyHeader>
                        <EmptyTitle className="text-sm sm:text-base">
                          {t("appointment.noDocumentsTitle")}
                        </EmptyTitle>
                        <EmptyDescription className="text-xs sm:text-sm">
                          {t("appointment.noDocuments")}
                        </EmptyDescription>
                      </EmptyHeader>
                    </EmptyContent>
                  </Empty>
                </div>
              )}
            </div>
          </div>
        </div>
      </MCModalBase>

      {/* 
        ✅ ImageCarouselModal rendered as sibling, not child of MCModalBase,
        to avoid z-index stacking issues between nested portals.
      */}
      <ImageCarouselModal
        images={imageUrls}
        open={carouselOpen}
        onClose={handleCarouselClose}
        startIndex={carouselStartIndex}
      />
    </>
  );
}

export default MedicalPrescriptionDialog;