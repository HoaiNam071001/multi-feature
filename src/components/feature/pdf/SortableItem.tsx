"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TooltipWrapper } from "@/components/ui/tooltip";
import I18n from "@/components/utils/I18n";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Plus, RotateCcw, Trash2 } from "lucide-react";
import { FileBadge, FileInfo } from "./PdfFileList";

export interface PagePreview {
  id: string;
  src: string;
  file: FileInfo;
  pageIndex: number;
  selected: boolean;
  deleted?: boolean;
  rotation?: number;
  isEmpty?: boolean;
}

export const SortableItem = ({
  page,
  index,
  toggle,
  deletePage,
  clonePage,
  addEmptyPage,
  rotatePage,
}: {
  page: PagePreview;
  index: number;
  toggle: (id: string) => void;
  deletePage: (id: string) => void;
  clonePage: (id: string) => void;
  addEmptyPage: (id: string, position: "before" | "after") => void;
  rotatePage: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative border rounded overflow-hidden group ${
        page.selected
          ? "ring-4 ring-blue-500"
          : "hover:ring-2 hover:ring-gray-400"
      }`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute top-2 right-2 cursor-grab text-gray-500 p-1 bg-white border rounded z-100"
      >
        <GripVertical size={14} />
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-0 left-0 flex justify-between z-10 p-6 w-full px-1 opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-t from-gray-300 to-transparent">
        <TooltipWrapper content={<I18n value="Rotate" />}>
          <button
            onClick={() => rotatePage(page.id)}
            className="bg-white border p-1 rounded shadow-lg hover:bg-gray-100"
          >
            <RotateCcw size={14} />
          </button>
        </TooltipWrapper>

        <TooltipWrapper content={<I18n value="Duplicate" />}>
          <button
            onClick={() => clonePage(page.id)}
            className="bg-white border p-1 rounded shadow hover:bg-gray-100"
          >
            <Copy size={14} />
          </button>
        </TooltipWrapper>

        <TooltipWrapper content={<I18n value="Add Empty" />}>
          <button
            onClick={() => addEmptyPage(page.id, "after")}
            className="bg-white border p-1 rounded shadow hover:bg-gray-100"
          >
            <Plus size={14} />
          </button>
        </TooltipWrapper>

        <TooltipWrapper content={<I18n value="Delete" />}>
          <button
            onClick={() => deletePage(page.id)}
            className="bg-red-500 text-white p-1 rounded shadow hover:bg-red-600"
          >
            <Trash2 size={14} />
          </button>
        </TooltipWrapper>
      </div>

      {/* Page image */}
      <div
        className="w-full h-full flex items-center justify-center bg-gray-50"
        style={{ transform: `rotate(${page.rotation || 0}deg)` }}
      >
        {page.isEmpty ? (
          <span className="text-gray-400 text-sm">Empty Page</span>
        ) : (
          <img src={page.src} alt={page.id} className="w-full h-auto" />
        )}
      </div>

      {/* Checkbox */}
      <label className="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow flex items-center gap-1">
        <Checkbox
          className="cursor-pointer w-5 h-5"
          checked={page.selected}
          onCheckedChange={() => toggle(page.id)}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </label>

      {/* Header: file name */}
      <label className="absolute bottom-[0px] left-[0px] w-full bg-white px-2 py-1 flex items-center gap-1 justify-between">
        <FileBadge f={page.file} />
        {index >= 0 && <span>{index + 1}</span>}
      </label>
    </div>
  );
};
