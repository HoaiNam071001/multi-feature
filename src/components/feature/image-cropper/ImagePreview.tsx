// components/feature/text-proccessor/ResultPopup.tsx
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

export const ImagePreview = ({
  previewCanvasRef,
  generateCroppedImage,
}: {
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  generateCroppedImage: (toFileName?: string) => Promise<string | null>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} onClick={() => generateCroppedImage()}>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <I18n value={"Preview"} />
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 h-[70vh]">
          <canvas
            ref={previewCanvasRef}
            className="max-h-full max-w-full mt-2 border rounded bg-gray-100"
          />
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
