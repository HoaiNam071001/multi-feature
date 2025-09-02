// components/feature/text-proccessor/StepList.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import I18n from "@/components/utils/I18n";
import { CaseLower, CaseSensitive, GripVertical, Regex, X } from "lucide-react";
import React from "react";
import { Step, StepType, stepTypeNames } from "./handlers";

import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

  const truncateText = (text: string | undefined | null, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const renderStepDetails = (s: Step) => {
    const commonHtmlOptions =
      "tagFilter" in s && ("classFilter" in s) && (s.tagFilter?.length || s.classFilter) ? (
        <span className="text-gray-500 text-xs ml-1">
          {s.tagFilter?.length ? `thẻ: ${s.tagFilter.join(", ")}` : ""}
          {s.tagFilter?.length && s.classFilter ? ", " : ""}
          {s.classFilter ? `class: ${s.classFilter}` : ""}
        </span>
      ) : null;

    switch (s.type) {
      case StepType.Truncate:
        return `${stepTypeNames[s.type]} (${s.length} ký tự)`;
      case StepType.FindReplace:
        return (
          <>
            {stepTypeNames[s.type]}: {"\""}<span className="font-semibold">{truncateText(s.find, 15)}</span>{"\""}
            {" -> "}
            {"\""}<span className="font-semibold">{truncateText(s.replace, 15)}</span>{"\""}
          </>
        );
      case StepType.ReplaceHtmlClassName:
      case StepType.ReplaceHtmlContent:
      case StepType.ReplaceHtmlStyles:
        return (
          <>
            {stepTypeNames[s.type]}:{" "}
            {"\""}<span className="font-semibold">{truncateText(s.find, 15)}</span>{"\""}
            {" -> "}
            {"\""}<span className="font-semibold">{truncateText(s.replace, 15)}</span>{"\""}
            {commonHtmlOptions}
          </>
        );
      case StepType.ReplaceTagName:
        return (
          <>
            {stepTypeNames[s.type]}:{" "}
            <span className="font-semibold">{truncateText(s.find, 15)} - {truncateText(s.replace, 15)}</span>
            {commonHtmlOptions}
          </>
        );
      case StepType.ReplaceHtmlAttributes:
        return (
          <>
            {stepTypeNames[s.type]} ({s.attributeName}):{" "}
            {"\""}<span className="font-semibold">{truncateText(s.find, 15)}</span>{"\""}
            {" -> "}
            {"\""}<span className="font-semibold">{truncateText(s.replace, 15)}</span>{"\""}
            {commonHtmlOptions}
          </>
        );
      case StepType.Uppercase:
      case StepType.Lowercase:
      case StepType.Capitalize:
      case StepType.Reverse:
      case StepType.Trim:
      case StepType.RemoveBlankLines:
      case StepType.RemoveDuplicateLines:
      case StepType.SentenceCase:
      case StepType.SwapCase:
      case StepType.RemoveExtraSpaces:
      case StepType.RemoveDiacritics:
        return stepTypeNames[s.type];
      default:
        return "Không xác định";
    }
  };

  const output = stepOutputs[index];
  const displayedOutput = truncateText(output, 20);

  const showOptions =
    step.type === StepType.FindReplace ||
    step.type === StepType.ReplaceHtmlClassName ||
    step.type === StepType.ReplaceHtmlAttributes ||
    step.type === StepType.ReplaceHtmlContent ||
    step.type === StepType.ReplaceHtmlStyles ||
    step.type === StepType.ReplaceTagName;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center border rounded px-2 py-1 bg-gray-50 group"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium flex items-center truncate">
          <div className="truncate">{renderStepDetails(step)}</div>
          {showOptions && <StepOptions caseSensitive={step.caseSensitive} useRegex={step.useRegex} />}
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