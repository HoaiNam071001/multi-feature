
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Step, StepInput, StepType, stepTypeNames } from "./TextProccessor";
import I18n from "@/components/utils/I18n";
import { Copy, CaseSensitive, Regex } from "lucide-react";
import { useToast } from "@/hooks/useToast";

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
  const [truncateLength, setTruncateLength] = useState<string>("");
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);

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

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => addStep({ type: StepType.Uppercase } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.Uppercase]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.Lowercase } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.Lowercase]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.Capitalize } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.Capitalize]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.Reverse } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.Reverse]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.Trim } as StepInput)}>
          <I18n value={stepTypeNames[StepType.Trim]} />
        </Button>
        <Button
          onClick={() =>
            addStep({ type: StepType.RemoveBlankLines } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.RemoveBlankLines]} />
        </Button>
        <Button
          onClick={() =>
            addStep({ type: StepType.RemoveDuplicateLines } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.RemoveDuplicateLines]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.SentenceCase } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.SentenceCase]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.SwapCase } as StepInput)}
        >
          <I18n value={stepTypeNames[StepType.SwapCase]} />
        </Button>
        <Button
          onClick={() =>
            addStep({ type: StepType.RemoveExtraSpaces } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.RemoveExtraSpaces]} />
        </Button>
        <Button
          onClick={() =>
            addStep({ type: StepType.RemoveDiacritics } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.RemoveDiacritics]} />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Input
          type="number"
          value={truncateLength}
          onChange={(e) => setTruncateLength(e.target.value)}
          placeholder="Chiều dài cắt chuỗi"
          className="flex-1"
        />
        <Button
          onClick={() =>
            addStep({
              type: StepType.Truncate,
              length: parseInt(truncateLength, 10),
            } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.Truncate]} />
        </Button>
      </div>

      {/* Cụm Tìm & Thay thế được cập nhật */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          placeholder="Tìm kiếm"
          className="w-full"
        />
        <Input
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          placeholder="Thay thế bằng"
          className="w-full"
        />
        {/* Nút phân biệt chữ hoa/thường */}
        <Button
          size="icon"
          variant={caseSensitive ? "default" : "outline"}
          onClick={() => setCaseSensitive(!caseSensitive)}
          className="shrink-0"
        >
          <CaseSensitive className="w-4 h-4" />
        </Button>
        {/* Nút Regex */}
        <Button
          size="icon"
          variant={useRegex ? "default" : "outline"}
          onClick={() => setUseRegex(!useRegex)}
          className="shrink-0"
        >
          <Regex className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            addStep({
              type: StepType.FindReplace,
              find: findText,
              replace: replaceText,
              caseSensitive: caseSensitive,
              useRegex: useRegex,
            } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.FindReplace]} />
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
