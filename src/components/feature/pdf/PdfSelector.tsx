"use client";

import { useState } from "react";
import PdfExportActions from "./PdfExportActions";
import PdfFileList from "./PdfFileList";
import PdfPageActions from "./PdfPageActions";
import PdfPageGrid from "./PdfPageGrid";
import { PagePreview } from "./SortableItem";

export default function PdfPageSelector() {
  const [images, setImages] = useState<PagePreview[]>([]);
  const [history, setHistory] = useState<PagePreview[][]>([]);
  const [future, setFuture] = useState<PagePreview[][]>([]);

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

  return (
    <div className="p-4 relative">
      {/* Upload */}
      <PdfFileList
        images={images}
        pushHistory={pushHistory}
        setImages={setImages}
      />

      <>
        <h2 className="mt-4 font-bold">Reorder & Select Pages</h2>

        {/* Bulk + Global actions */}
        <PdfPageActions
          images={images}
          pushHistory={pushHistory}
          history={history}
          setHistory={setHistory}
          future={future}
          undo={undo}
          redo={redo}
        />

        {/* Sortable grid */}
        <PdfPageGrid images={images} pushHistory={pushHistory} />
        {/* Export */}
        <PdfExportActions images={images} />
      </>
    </div>
  );
}
