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
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { Loader } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { PagePreview, SortableItem } from "./SortableItem";

export default function PdfPageSelector() {
  const [images, setImages] = useState<PagePreview[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    for (const f of fs) {
      const imgs = await extractImagesFromPdf(f);
      const previews = imgs.map((src, idx) => ({
        id: `${f.name}-${idx}`,
        src,
        file: f,
        pageIndex: idx,
        selected: false,
      }));
      setImages((prev) => [...prev, ...previews]);
    }
  };

  const togglePage = (id: string) => {
    console.log(id, images);
    setImages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
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
    <div className="p-4">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />

      {images.length > 0 && (
        <>
          <h2 className="mt-4 font-bold">Reorder & Select Pages</h2>
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
                  <SortableItem key={page.id} page={page} toggle={togglePage} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleExport}
              disabled={!images.some((p) => p.selected) || exporting}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 flex items-center gap-2"
            >
            {exporting && <Loader className="animate-spin duration-[3000ms]"/>}
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
