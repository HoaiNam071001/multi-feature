"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import I18n from "@/components/utils/I18n";
import { Upload } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string; // ví dụ: "application/pdf,image/*"
  title?: string;
  description?: string;
  icon?: ReactNode;
  buttonLabel?: string;
  multiple?: boolean;
}

export default function UploadZone({
  onFiles,
  accept = "*/*",
  title = "Upload Files",
  description = "Supported file types",
  icon = <Upload className="w-12 h-12 text-gray-500" />,
  buttonLabel = "Upload",
  multiple = false,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fs = Array.from(files);
    if (fs.length > 0) {
      onFiles(fs);
      setOpen(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="hover:opacity-90 border-1">
          <Upload className="w-4 h-4" />
          <I18n value={buttonLabel} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div
          className={`flex flex-col items-center justify-center gap-4 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {icon}
          <p className="text-sm text-gray-600">
            Drag & Drop files here or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <p className="text-xs text-gray-500">{description}</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
