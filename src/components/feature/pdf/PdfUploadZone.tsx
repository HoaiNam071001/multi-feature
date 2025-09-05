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
import { useRef, useState } from "react";

interface PdfUploadZoneProps {
  onFiles: (files: File[]) => void;
}

export default function PdfUploadZone({ onFiles }: PdfUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    if (fs.length > 0) {
      onFiles(fs);
    }
    setOpen(false); // đóng popup sau khi chọn file
    // clear input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Upload className="w-4 h-4" />
            <I18n value={"Upload"} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload PDF files</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <Upload className="w-12 h-12 text-gray-500" />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
            >
              Choose files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <p className="text-xs text-gray-500">
              Only PDF files are supported.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
