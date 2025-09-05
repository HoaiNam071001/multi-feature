"use client";

import { Button } from "@/components/ui/button";
import { Redo2, RotateCcw, RotateCw, Undo2 } from "lucide-react";
import { PagePreview } from "./SortableItem";

interface Props {
  images: PagePreview[];
  pushHistory: (imgs: PagePreview[]) => void;
  history: PagePreview[][];
  setHistory: React.Dispatch<React.SetStateAction<PagePreview[][]>>;
  future: PagePreview[][];
  undo: () => void;
  redo: () => void;
}

export default function PdfPageActions({
  images,
  pushHistory,
  history,
  future,
  undo,
  redo,
}: Props) {
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

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      <Button disabled={images?.length === 0} onClick={selectAll}>
        Select All
      </Button>
      <Button disabled={images?.length === 0} onClick={deselectAll}>
        Deselect All
      </Button>
      <Button
        variant="destructive"
        onClick={deleteSelectedPages}
        disabled={images?.length === 0 || !images.some((p) => p.selected)}
      >
        Delete Selected
      </Button>
      <Button
        variant="outline"
        onClick={rotateSelected}
        disabled={!images.some((p) => p.selected)}
      >
        <RotateCcw size={14} /> Rotate Selected
      </Button>
      <Button
        variant="outline"
        onClick={rotateAll}
        disabled={images?.length === 0}
      >
        <RotateCw size={14} /> Rotate All
      </Button>
      <Button
        variant="secondary"
        onClick={undo}
        disabled={history.length === 0}
      >
        <Undo2 size={14} /> Undo
      </Button>
      <Button variant="secondary" onClick={redo} disabled={future.length === 0}>
        <Redo2 size={14} /> Redo
      </Button>
    </div>
  );
}
