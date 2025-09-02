"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import I18n from "@/components/utils/I18n";
import { useToast } from "@/hooks/useToast";
import React from "react";
import { ReplaceAttributesControl } from "./controls/html-attribute";
import { ReplaceClassNameControl } from "./controls/html-class";
import { ReplaceContentControl } from "./controls/html-content";
import { ReplaceStylesControl } from "./controls/html-style";
import { ReplaceTagNameControl } from "./controls/html-tag";
import { FindReplaceControl } from "./controls/replace";
import { TruncateControl } from "./controls/truncate";
import { StepInput, StepType, stepTypeNames } from "./handlers";
import { InputOutputSection } from "./InputOutputSection";

// =========================================================================
// Component con: Nhóm các nút xử lý văn bản cơ bản
// =========================================================================
const TextButtons: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => (
  <div className="grid grid-cols-2 gap-2 mb-4">
    {[
      StepType.Uppercase,
      StepType.Lowercase,
      StepType.Capitalize,
      StepType.Reverse,
      StepType.Trim,
      StepType.RemoveBlankLines,
      StepType.RemoveDuplicateLines,
      StepType.SentenceCase,
      StepType.SwapCase,
      StepType.RemoveExtraSpaces,
      StepType.RemoveDiacritics,
    ].map((type) => (
      <Button
        key={type}
        onClick={() => addStep({ type } as StepInput)}
        variant="outline"
        
      >
        <I18n value={stepTypeNames[type]} />
      </Button>
    ))}
  </div>
);

// =========================================================================
// Component con: Nhóm các control xử lý HTML
// =========================================================================
const HtmlControlPanel: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => (
  <div className="flex flex-wrap gap-3">
    <ReplaceTagNameControl addStep={addStep} />
    <ReplaceStylesControl addStep={addStep} />
    <ReplaceAttributesControl addStep={addStep} />
    <ReplaceClassNameControl addStep={addStep} />
    <ReplaceContentControl addStep={addStep} />
  </div>
);

// =========================================================================
// Component con: Nhóm các control xử lý Text
// =========================================================================
const TextControlPanel: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => (
  <div className="space-y-4">
    <TextButtons addStep={addStep} />
    <TruncateControl addStep={addStep} />
    <FindReplaceControl addStep={addStep} />
  </div>
);

// =========================================================================
// Component chính: ControlPanel
// =========================================================================
interface ControlPanelProps {
  inputText: string;
  outputText: string;
  setInputText: (text: string) => void;
  addStep: (step: StepInput) => void;
  handleClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  inputText,
  outputText,
  setInputText,
  addStep,
  handleClear,
}) => {
  const toast = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Đã sao chép văn bản thành công!");
  };

  return (
    <div>
      <div className="text-xl font-bold mb-4 flex items-center">
        <I18n value="Điều khiển" />
        <Button variant="destructive" className="ml-auto" onClick={handleClear}>
          <I18n value="Xóa tất cả" />
        </Button>
      </div>
      <InputOutputSection
        inputText={inputText}
        outputText={outputText}
        setInputText={setInputText}
        handleCopy={handleCopy}
      />
      <Tabs defaultValue="text" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="text">
            <I18n value="Text" />
          </TabsTrigger>
          <TabsTrigger value="html">
            <I18n value="HTML" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextControlPanel addStep={addStep} />
        </TabsContent>
        <TabsContent value="html">
          <HtmlControlPanel addStep={addStep} />
        </TabsContent>
      </Tabs>
    </div>
  );
};