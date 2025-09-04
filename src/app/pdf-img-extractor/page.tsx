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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { SortableItem } from "./SortableItem";

interface PagePreview {
  id: string;
  src: string;
  file: File;
  pageIndex: number;
}

export default function PdfPageSelector() {
  const [images, setImages] = useState<PagePreview[]>([]);
  const [selectedPages, setSelectedPages] = useState<PagePreview[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      }));
      console.log('previews', previews);
      setImages((prev) => [...prev, ...previews]);
    }
  };

  const togglePage = (page: PagePreview) => {
    setSelectedPages((prev) =>
      prev.find((p) => p.id === page.id)
        ? prev.filter((p) => p.id !== page.id)
        : [...prev, page]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleExport = async () => {
    if (selectedPages.length === 0) return;

    const newDoc: PDFDocument = await PDFDocument.create();

    for (const sel of selectedPages) {
      const pdfData: ArrayBuffer = await sel.file.arrayBuffer();
      const srcDoc: PDFDocument = await PDFDocument.load(pdfData);
      const [copiedPage] = await newDoc.copyPages(srcDoc, [sel.pageIndex]);
      newDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newDoc.save();
    const blob = new Blob([newPdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
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
          <h2 className="mt-4 font-bold">All Pages</h2>
          <div className="grid grid-cols-8 gap-4 mt-2">
            {images.map((page) => (
              <div
                key={page.id}
                className={`relative cursor-pointer border rounded ${
                  selectedPages.find((p) => p.id === page.id)
                    ? "ring-4 ring-blue-500"
                    : "hover:ring-2 hover:ring-gray-400"
                }`}
                onClick={() => togglePage(page)}
              >
                <img src={page.src} alt={page.id} />
                <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
                  {page.file.name} - Page {page.pageIndex + 1}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mt-6 font-bold">Selected Pages (Drag to Reorder)</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedPages.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex gap-2 flex-wrap mt-2">
                {selectedPages.map((page) => (
                  <SortableItem key={page.id} id={page.id}>
                    <div className="relative border rounded w-32">
                      <img src={page.src} alt={page.id} />
                      <span className="absolute top-1 left-1 bg-white text-xs px-1 rounded">
                        {page.pageIndex + 1}
                      </span>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={handleExport}
            disabled={selectedPages.length === 0}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Export Selected Pages
          </button>
        </>
      )}
    </div>
  );
}
