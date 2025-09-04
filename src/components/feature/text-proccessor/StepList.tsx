// components/feature/text-proccessor/StepList.tsx
"use client";

import { Button } from "@/components/ui/button";
import I18n from "@/components/utils/I18n";
import {
  CaseSensitive,
  CheckCircle,
  GripVertical,
  Regex,
  X,
} from "lucide-react";
import React from "react";
import {
  BaseHtmlOptions,
  FindReplaceOptions,
  ReplaceHtmlAttributesOptions,
  StepItem,
  StepType,
  TruncateOptions,
  stepTypeNames,
} from "./handlers";

import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResultPopup } from "./ResultPopup";

interface StepListProps {
  steps: StepItem[];
  removeStep: (index: number) => void;
  reorderSteps: (newSteps: StepItem[]) => void;
}

interface SortableItemProps {
  step: StepItem;
  index: number;
  removeStep: (index: number) => void;
}

// =============================
// Hiển thị icon case/regex
// =============================
const StepOptions: React.FC<{
  caseSensitive?: boolean;
  useRegex?: boolean;
  match?: boolean;
}> = ({ caseSensitive, useRegex, match }) => (
  <div className="flex items-center gap-1 ml-2">
    {caseSensitive && (
      <div
        className={`bg-gray-300 text-gray-700 px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1`}
      >
        <CaseSensitive className="w-3 h-3" />
      </div>
    )}
    {useRegex && (
      <div className="bg-gray-300 text-gray-700 px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1">
        <Regex className="w-3 h-3" />
      </div>
    )}
    {match && (
      <div className="bg-gray-300 text-gray-700 px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
      </div>
    )}
  </div>
);

const HtmlTitle = ({ step, title }: { step: StepItem; title?: string }) => {
  const opts = step.options as BaseHtmlOptions;

  return (
    <div className="flex items-center">
      <span>
        {stepTypeNames[step.type]} {title}
      </span>

      <StepOptions
        caseSensitive={opts.caseSensitive}
        useRegex={opts.useRegex}
        match={opts.match}
      />
      <Badge className="ml-auto" variant="default">
        html
      </Badge>
    </div>
  );
};
// =============================
// Item có thể kéo thả
// =============================
const SortableItem: React.FC<SortableItemProps> = ({
  step,
  index,
  removeStep,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderStepDetails = (s: StepItem) => {
    switch (s.type) {
      case StepType.Truncate: {
        const opts = s.options as TruncateOptions;
        return (
          <span>
            {stepTypeNames[s.type]} ({opts.length})
          </span>
        );
      }
      case StepType.FindReplace: {
        const opts = s.options as FindReplaceOptions;
        return (
          <span>
            {stepTypeNames[s.type]}: {'"'}
            {opts.find}
            {'"'} → {'"'}
            {opts.replace}
            {'"'}
            <StepOptions
              caseSensitive={opts.caseSensitive}
              useRegex={opts.useRegex}
            />
          </span>
        );
      }
      case StepType.ReplaceHtmlClassName: {
        const opts = s.options as BaseHtmlOptions;
        return (
          <div>
            <HtmlTitle step={step} />
            <div className="truncate">
              {'."'}
              {opts.find}
              {'"'} → {'."'}
              {opts.replace}
              {'"'}({"<"}
              {opts.tagFilter?.join(", ")}
              {">"} )
            </div>
          </div>
        );
      }
      case StepType.ReplaceHtmlContent: {
        const opts = s.options as BaseHtmlOptions;
        return (
          <div>
            <HtmlTitle step={step} />
            <div className="truncate">
              {'"'}
              {opts.find}
              {'"'} → {'"'}
              {opts.replace}
              {'"'}
              (.{'"'}
              {opts.classFilter}
              {'"'}, {"<"}
              {opts.tagFilter?.join(", ")}
              {">"} )
            </div>
          </div>
        );
      }
      case StepType.ReplaceHtmlStyles: {
        const opts = s.options as BaseHtmlOptions;
        return (
          <div>
            <HtmlTitle step={step} />
            <div className="truncate">
              {'"'}
              {opts.find}
              {'"'} → {'"'}
              {opts.replace}
              {'"'}
            </div>
          </div>
        );
      }
      case StepType.ReplaceHtmlAttributes: {
        const opts = s.options as ReplaceHtmlAttributesOptions;
        return (
          <div>
            <HtmlTitle step={step} title={`[${opts.attributeName}]`} />
            <div className="truncate">
              {opts.find}
              {'"'} → {'"'}
              {opts.replace}
              {'" '}
              (.{'"'}
              {opts.classFilter}
              {'"'}, {"<"}
              {opts.tagFilter?.join(", ")}
              {">"} )
            </div>
          </div>
        );
      }
      case StepType.ReplaceTagName: {
        const opts = s.options as BaseHtmlOptions;
        return (
          <div>
            <HtmlTitle step={step} />
            <div className="truncate">
              {"<"}
              {opts.find}
              {">"} → {"<"}
              {opts.replace}
              {"> "}
              (.{'"'}
              {opts.classFilter}
              {'"'})
            </div>
          </div>
        );
      }
      default:
        return <span>{stepTypeNames[s.type]}</span>;
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="relative flex items-start border rounded-lg pl-3 py-2 bg-gray-50 group h-[60px]"
    >
      {/* Drag handle */}
      <button
        {...listeners}
        {...attributes}
        className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mr-2"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="absolute left-3 bottom-0 opacity-0 group-hover:opacity-100 duration-300">
        <ResultPopup step={step} />
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{renderStepDetails(step)}</div>
      </div>

      {/* Nút xoá */}
      <div className="flex items-start px-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeStep(index)}
          className="h-[25px] w-[25px] p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
};

// =============================
// Danh sách Step
// =============================
const StepList: React.FC<StepListProps> = ({
  steps,
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
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default StepList;
