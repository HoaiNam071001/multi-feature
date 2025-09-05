"use client";

import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useEffect, useState } from "react";

// Định nghĩa kiểu cho pdfjs-dist
export interface PdfJsLib {
  getDocument: (params: { data: ArrayBuffer }) => {
    promise: Promise<PDFDocumentProxy>;
  };
}

export const usePDFJS = (onLoad: (pdfjs: PdfJsLib) => Promise<void>) => {
  const [pdfjs, setPDFJS] = useState<PdfJsLib | null>(null);
  // Tải pdfjs-dist một lần khi component mount
  useEffect(() => {
    import("@/lib/pdfjs")
      .then((module) => {
        setPDFJS(module.default);
      })
      .catch((error) => {
        console.error("Failed to load pdfjs-dist:", error);
      });
  }, []);

  // Gọi callback khi pdfjs được tải hoặc dependencies thay đổi
  useEffect(() => {
    if (!pdfjs) return;
    (async () => await onLoad(pdfjs))();
  }, [onLoad, pdfjs]);
};
