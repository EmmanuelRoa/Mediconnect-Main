import React, { useState } from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useTranslation } from "react-i18next";
import { mockAppointments } from "@/data/appointments";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { Appointment } from "@/data/appointments";
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

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shared/ui/tooltip";
interface MedicalPrescriptionDialogProps {
  children?: React.ReactNode;
  appointmentId: string;
  historyId: string;
}

function MedicalPrescriptionDialog({
  children,
  appointmentId,
  historyId,
}: MedicalPrescriptionDialogProps) {
  const { t } = useTranslation("patient");
  const isMobile = useIsMobile();

  // Encontrar la appointment y el historial específico
  const appointment = mockAppointments.find((apt) => apt.id === appointmentId);
  const historyItem = appointment?.history?.find(
    (hist) => hist.id === historyId,
  );

  if (!appointment || !historyItem || !historyItem.medicalPrescription) {
    return (
      <MCModalBase
        id={`prescription-${appointmentId}-${historyId}`}
        title={t("appointment.medicalPrescription")}
        trigger={children}
        size="lg"
        variant="info"
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
    <MCModalBase
      id={`prescription-${appointmentId}-${historyId}`}
      title={historyItem.service}
      trigger={children}
      size="xl"
      variant="info"
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full">
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.specialty")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {appointment.doctorSpecialty}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.date")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {appointment.date}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.schedule")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {appointment.time}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.price")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              ${appointment.price}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.numberOfPatients")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {appointment.numberOfPatients}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.modality")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {appointment.appointmentType}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-md text-primary/75 font-medium">
              {t("appointment.location")}
            </h3>
            <p className="text-lg text-primary font-medium break-words max-w-xs">
              {historyItem.address}
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-primary font-medium">
              {t("appointment.diagnosis")}
            </h3>
            <div className="w-full h-full bg-bg-btn-secondary border border-primary/5 p-4 rounded-xl">
              <p className="text-lg text-primary font-medium break-words max-w-xs">
                {historyItem.medicalPrescription.diagnosis}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-primary font-medium">
              {t("appointment.observations")}
            </h3>
            <div className="w-full h-full bg-bg-btn-secondary border border-primary/5 p-4 rounded-xl">
              <p className="text-lg text-primary font-medium break-words ">
                {historyItem.medicalPrescription.observations}
              </p>{" "}
            </div>
          </div>
        </div>
      </div>{" "}
      <Separator className="my-2" />
      <div className="flex flex-col gap-4">
        <h3 className="text-lg text-primary font-medium">
          {t("appointment.attachedDocuments")}
        </h3>
        <div className="flex flex-wrap gap-4">
          {historyItem.medicalPrescription.documents &&
          historyItem.medicalPrescription.documents.length > 0 ? (
            historyItem.medicalPrescription.documents.map((doc, idx) => {
              const truncatedName = truncateFileName(doc.name);
              const isTruncated = truncatedName !== doc.name;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center border border-primary/10 rounded-3xl p-2 bg-transparent w-60"
                >
                  <PreviewDocumentsDialog
                    documentUrl={doc.url}
                    documentType={doc.url.split(".").pop()?.toLowerCase()}
                    documentName={doc.name}
                  >
                    {/* Preview */}
                    {doc.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <div className="relative overflow-hidden rounded-3xl border border-primary/5 w-45 h-40 mb-2 cursor-pointer group hover:opacity-80 transition-opacity">
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-lg font-semibold">
                            Ver preview
                          </span>
                        </div>
                      </div>
                    ) : doc.url.match(/\.pdf$/i) ? (
                      <div className="relative overflow-hidden rounded-3xl border border-primary/5 w-45 h-40 mb-2 flex items-center justify-center bg-background cursor-pointer group hover:opacity-80 transition-opacity">
                        <span className="text-primary/40 text-6xl">📄</span>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-lg font-semibold">
                            Ver preview
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-45 h-40 flex items-center justify-center rounded-2xl mb-2 border cursor-pointer group hover:opacity-80 transition-opacity">
                        <span className="text-xs text-primary/10">
                          Click to preview
                        </span>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-lg font-semibold">
                            Ver preview
                          </span>
                        </div>
                      </div>
                    )}{" "}
                  </PreviewDocumentsDialog>
                  {/* File name con truncate y tooltip condicional */}
                  {isTruncated ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium text-primary text-center break-all mb-1 cursor-pointer">
                            {truncatedName}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>{doc.name}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-sm font-medium text-primary text-center break-all mb-1">
                      {doc.name}
                    </span>
                  )}
                  {/* File type, size and download */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground items-center flex">
                      {doc.url.split(".").pop()?.toUpperCase() || "FILE"}
                    </span>
                    <a
                      href={doc.url}
                      download
                      className="text-xs text-secondary underline"
                    >
                      <Download className="inline-block mr-1 size-3.5" />
                      {t("appointment.download") || "Descargar"}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty className="py-8 w-full">
              <EmptyContent>
                <EmptyMedia>
                  <AlertCircle size={40} className="text-destructive/40" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{t("appointment.noDocumentsTitle")}</EmptyTitle>
                  <EmptyDescription>
                    {t("appointment.noDocuments")}
                  </EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </MCModalBase>
  );
}

// Función para truncar el nombre
function truncateFileName(name: string, maxLength = 22) {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + "...";
}

export default MedicalPrescriptionDialog;
