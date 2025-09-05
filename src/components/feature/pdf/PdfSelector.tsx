"use client";

import { useLoading } from "@/components/layout/Content-wrapper";
import I18n from "@/components/utils/I18n";
import { extractImagesFromPdf } from "@/helpers/pdf";
import { PdfJsLib, usePDFJS } from "@/hooks/usePDFJS";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  CheckSquare,
  FileText,
  Redo2,
  RotateCcw,
  RotateCw,
  Square,
  Trash2,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import PdfExportActions from "./PdfExportActions";
import PdfUploadZone from "./PdfUploadZone";
import { PagePreview, SortableItem } from "./SortableItem";

export default function PdfPageSelector() {
  const [images, setImages] = useState<PagePreview[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { setLoading } = useLoading();
  const [pdfjs, setPdfjs] = useState<PdfJsLib>();
  const [history, setHistory] = useState<PagePreview[][]>([]);
  const [future, setFuture] = useState<PagePreview[][]>([]);

  usePDFJS(async (pdfjsLib: PdfJsLib) => {
    setPdfjs(pdfjsLib);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ---- Undo/Redo helpers ----
  const pushHistory = (newImages: PagePreview[]) => {
    setHistory((h) => [...h, images]);
    setFuture([]);
    setImages(newImages);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setFuture((f) => [images, ...f]);
      setImages(prev);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future[0];
      setFuture((f) => f.slice(1));
      setHistory((h) => [...h, images]);
      setImages(next);
    }
  };

  // ---- File handling ----
  const handleFiles = async (fs: File[]) => {
    setLoading(true);
    for (const f of fs) {
      const imgs = await extractImagesFromPdf(f, pdfjs);
      const previews: PagePreview[] = imgs.map((src, idx) => ({
        id: `${f.name}-${idx}-${Math.random().toFixed(5)}`,
        src,
        file: f,
        pageIndex: idx,
        selected: true,
        rotation: 0,
        deleted: false,
      }));
      setImages((prev) => [...prev, ...previews]);
      setFiles((prev) => [...prev, f]);
    }
    setLoading(false);
  };

  const deleteFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    pushHistory(images.filter((p) => p.file.name !== fileName));
  };

  const selectAllFile = (fileName: string) =>
    pushHistory(
      images.map((p) =>
        p.file.name === fileName ? { ...p, selected: true } : p
      )
    );

  const deselectAllFile = (fileName: string) =>
    pushHistory(
      images.map((p) =>
        p.file.name === fileName ? { ...p, selected: false } : p
      )
    );

  // ---- Page actions ----
  const togglePage = (id: string) =>
    pushHistory(
      images.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );

  const deletePage = (id: string) => {
    pushHistory(images.map((p) => (p.id === id ? { ...p, deleted: true } : p)));
  };

  const selectAll = () => {
    pushHistory(images.map((p) => (p.deleted ? p : { ...p, selected: true })));
  };

  const deselectAll = () => {
    pushHistory(images.map((p) => (p.deleted ? p : { ...p, selected: false })));
  };
  const deleteSelectedPages = () => {
    pushHistory(images.map((p) => (p.selected ? { ...p, deleted: true } : p)));
  };

  const rotateSelected = () =>
    pushHistory(
      images.map((p) =>
        p.selected ? { ...p, rotation: ((p.rotation ?? 0) + 90) % 360 } : p
      )
    );

  const rotateAll = () =>
    pushHistory(
      images.map((p) => ({
        ...p,
        rotation: ((p.rotation ?? 0) + 90) % 360,
      }))
    );

  const clonePage = (id: string) => {
    const idx = images.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const page = images[idx];
    const newPage: PagePreview = {
      ...page,
      id: `${page.id}-clone-${Date.now()}`,
      selected: false,
    };
    const newImages = [...images];
    newImages.splice(idx + 1, 0, newPage);
    pushHistory(newImages);
  };

  const addEmptyPage = (id: string, pos: "before" | "after") => {
    const idx = images.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const empty: PagePreview = {
      id: `empty-${Date.now()}`,
      src: "",
      file: images[idx].file,
      pageIndex: -1,
      selected: false,
      isEmpty: true,
    };
    const newImages = [...images];
    newImages.splice(pos === "before" ? idx : idx + 1, 0, empty);
    pushHistory(newImages);
  };

  const rotatePage = (id: string) =>
    pushHistory(
      images.map((p) =>
        p.id === id ? { ...p, rotation: ((p.rotation ?? 0) + 90) % 360 } : p
      )
    );

  // ---- Drag & Drop ----
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      pushHistory(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-4 relative">
      {/* Upload */}
      <div className="mt-4 space-y-2">
        <div className="font-bold flex items-center gap-2">
          <span>
            <I18n value={"Upload PDF files"} />:
          </span>
          <PdfUploadZone onFiles={handleFiles} />
        </div>

        {/* File list with actions */}
        <div className="flex flex-col gap-3">
          {files?.map((f) => {
            const filePages = images.filter((p) => p.file.name === f.name);
            const total = filePages.length; // tổng (kể cả deleted)
            const selected = filePages.filter(
              (p) => p.selected && !p.deleted
            ).length;
            const deleted = filePages.filter((p) => p.deleted).length;

            return (
              <div
                key={f.name}
                className="border rounded p-2 flex flex-col gap-1 max-w-[400px]"
              >
                {/* Dòng 1: file name */}
                <div className="flex items-center font-semibold gap-2">
                  <FileText size={16} /> {f.name}
                </div>
                {/* Dòng 2: actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => selectAllFile(f.name)}
                    className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <CheckSquare size={14} /> Select All
                  </button>
                  <button
                    onClick={() => deselectAllFile(f.name)}
                    className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <Square size={14} /> Deselect
                  </button>
                  <button
                    onClick={() => deleteFile(f.name)}
                    className="px-2 py-1 bg-red-500 text-white rounded flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
                {/* Dòng 3: info */}
                <div className="text-xs text-gray-600 flex gap-3">
                  <span>Total: {total}</span>
                  <span>Selected: {selected}</span>
                  <span>Deleted: {deleted}</span>
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

      <>
        <h2 className="mt-4 font-bold">Reorder & Select Pages</h2>

        {/* Bulk + Global actions */}
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={images?.length === 0}
            onClick={selectAll}
          >
            Select All
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={images?.length === 0}
            onClick={deselectAll}
          >
            Deselect All
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
            onClick={deleteSelectedPages}
            disabled={images?.length === 0 || !images.some((p) => p.selected)}
          >
            Delete Selected
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
            onClick={rotateSelected}
            disabled={!images.some((p) => p.selected)}
          >
            <RotateCcw size={14} /> Rotate Selected
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
            onClick={rotateAll}
            disabled={images?.length === 0}
          >
            <RotateCw size={14} /> Rotate All
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
            onClick={undo}
            disabled={history.length === 0}
          >
            <Undo2 size={14} /> Undo
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
            onClick={redo}
            disabled={future.length === 0}
          >
            <Redo2 size={14} /> Redo
          </button>
        </div>

        {/* Sortable grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.filter((p) => !p.deleted).map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-8 gap-4 mt-2">
              {images
                .filter((p) => !p.deleted)
                ?.map((page) => (
                  <SortableItem
                    key={page.id}
                    page={page}
                    toggle={togglePage}
                    deletePage={deletePage}
                    rotatePage={rotatePage}
                    clonePage={clonePage}
                    addEmptyPage={addEmptyPage}
                  />
                ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Export */}
        <PdfExportActions images={images} />
      </>
    </div>
  );
}
