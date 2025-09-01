// components/feature/text-proccessor/StepList.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Step, StepType, stepTypeNames } from "./TextProccessor";
import I18n from "@/components/utils/I18n";

interface StepListProps {
  steps: Step[];
  stepOutputs: string[];
  removeStep: (index: number) => void;
}

const StepList: React.FC<StepListProps> = ({
  steps,
  stepOutputs,
  removeStep,
}) => {
  const getStepName = (step: Step) => {
    switch (step.type) {
      case StepType.RemoveChars:
        return `${stepTypeNames[step.type]}: "${step.chars}"`;
      case StepType.Truncate:
        return `${stepTypeNames[step.type]} (${step.length})`;
      case StepType.FindReplace:
        return `${stepTypeNames[step.type]} "${step.find}" & "${step.replace}"`;
      default:
        return stepTypeNames[step.type] || "Không xác định";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        <I18n value="Các bước xử lý" />
      </h2>
      {steps.length === 0 && (
        <p className="text-gray-500 text-sm">
          <I18n value="Chưa có bước nào được thêm" />
        </p>
      )}
      <ul className="space-y-2">
        {steps.map((step, index) => {
          const stepName = getStepName(step);
          const output = stepOutputs[index];
          const displayedOutput = truncateText(output, 20);

          return (
            <li
              key={index}
              className="flex justify-between items-center border rounded px-2 py-1 bg-gray-50"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="font-medium mr-2">{stepName}</div>
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeStep(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepList;