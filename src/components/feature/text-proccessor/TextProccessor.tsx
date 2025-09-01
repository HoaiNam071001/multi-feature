"use client";

import React, { useState, useMemo } from "react";
import StepList from "@/components/feature/text-proccessor/StepList";
import ControlPanel from "@/components/feature/text-proccessor/ControlPanel";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Định nghĩa lại StepType và Step
export enum StepType {
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Capitalize = "capitalize",
  RemoveChars = "removeChars",
  Reverse = "reverse",
  Trim = "trim",
  Truncate = "truncate",
  FindReplace = "findReplace", // Thêm vào đây
  Count = "count",
  RemoveBlankLines = "removeBlankLines",
  RemoveDuplicateLines = "removeDuplicateLines",
  SentenceCase = "sentenceCase",
  SwapCase = "swapCase",
  RemoveExtraSpaces = "removeExtraSpaces",
  RemoveDiacritics = "removeDiacritics",
}

// Cập nhật kiểu Step cho FindReplace
export type Step =
  | { id: string; type: StepType.Uppercase }
  | { id: string; type: StepType.Lowercase }
  | { id: string; type: StepType.Capitalize }
  | { id: string; type: StepType.RemoveChars; chars: string }
  | { id: string; type: StepType.Reverse }
  | { id: string; type: StepType.Trim }
  | { id: string; type: StepType.Truncate; length: number }
  | { id: string; type: StepType.FindReplace; find: string; replace: string; caseSensitive: boolean } // Thêm caseSensitive
  | { id: string; type: StepType.RemoveBlankLines }
  | { id: string; type: StepType.RemoveDuplicateLines }
  | { id: string; type: StepType.SentenceCase }
  | { id: string; type: StepType.SwapCase }
  | { id: string; type: StepType.RemoveExtraSpaces }
  | { id: string; type: StepType.RemoveDiacritics };

export const stepTypeNames: { [key in StepType]: string } = {
  [StepType.Uppercase]: "In hoa",
  [StepType.Lowercase]: "In thường",
  [StepType.Capitalize]: "Viết hoa đầu từ",
  [StepType.RemoveChars]: "Xóa ký tự",
  [StepType.Reverse]: "Đảo ngược",
  [StepType.Trim]: "Xóa khoảng trắng",
  [StepType.Truncate]: "Cắt chuỗi",
  [StepType.FindReplace]: "Thay thế",
  [StepType.Count]: "Đếm",
  [StepType.RemoveBlankLines]: "Xóa dòng trống",
  [StepType.RemoveDuplicateLines]: "Xóa dòng trùng lặp",
  [StepType.SentenceCase]: "Viết hoa câu",
  [StepType.SwapCase]: "Đảo ngược chữ hoa/thường",
  [StepType.RemoveExtraSpaces]: "Xóa khoảng trắng thừa",
  [StepType.RemoveDiacritics]: "Loại bỏ dấu",
};

export type StepInput = Omit<Step, 'id'>;

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = (step: StepInput) => {
    const newStep: Step = { ...step, id: `step-${Date.now()}-${Math.random()}` } as Step;
    setSteps((prev) => [...prev, newStep]);
  };

  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  const reorderSteps = (newSteps: Step[]) => {
    setSteps(newSteps);
  };

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
        case StepType.FindReplace:
          const flags = step.caseSensitive ? 'g' : 'gi'; // Thêm cờ 'i' (case-insensitive)
          currentText = currentText.replace(
            new RegExp(step.find, flags),
            step.replace
          );
          break;
        case StepType.RemoveBlankLines:
          currentText = currentText
            .split("\n")
            .filter((line) => line.trim() !== "")
            .join("\n");
          break;
        case StepType.RemoveDuplicateLines:
          const lines = currentText.split("\n");
          currentText = [...new Set(lines)].join("\n");
          break;
        case StepType.SentenceCase:
          currentText = currentText
            .toLowerCase()
            .replace(/(^\s*\w|[.?!]\s*\w)/g, (c) => c.toUpperCase());
          break;
        case StepType.SwapCase:
          currentText = currentText
            .split("")
            .map((char) => {
              if (char === char.toUpperCase()) {
                return char.toLowerCase();
              }
              return char.toUpperCase();
            })
            .join("");
          break;
        case StepType.RemoveExtraSpaces:
          currentText = currentText.replace(/\s+/g, " ").trim();
          break;
        case StepType.RemoveDiacritics:
          currentText = currentText
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          break;
        default:
      }
      outputs.push(currentText);
    }
    return outputs;
  }, [inputText, steps]);

  const outputText =
    stepOutputs.length > 0 ? stepOutputs[stepOutputs.length - 1] : inputText;

  const handleClear = () => {
    setInputText("");
    setSteps([]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8">
        <ControlPanel
          inputText={inputText}
          outputText={outputText}
          setInputText={setInputText}
          addStep={addStep}
          handleClear={handleClear}
        />
      </div>
      <div className="md:col-span-4">
        <StepList
          steps={steps}
          stepOutputs={stepOutputs}
          removeStep={removeStep}
          reorderSteps={reorderSteps}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default TextProcessor;