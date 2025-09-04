"use client";

import { extractImagesFromPdf } from "@/helpers/pdf"; // hàm render preview từng trang
import { PDFDocument } from "pdf-lib";
import { useState } from "react";

export default function PdfPageSelector() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const imgs = await extractImagesFromPdf(f);
      setImages(imgs);
      setSelectedPages([]); // reset
    }
  };

  const togglePage = (pageIndex: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((p) => p !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  const handleExport = async () => {
    if (!file || selectedPages.length === 0) return;

    const pdfData = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(pdfData);
    const newDoc = await PDFDocument.create();

    for (const pageIndex of selectedPages) {
      const [copiedPage] = await newDoc.copyPages(srcDoc, [pageIndex]);
      newDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newDoc.save();
    const blob = new Blob([newPdfBytes as unknown as BlobPart], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-pages.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`relative cursor-pointer border rounded ${
                  selectedPages.includes(idx)
                    ? "ring-4 ring-blue-500"
                    : "hover:ring-2 hover:ring-gray-400"
                }`}
                onClick={() => togglePage(idx)}
              >
                <img src={src} alt={`page-${idx + 1}`} />
                <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
                  Page {idx + 1}
                </span>
              </div>
            ))}
          </div>

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
