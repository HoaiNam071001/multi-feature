// lib/pdfjs.ts
import * as pdfjsLib from "pdfjs-dist";

// 👇 cách chính xác cho Next.js (Webpack + ESM)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default pdfjsLib;
