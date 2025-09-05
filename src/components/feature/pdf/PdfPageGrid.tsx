"use client";

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
import { useMemo } from "react";
import { PagePreview, SortableItem } from "./SortableItem";

interface Props {
  images: PagePreview[];
  pushHistory: (imgs: PagePreview[]) => void;
}

export default function PdfPageGrid({ images, pushHistory }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selected = useMemo(() => images.filter((p) => p.selected), [images]);

  const togglePage = (id: string) =>
    pushHistory(
      images.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  const deletePage = (id: string) =>
    pushHistory(images.map((p) => (p.id === id ? { ...p, deleted: true } : p)));
  const rotatePage = (id: string) =>
    pushHistory(
      images.map((p) =>
        p.id === id ? { ...p, rotation: ((p.rotation ?? 0) + 90) % 360 } : p
      )
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

  const addEmptyPage = async (id: string, pos: "before" | "after") => {
    const idx = images.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const empty: PagePreview = {
      id: `empty-${Date.now()}`,
      src: '',
      file: images[idx].file,
      pageIndex: images[idx].pageIndex,
      selected: false,
      isEmpty: true,
    };
    const newImages = [...images];
    newImages.splice(pos === "before" ? idx : idx + 1, 0, empty);
    pushHistory(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      pushHistory(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
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
                index={selected.findIndex((p) => p.id === page.id)}
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
  );
}
