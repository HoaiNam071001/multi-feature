// components/feature/text-proccessor/StepList.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react"; // Thêm icon GripVertical
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Step, StepType, stepTypeNames } from "./TextProccessor";
import I18n from "@/components/utils/I18n";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StepListProps {
  steps: Step[];
  stepOutputs: string[];
  removeStep: (index: number) => void;
  reorderSteps: (newSteps: Step[]) => void;
}

interface SortableItemProps {
  step: Step;
  index: number;
  removeStep: (index: number) => void;
  stepOutputs: string[];
}

// Component con cho từng item có thể kéo thả
const SortableItem: React.FC<SortableItemProps> = ({
  step,
  index,
  removeStep,
  stepOutputs,
}) => {
  // Bỏ spread operator `...listeners` từ <li> và chuyển sang nút kéo
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStepName = (s: Step) => {
    switch (s.type) {
      case StepType.RemoveChars:
        return `${stepTypeNames[s.type]}: "${s.chars}"`;
      case StepType.Truncate:
        return `${stepTypeNames[s.type]} (${s.length})`;
      case StepType.FindReplace:
        return `${stepTypeNames[s.type]} "${s.find}" & "${s.replace}"`;
      case StepType.RemoveDiacritics:
        return `${stepTypeNames[s.type]}`;
      default:
        return stepTypeNames[s.type] || "Không xác định";
    }
  };
  const stepName = getStepName(step);
  const output = stepOutputs[index];

  return (
    <li
      ref={setNodeRef}
      style={style}
      // Loại bỏ cursor-grab và active:cursor-grabbing từ <li> để chỉ nút mới có
      className="flex justify-between items-center border rounded px-2 py-1 bg-gray-50 group" // Thêm group để kiểm soát hover
    >
      <div className="flex-1 min-w-0 pr-2">
        <div className="font-medium mr-2">{stepName}</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-gray-500 italic truncate">
              {output}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs break-words">
            {output}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-1">
        {/* Nút kéo thả mới chỉ hiện khi hover */}
        <Button
          size="icon"
          variant="ghost"
          className="p-1 cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" // opacity-0 để ẩn, group-hover:opacity-100 để hiện
          {...listeners}
          {...attributes}
        >
          <GripVertical className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => removeStep(index)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
};

const StepList: React.FC<StepListProps> = ({
  steps,
  stepOutputs,
  removeStep,
  reorderSteps,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      reorderSteps(arrayMove(steps, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <h2 className="text-xl font-bold mb-4">
        <I18n value="Các bước xử lý" />
      </h2>
      {steps.length === 0 && (
        <p className="text-gray-500 text-sm">
          <I18n value="Chưa có bước nào được thêm" />
        </p>
      )}
      <SortableContext
        items={steps.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <SortableItem
              key={step.id}
              step={step}
              index={index}
              removeStep={removeStep}
              stepOutputs={stepOutputs}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default StepList;
