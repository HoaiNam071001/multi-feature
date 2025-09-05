"use client";

import { Button } from "@/components/ui/button";
import { Download, FileIcon, Loader, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import type { PagePreview } from "./SortableItem";

interface PdfExportActionsProps {
  images: PagePreview[];
}

interface ExportedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function PdfExportActions({ images }: PdfExportActionsProps) {
  const [exporting, setExporting] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<ExportedFile[]>([]);

  const handleExport = async () => {
    const selected = images.filter((p) => p.selected && !p.deleted);
    if (selected.length === 0) return;

    setExporting(true);
    try {
      const newDoc = await PDFDocument.create();
      const docCache = new Map<string, PDFDocument>();

      for (const sel of selected) {
        if (!sel.file) continue;

        let srcDoc = docCache.get(sel.file.id);
        if (!srcDoc) {
          const pdfData = await sel.file.item.arrayBuffer();
          srcDoc = await PDFDocument.load(pdfData);
          docCache.set(sel.file.id, srcDoc);
        }

        if (sel.isEmpty) {
          if (sel.pageIndex >= 0 && sel.pageIndex < srcDoc.getPageCount()) {
            const refPage = srcDoc.getPage(sel.pageIndex);
            const { width, height } = refPage.getSize();
            newDoc.addPage([width, height]);
          }
        } else {
          if (sel.pageIndex >= 0 && sel.pageIndex < srcDoc.getPageCount()) {
            const [copiedPage] = await newDoc.copyPages(srcDoc, [
              sel.pageIndex,
            ]);
            newDoc.addPage(copiedPage);
          }
        }
      }

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      const newFile: ExportedFile = {
        url,
        name: `niz-export-${Date.now()}.pdf`,
        size: blob.size,
        type: blob.type,
        id: Date.now().toString(),
      };

      setExportedFiles((prev) => [...prev, newFile]);
      setExporting(false);
    } catch (error) {
      console.error(error);
      setExporting(false);
    }
  };

  const handleDelete = (url: string) => {
    setExportedFiles((prev) => prev.filter((f) => f.url !== url));
    URL.revokeObjectURL(url);
  };

  const handleDownload = (file: ExportedFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Button
        onClick={handleExport}
        disabled={!images.some((p) => p.selected) || exporting}
        className="flex items-center gap-2 w-fit"
      >
        {exporting && <Loader className="animate-spin" />}
        Export Selected Pages ({images.filter((p) => p.selected).length} Pages)
      </Button>
      <FileList
        files={exportedFiles}
        onRemove={handleDelete}
        onDownload={handleDownload}
      />
    </div>
  );
}

interface FileListProps {
  files: ExportedFile[];
  onRemove?: (id: string) => void;
  onDownload?: (file: ExportedFile) => void;
}

export function FileList({ files, onRemove, onDownload }: FileListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:shadow-md transition w-[400px]"
          onMouseEnter={() => setHoveredId(file.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Icon */}
          <FileIcon className="w-7 h-7 text-blue-500 shrink-0" />

          {/* Info */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{file.name}</span>
            <span className="text-sm text-gray-500">
              {formatSize(file.size)} • {file.type}
            </span>
          </div>

          {/* Actions */}
          {hoveredId === file.id && (
            <div className="absolute top-2 right-2 flex gap-2">
              {onDownload && (
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 transition"
                  onClick={() => onDownload(file)}
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              )}
              {onRemove && (
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 transition"
                  onClick={() => onRemove(file.url)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
