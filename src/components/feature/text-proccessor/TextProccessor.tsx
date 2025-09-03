// app/page.tsx

"use client";

import StepList from "@/components/feature/text-proccessor/StepList";
import React, { useMemo, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { ControlPanel } from "./ControlPanel";
import { processStep, Step, StepItem } from "./handlers";

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [steps, setSteps] = useState<StepItem[]>([]);

  const addStep = (step: Step) => {
    const newStep: StepItem = { ...step, id: uuidv4() };
    setSteps((prev) => [...prev, newStep]);
  };

  const removeStep = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  const reorderSteps = (newSteps: StepItem[]) => {
    setSteps(newSteps);
  };

  const stepOutputs = useMemo(() => {
    const outputs: string[] = [];
    let currentText = inputText;
  
    for (const step of steps) {
      currentText = processStep(currentText, step);
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