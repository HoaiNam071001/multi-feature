// components/feature/text-proccessor/StepList.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical, CaseSensitive, Regex, CaseLower } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Step, StepType, stepTypeNames } from "./handlers";
import I18n from "@/components/utils/I18n";

import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Component con để hiển thị các tùy chọn chung
const StepOptions: React.FC<{ caseSensitive?: boolean; useRegex?: boolean }> = ({ caseSensitive, useRegex }) => (
  <div className="flex items-center gap-1 ml-2">
    {caseSensitive !== undefined && (
      <div
        className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${
          caseSensitive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
        {caseSensitive ? <CaseSensitive className="w-3 h-3" /> : <CaseLower className="w-3 h-3" />}
      </div>
    )}
    {useRegex && (
      <div className="bg-gray-300 text-gray-700 px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1">
        <Regex className="w-3 h-3 text-current" />
      </div>
    )}
  </div>
);

// Component con cho từng item có thể kéo thả
const SortableItem: React.FC<SortableItemProps> = ({ step, index, removeStep, stepOutputs }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStepName = (s: Step) => {
    switch (s.type) {
      case StepType.Truncate:
        return `${stepTypeNames[s.type]} (${s.length})`;
      case StepType.FindReplace:
        return `${stepTypeNames[s.type]}: "${s.find}" -> "${s.replace}"`;
      case StepType.ReplaceHtmlClassName:
        const tagFilterClassName = s.tagFilter?.length ? `(thẻ: ${s.tagFilter.join(", ")})` : "";
        return `${stepTypeNames[s.type]}: "${s.find}" -> "${s.replace}" ${tagFilterClassName}`;
      case StepType.ReplaceHtmlAttributes:
        const tagFilterAttr = s.tagFilter?.length ? `(thẻ: ${s.tagFilter.join(", ")})` : "";
        return `${stepTypeNames[s.type]} (${s.attributeName}): "${s.find}" -> "${s.replace}" ${tagFilterAttr}`;
      case StepType.ReplaceHtmlContent:
        const tagFilterContent = s.tagFilter?.length ? `(thẻ: ${s.tagFilter.join(", ")})` : "";
        return `${stepTypeNames[s.type]}: "${s.find}" -> "${s.replace}" ${tagFilterContent}`;
      default:
        return stepTypeNames[s.type] || "Không xác định";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const stepName = getStepName(step);
  const output = stepOutputs[index];
  const displayedOutput = truncateText(output, 20);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center border rounded px-2 py-1 bg-gray-50 group"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium flex items-center truncate">
          <div className="truncate">{stepName}</div>
          {(step.type === StepType.FindReplace ||
            step.type === StepType.ReplaceHtmlClassName ||
            step.type === StepType.ReplaceHtmlAttributes ||
            step.type === StepType.ReplaceHtmlContent) && (
            <StepOptions caseSensitive={step.caseSensitive} useRegex={step.useRegex} />
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-gray-500 italic truncate">
              {displayedOutput}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs break-words">
            {output}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="p-1 cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => removeStep(index)}
        >
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
  reorderSteps
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(step => step.id === active.id);
      const newIndex = steps.findIndex(step => step.id === over.id);
      reorderSteps(arrayMove(steps, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <h2 className="text-xl font-bold mb-4">
        <I18n value="Các bước xử lý" />
      </h2>
      {steps.length === 0 && (
        <p className="text-gray-500 text-sm">
          <I18n value="Chưa có bước nào được thêm" />
        </p>
      )}
      <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
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