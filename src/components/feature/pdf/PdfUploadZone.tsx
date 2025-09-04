"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

interface PdfUploadZoneProps {
  onFiles: (files: File[]) => void;
}

export default function PdfUploadZone({ onFiles }: PdfUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    if (fs.length > 0) {
      onFiles(fs);
    }
    // clear input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fs = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (fs.length > 0) {
      onFiles(fs);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-30 border-2 border-dashed text-gray-600 border-gray-400 rounded-lg cursor-pointer hover:text-blue-500 hover:border-blue-500 transition"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Upload className="w-10 h-10" />
      <p className="">
        Drag & drop PDF files here, or click to upload
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
