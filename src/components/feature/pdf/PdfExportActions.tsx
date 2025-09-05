"use client";

import I18n from "@/components/utils/I18n";
import { Loader } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import type { PagePreview } from "./SortableItem";

interface PdfExportActionsProps {
  images: PagePreview[];
}

export default function PdfExportActions({ images }: PdfExportActionsProps) {
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleExport = async () => {
    const selected = images.filter((p) => p.selected && !p.deleted);
    if (selected.length === 0) return;

    setExporting(true);
    try {
      const newDoc = await PDFDocument.create();
      for (const sel of selected) {
        const pdfData = await sel.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(pdfData);
        const [copiedPage] = await newDoc.copyPages(srcDoc, [sel.pageIndex]);
        newDoc.addPage(copiedPage);
      }

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([newPdfBytes as unknown as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      setExporting(false);
    } catch (error) {
      console.error(error);
      setExporting(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={handleExport}
        disabled={!images.some((p) => p.selected) || exporting}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 flex items-center gap-2"
      >
        {exporting && <Loader className="animate-spin" />}
        Export Selected Pages
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="merged.pdf"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          <I18n value="Download PDF" />
        </a>
      )}
    </div>
  );
}
