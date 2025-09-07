// components/feature/text-processor/ResultPopup.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import I18n from "@/components/utils/I18n";
import { useEffect, useState } from "react";

interface ImagePreviewProps {
  canvas: HTMLCanvasElement | undefined;
  filterString: string;
  generateCroppedImage: (toFileName?: string) => Promise<void>;
}

export const ImagePreview = ({
  canvas,
  filterString,
  generateCroppedImage,
}: ImagePreviewProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      setImageSrc(dataUrl);
    }
  }, [canvas]);

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => generateCroppedImage()}>
          <I18n value="Preview" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <I18n value="Preview" />
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 max-h-[70vh] flex items-center justify-center overflow-auto">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-full max-w-full border rounded bg-gray-100"
              style={{ filter: filterString || "none" }} // Apply CSS filter
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              <I18n value="No image available" />
            </div>
          )}
        </div>

        <DialogFooter className="mt-auto pt-4">
          <DialogClose asChild>
            <Button variant="outline">
              <I18n value="Đóng" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};