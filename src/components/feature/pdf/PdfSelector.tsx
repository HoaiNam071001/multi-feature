"use client";

import { extractImagesFromPdf } from "@/helpers/pdf";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Loader, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import PdfUploadZone from "./PdfUploadZone";
import { PagePreview, SortableItem } from "./SortableItem";

export default function PdfPageSelector() {
  const [images, setImages] = useState<PagePreview[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFiles = async (fs: File[]) => {
    setUploading(true);
    for (const f of fs) {
      const imgs = await extractImagesFromPdf(f);
      const previews = imgs.map((src, idx) => ({
        id: `${f.name}-${idx}-${Math.random().toFixed(5)}`,
        src,
        file: f,
        pageIndex: idx,
        selected: true, // auto chọn khi upload
      }));
      setImages((prev) => [...prev, ...previews]);
      setFiles((prev) => [...prev, f]);
    }
    setUploading(false);
  };

  const togglePage = (id: string) => {
    setImages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const deletePage = (id: string) => {
    setImages((prev) => prev.filter((p) => p.id !== id));
  };

  const selectAll = () => {
    setImages((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setImages((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const deleteSelectedPages = () => {
    setImages((prev) => prev.filter((p) => !p.selected));
  };

  const deleteFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setImages((prev) => prev.filter((p) => p.file.name !== fileName));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleExport = async () => {
    const selected = images.filter((p) => p.selected);
    if (selected.length === 0) return;

    setExporting(true);
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
  };

  return (
    <div className="p-4 relative">
      <div className="absolute top-[200px] left-1/2 -translate-x-1/2">
        {uploading && <Loader className="animate-spin w-20 h-20 text-gray-500" />}
      </div>
      {/* ✅ Upload Zone component */}
      <div className="mb-4 mx-auto max-w-[700px]">
        <PdfUploadZone onFiles={handleFiles} />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-bold">Uploaded Files</h3>
          <div className="flex flex-wrap gap-2">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 justify-between border rounded px-3 py-1 max-w-[300px]"
              >
                <span className="truncate">{f.name}</span>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => deleteFile(f.name)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Reorder & Select Pages</h2>

          {/* Bulk actions */}
          <div className="flex gap-2 my-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={selectAll}
            >
              Select All
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={deselectAll}
            >
              Deselect All
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={deleteSelectedPages}
              disabled={!images.some((p) => p.selected)}
            >
              Delete Selected
            </button>
          </div>

          {/* Sortable grid */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((p) => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-8 gap-4 mt-2">
                {images.map((page) => (
                  <SortableItem
                    key={page.id}
                    page={page}
                    toggle={togglePage}
                    deletePage={deletePage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Export */}
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
                Download
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
