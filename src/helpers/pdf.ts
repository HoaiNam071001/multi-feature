// lib/extractImages.ts
import pdfjsLib from "@/lib/pdfjs";
import { PDFDocument } from "pdf-lib";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";

export async function extractImagesFromPdf(file: File): Promise<string[]> {
  const pdfData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext: RenderParameters = {
      canvasContext: ctx,
      viewport,
      canvas,              // 👈 thêm canvas (bắt buộc trong v4)
      intent: "display",   // tuỳ chọn nhưng nên có
    };

    await page.render(renderContext).promise;

    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}


export async function extractPagesFromPdf(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const pdfData = await file.arrayBuffer();

  // Load PDF gốc
  const srcDoc = await PDFDocument.load(pdfData);

  // Tạo PDF mới
  const newDoc = await PDFDocument.create();

  // Duyệt danh sách trang
  for (const pageNumber of pageNumbers) {
    const [copiedPage] = await newDoc.copyPages(srcDoc, [pageNumber - 1]); 
    newDoc.addPage(copiedPage);
  }

  // Xuất ra file PDF (Uint8Array)
  return await newDoc.save();
}