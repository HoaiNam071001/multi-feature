"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

enum StepType {
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Capitalize = "capitalize",
  RemoveChars = "removeChars",
  Reverse = "reverse",
  Trim = "trim",
  Truncate = "truncate",
}

type Step =
  | { type: StepType.Uppercase }
  | { type: StepType.Lowercase }
  | { type: StepType.Capitalize }
  | { type: StepType.RemoveChars; chars: string }
  | { type: StepType.Reverse }
  | { type: StepType.Trim }
  | { type: StepType.Truncate; length: number };

const TextProcessorPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [charsToRemove, setCharsToRemove] = useState<string>("");
  const [truncateLength, setTruncateLength] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = (step: Step) => setSteps((prev) => [...prev, step]);

  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  const stepOutputs = useMemo(() => {
    const outputs: string[] = [];
    let currentText = inputText;

    for (const step of steps) {
      switch (step.type) {
        case StepType.Uppercase:
          currentText = currentText.toUpperCase();
          break;
        case StepType.Lowercase:
          currentText = currentText.toLowerCase();
          break;
        case StepType.Capitalize:
          currentText = currentText.replace(/(^|\s)\w/g, (letter) =>
            letter.toUpperCase()
          );
          break;
        case StepType.RemoveChars:
          if (step.chars) {
            const escaped = step.chars.replace(
              /[-[\]{}()*+?.,\\^$|#\s]/g,
              "\\$&"
            );
            const regex = new RegExp(`[${escaped}]`, "g");
            currentText = currentText.replace(regex, "");
          } else {
            currentText = currentText.replace(/[^a-zA-Z0-9\s]/g, "");
          }
          break;
        case StepType.Reverse:
          currentText = currentText.split("").reverse().join("");
          break;
        case StepType.Trim:
          currentText = currentText.trim();
          break;
        case StepType.Truncate:
          if (!isNaN(step.length) && step.length > 0) {
            currentText = currentText.slice(0, step.length);
          }
          break;
      }
      outputs.push(currentText);
    }
    return outputs;
  }, [inputText, steps]);

  const outputText = stepOutputs.length > 0 ? stepOutputs[stepOutputs.length - 1] : inputText;

  const handleClear = () => {
    setInputText("");
    setSteps([]);
    setCharsToRemove("");
    setTruncateLength("");
  };

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Steps list */}
        <div>
          <h2 className="text-xl font-bold mb-4">Processing Steps</h2>
          {steps.length === 0 && (
            <p className="text-gray-500 text-sm">No steps added yet</p>
          )}
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li
                key={index}
                className="flex justify-between items-center border rounded p-2 bg-gray-50"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate">
                      {step.type === StepType.RemoveChars
                        ? `Remove chars: "${step.chars}"`
                        : step.type === StepType.Truncate
                        ? `Truncate (${step.length})`
                        : step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs break-words">
                    {stepOutputs[index] || inputText}
                  </TooltipContent>
                </Tooltip>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeStep(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Inputs & Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Controls</h2>

          <div className="mb-4">
            <Label htmlFor="inputText">Input Text</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full"
              rows={4}
              placeholder="Enter your text here..."
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="outputText">Output Text</Label>
            <Textarea
              id="outputText"
              value={outputText}
              readOnly
              className="w-full bg-gray-100"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => addStep({ type: StepType.Uppercase })}>
              Uppercase
            </Button>
            <Button onClick={() => addStep({ type: StepType.Lowercase })}>
              Lowercase
            </Button>
            <Button onClick={() => addStep({ type: StepType.Capitalize })}>
              Capitalize
            </Button>
            <Button onClick={() => addStep({ type: StepType.Reverse })}>
              Reverse
            </Button>
            <Button onClick={() => addStep({ type: StepType.Trim })}>
              Trim Whitespace
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Input
              value={charsToRemove}
              onChange={(e) => setCharsToRemove(e.target.value)}
              placeholder="Chars to remove"
              className="flex-1"
            />
            <Button
              onClick={() =>
                addStep({ type: StepType.RemoveChars, chars: charsToRemove })
              }
            >
              Remove Chars
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Input
              type="number"
              value={truncateLength}
              onChange={(e) => setTruncateLength(e.target.value)}
              placeholder="Truncate length"
              className="flex-1"
            />
            <Button
              onClick={() =>
                addStep({
                  type: StepType.Truncate,
                  length: parseInt(truncateLength, 10),
                })
              }
            >
              Truncate
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(outputText)}
            >
              Copy Output
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TextProcessorPage;