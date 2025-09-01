"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepInput, StepType, stepTypeNames } from "./handlers";
import I18n from "@/components/utils/I18n";
import { Copy, CaseSensitive, Regex, CaseLower } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { ReplaceAttributesControl } from "./controls/html-attribute";
import { ReplaceStylesControl } from "./controls/html-style";
import { ReplaceClassNameControl } from "./controls/html-class";
import { ReplaceContentControl } from "./controls/html-content";
import { TruncateControl } from "./controls/truncate";
import { FindReplaceControl } from "./controls/replace";

// =========================================================================
// 1. Component con: Hiển thị Input/Output và thống kê
// =========================================================================
const InputOutputSection: React.FC<{
  inputText: string;
  outputText: string;
  setInputText: (text: string) => void;
  handleCopy: () => void;
}> = ({ inputText, outputText, setInputText, handleCopy }) => (
  <>
    <div className="mb-4">
      <Label className="mb-2" htmlFor="inputText">
        <I18n value={"Văn bản đầu vào"} />
      </Label>
      <Textarea
        id="inputText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full"
        rows={4}
        placeholder="Nhập văn bản của bạn tại đây..."
      />
      <div className="text-sm text-gray-600 flex justify-between">
        <span>
          <I18n value={"Ký tự"} />: {inputText.length}
        </span>
        <span>
          <I18n value={"Từ"} />:{" "}
          {inputText.split(/\s+/).filter((w) => w.length > 0).length}
        </span>
        <span>
          <I18n value={"Dòng"} />: {inputText.split("\n").length}
        </span>
      </div>
    </div>

    <div className="mb-4">
      <Label className="mb-2" htmlFor="outputText">
        <I18n value={"Văn bản đầu ra"} />
      </Label>
      <div className="relative">
        <Textarea
          id="outputText"
          value={outputText}
          readOnly
          className="w-full bg-gray-100 pr-10"
          rows={4}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-600 flex justify-between">
        <span>
          <I18n value={"Ký tự"} />: {outputText.length}
        </span>
        <span>
          <I18n value={"Từ"} />:{" "}
          {outputText.split(/\s+/).filter((w) => w.length > 0).length}
        </span>
        <span>
          <I18n value={"Dòng"} />: {outputText.split("\n").length}
        </span>
      </div>
    </div>
  </>
);

// =========================================================================
// 2. Component con: Nhóm các nút xử lý văn bản cơ bản
// =========================================================================
const TextButtons: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => (
  <div className="flex flex-wrap gap-2 mb-4">
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
      <Button key={type} onClick={() => addStep({ type } as StepInput)}>
        <I18n value={stepTypeNames[type]} />
      </Button>
    ))}
  </div>
);

// =========================================================================
// Component chính: HtmlControlPanel
// =========================================================================
const HtmlControlPanel: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => (
  <>
    <h3 className="text-lg font-semibold mt-6 mb-2">
      <I18n value="Xử lý HTML" />
    </h3>
    <ReplaceStylesControl addStep={addStep} />
    <ReplaceAttributesControl addStep={addStep} />
    <ReplaceClassNameControl addStep={addStep} />
    <ReplaceContentControl addStep={addStep} />
  </>
);

// =========================================================================
// Component chính: ControlPanel (chỉ render các component con)
// =========================================================================
interface ControlPanelProps {
  inputText: string;
  outputText: string;
  setInputText: (text: string) => void;
  addStep: (step: StepInput) => void;
  handleClear: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  inputText,
  outputText,
  setInputText,
  addStep,
  handleClear,
}) => {
  const showToast = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    showToast.success("Đã sao chép văn bản thành công!");
  };

  return (
    <div>
      <div className="text-xl font-bold mb-4 flex items-center">
        <I18n value={"Điều khiển"} />
        <Button variant="destructive" className="ml-auto" onClick={handleClear}>
          <I18n value={"Xóa tất cả"} />
        </Button>
      </div>
      <InputOutputSection
        inputText={inputText}
        outputText={outputText}
        setInputText={setInputText}
        handleCopy={handleCopy}
      />
      <TextButtons addStep={addStep} />
      <TruncateControl addStep={addStep} />
      <FindReplaceControl addStep={addStep} />
      <HtmlControlPanel addStep={addStep} />
    </div>
  );
};

export default ControlPanel;