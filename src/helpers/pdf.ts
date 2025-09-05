// lib/extractImages.ts
import { PdfJsLib } from "@/hooks/usePDFJS";
import { PDFDocument } from "pdf-lib";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";

export async function extractImagesFromPdf(
  file: File,
  pdfjsLib: PdfJsLib | undefined
): Promise<string[]> {
  if (!pdfjsLib) return [];
  if (typeof window === "undefined") {
    console.warn("extractImagesFromPdf cannot run on server-side");
    return [];
  }
  
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
      canvas, // 👈 thêm canvas (bắt buộc trong v4)
      intent: "display", // tuỳ chọn nhưng nên có
    };

    await page.render(renderContext).promise;

    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}

export async function extractPagesFromPdf(
  file: File,
  pageNumbers: number[]
): Promise<Uint8Array> {
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


import { StandardFonts, rgb } from "pdf-lib";

/**
 * Tạo file PDF có 1 trang trắng
 * @param width chiều rộng trang (mặc định 595 - A4)
 * @param height chiều cao trang (mặc định 842 - A4)
 */
export async function createEmptyPdfPage(width = 595, height = 842): Promise<Uint8Array> {
  // Tạo document mới
  const pdfDoc = await PDFDocument.create();

  // Add 1 page trắng
  const page = pdfDoc.addPage([width, height]);

  // (Không cần vẽ gì, để trắng)
  // Nếu bạn muốn debug thì có thể viết chữ "Empty Page"
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText("Empty Page", {
    x: width / 2 - 40,
    y: height / 2,
    size: 12,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Xuất ra mảng byte
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
