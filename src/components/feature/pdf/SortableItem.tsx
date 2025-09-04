import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

export interface PagePreview {
  id: string;
  src: string;
  file: File;
  pageIndex: number;
  selected: boolean;
}

export const SortableItem = ({
  page,
  toggle,
  deletePage,
}: {
  page: PagePreview;
  toggle: (id: string) => void;
  deletePage: (id: string) => void;
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
      className={`relative border rounded ${
        page.selected
          ? "ring-4 ring-blue-500"
          : "hover:ring-2 hover:ring-gray-400"
      }`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute top-2 right-2 cursor-grab text-gray-500 p-1 bg-white border rounded"
      >
        <GripVertical />
      </div>

      {/* Delete button */}
      <button
        onClick={() => deletePage(page.id)}
        className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded shadow hover:bg-red-600 z-10"
      >
        <Trash2 size={14} />
      </button>

      <img src={page.src} alt={page.id} />

      <label className="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow flex items-center gap-1">
        <Checkbox
          className="cursor-pointer w-5 h-5"
          checked={page.selected}
          onCheckedChange={() => toggle(page.id)}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </label>

      <label className="absolute bottom-0 left-0 bg-white px-2 py-1 text-xs border-t flex gap-1 h-[40px] w-full line-clamp-2 overflow-hidden">
        <div>{page.file.name}</div>
        <div className="flex items-end text-gray-400">{page.pageIndex + 1}</div>
      </label>
    </div>
  );
};
