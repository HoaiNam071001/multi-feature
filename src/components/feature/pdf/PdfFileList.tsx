// components/PdfFileList.tsx
import { useLoading } from "@/components/layout/Content-wrapper";
import { TooltipWrapper } from "@/components/ui/tooltip";
import I18n from "@/components/utils/I18n";
import { getRandomColor } from "@/helpers/color";
import { extractImagesFromPdf } from "@/helpers/pdf";
import { PdfJsLib, usePDFJS } from "@/hooks/usePDFJS";
import { CheckSquare, Square, Trash2 } from "lucide-react";
import { SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PdfUploadZone from "./PdfUploadZone";
import { PagePreview } from "./SortableItem";

export interface FileInfo {
  id: string;
  key: string;
  color: string;
  item: File;
}

export default function PdfFileList({
  images,
  pushHistory,
  setImages,
}: {
  images: PagePreview[];
  pushHistory: (images: PagePreview[]) => void;
  setImages: (value: SetStateAction<PagePreview[]>) => void;
}) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const { setLoading } = useLoading();
  const [pdfjs, setPdfjs] = useState<PdfJsLib>();
  const [keyIdx, setKeyIdx] = useState<number>(1);

  usePDFJS(async (pdfjsLib: PdfJsLib) => {
    setPdfjs(pdfjsLib);
  });
  // ---- File handling ----
  const handleFiles = async (fs: File[]) => {
    setLoading(true);
    let currentKey = keyIdx;
    for (const f of fs) {
      const fileInfo = {
        id: uuidv4(),
        key: `F-${currentKey}`,
        color: getRandomColor(),
        item: f,
      };
      currentKey += 1;
      const imgs = await extractImagesFromPdf(f, pdfjs);
      const previews: PagePreview[] = imgs.map((src, idx) => ({
        id: uuidv4(),
        src,
        file: fileInfo,
        pageIndex: idx,
        selected: true,
        rotation: 0,
        deleted: false,
      }));
      setImages((prev) => [...prev, ...previews]);
      setFiles((prev) => [...prev, fileInfo]);
    }
    setKeyIdx(currentKey);
    setLoading(false);
  };

  const deleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    pushHistory(images.filter((p) => p.file.id !== fileId));
  };

  const selectAllFile = (fileId: string) =>
    pushHistory(
      images.map((p) => (p.file.id === fileId ? { ...p, selected: true } : p))
    );

  const deselectAllFile = (fileId: string) =>
    pushHistory(
      images.map((p) => (p.file.id === fileId ? { ...p, selected: false } : p))
    );

  return (
    <div className="space-y-2 overflow-x-hidden w-full">
      <div className="font-bold flex items-center gap-2">
        <span>
          <I18n value={"Upload PDF files"} />:
        </span>
        <PdfUploadZone onFiles={handleFiles} />
      </div>

      {/* File list with actions */}
      <div className="flex gap-3 overflow-auto">
        {files?.map((f) => {
          const filePages = images.filter((p) => p.file.id === f.id);
          const total = filePages.length; // tổng (kể cả deleted)
          const selected = filePages.filter(
            (p) => p.selected && !p.deleted
          ).length;
          const deleted = filePages.filter((p) => p.deleted).length;

          return (
            <div
              key={f.id}
              className="border rounded p-2 flex flex-col gap-1 w-[250px] min-w-[250px]"
            >
              {/* Dòng 1: file name */}
              <div className="flex items-center font-semibold gap-2 ">
                <FileBadge f={f} />
                <div className="truncate">{f.item?.name}</div>
              </div>

              {/* Dòng 2: info */}
              <div className="text-xs text-gray-600 flex gap-1 justify-between">
                <span>Total: {total}</span>
                <span>Selected: {selected}</span>
                <span>Deleted: {deleted}</span>
              </div>

              {/* Dòng 3: actions */}

              <div className="flex gap-2 justify-end">
                <TooltipWrapper content={<I18n value="Select all" />}>
                  <button
                    onClick={() => selectAllFile(f.id)}
                    className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <CheckSquare size={14} />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper content={<I18n value="Deselect all" />}>
                  <button
                    onClick={() => deselectAllFile(f.id)}
                    className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <Square size={14} />
                  </button>
                </TooltipWrapper>

                <TooltipWrapper content={<I18n value="Delete" />}>
                  <button
                    onClick={() => deleteFile(f.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </TooltipWrapper>
              </div>
            </div>
          );
        })}
        {files.length === 0 && (
          <div className="flex items-center gap-2 justify-between border rounded px-3 py-1 max-w-[300px]">
            <span className="truncate">No files uploaded</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const FileBadge = ({ f }: { f: FileInfo }) => {
  return (
    <div
      className="text-[11px] text-white shrink-0 border px-1 rounded"
      style={{ backgroundColor: f.color }}
    >
      {f.key}
    </div>
  );
};
