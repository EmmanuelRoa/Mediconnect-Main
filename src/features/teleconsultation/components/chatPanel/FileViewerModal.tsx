import { FileText, Download } from "lucide-react";
import { MCDialogBase } from "@/shared/components/MCDialogBase";
import { useTranslation } from "react-i18next";

interface ViewerModalState {
  open: boolean;
  content: string;
  type: "image" | "file";
  fileName?: string;
  fileType?: string;
}

interface FileViewerModalProps {
  viewerModal: ViewerModalState;
  onOpenChange: (open: boolean) => void;
  onDownloadFile: (url: string, fileName: string) => void;
  getFileIcon: (fileType: string) => string;
}

export const FileViewerModal = ({
  viewerModal,
  onOpenChange,
  onDownloadFile,
  getFileIcon,
}: FileViewerModalProps) => {
  const { t } = useTranslation("common");

  return (
    <MCDialogBase
      open={viewerModal.open}
      onOpenChange={onOpenChange}
      title={
        viewerModal.type === "image"
          ? t("fileViewer.imageTitle")
          : viewerModal.fileName || t("fileViewer.fileTitle")
      }
      size="image-preview"
      confirmText={t("fileViewer.close")}
      onConfirm={() => onOpenChange(false)}
      borderHeader
    >
      <div className="space-y-4">
        {viewerModal.type === "image" && (
          <div className="flex items-center justify-center rounded-lg">
            <img
              src={viewerModal.content}
              alt={t("fileViewer.imageTitle")}
              className="max-w-full object-contain rounded-lg"
            />
          </div>
        )}

        {viewerModal.type === "file" && (
          <>
            {viewerModal.fileType === "pdf" && (
              <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <object
                  data={viewerModal.content}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                    <FileText
                      size={64}
                      className="text-muted-foreground mb-4"
                    />
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("fileViewer.pdfNotSupported")}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          window.open(viewerModal.content, "_blank")
                        }
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {t("fileViewer.openInNewTab")}
                      </button>
                      <button
                        onClick={() =>
                          onDownloadFile(
                            viewerModal.content,
                            viewerModal.fileName || "documento.pdf",
                          )
                        }
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
                      >
                        <Download size={16} />
                        {t("fileViewer.download")}
                      </button>
                    </div>
                  </div>
                </object>
              </div>
            )}

            {viewerModal.fileType !== "pdf" && (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-6xl mb-4">
                  {getFileIcon(viewerModal.fileType || "other")}
                </div>
                <p className="font-medium text-lg mb-2">
                  {viewerModal.fileName}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("fileViewer.previewNotAvailable")}
                </p>
                <button
                  onClick={() =>
                    onDownloadFile(
                      viewerModal.content,
                      viewerModal.fileName || "archivo",
                    )
                  }
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  {t("fileViewer.downloadFile")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MCDialogBase>
  );
};
