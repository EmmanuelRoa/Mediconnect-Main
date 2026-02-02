import React from "react";
import { X } from "lucide-react";
import { MCModalBase } from "@/shared/components/MCModalBase";

interface PreviewDocumentsDialogProps {
  children?: React.ReactNode;
  documentUrl?: string;
  documentType?: string;
  documentName?: string;
}

function PreviewDocumentsDialog({
  children,
  documentUrl,
  documentType,
  documentName,
}: PreviewDocumentsDialogProps) {
  const renderPreviewContent = () => {
    if (!documentUrl) {
      return (
        <div className="flex items-center justify-center h-[90vh] text-muted-foreground">
          <span>No document to preview</span>
        </div>
      );
    }

    // Check if it's an image
    if (documentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return (
        <div className="flex items-center justify-center max-h-[90vh] overflow-hidden">
          <img
            src={documentUrl}
            alt={documentName || "Document preview"}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      );
    }

    // Check if it's a PDF
    if (documentUrl.match(/\.pdf$/i)) {
      return (
        <div className="h-[90vh] w-full bg-transparent rounded-lg overflow-hidden">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0 rounded-lg bg-transparent custom-iframe-scroll"
            title={documentName || "PDF Document"}
            style={{ background: "transparent" }}
          />
        </div>
      );
    }

    // For other file types, show download option
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] gap-4">
        <div className="text-6xl text-muted-foreground">📄</div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {documentName || "Document"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Preview not available for this file type
          </p>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Open in new tab
          </a>
        </div>
      </div>
    );
  };

  return (
    <MCModalBase
      id="previewDocumentsDialog"
      title={documentName || "Preview Document"}
      trigger={children}
      size="xl"
    >
      <div className="p-4">{renderPreviewContent()}</div>
    </MCModalBase>
  );
}

export default PreviewDocumentsDialog;
