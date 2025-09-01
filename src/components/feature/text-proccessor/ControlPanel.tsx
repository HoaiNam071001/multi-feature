// components/feature/text-proccessor/ControlPanel.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Step, StepInput, StepType, stepTypeNames } from "./TextProccessor";
import I18n from "@/components/utils/I18n";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/useToast"; // Import hook mới tạo

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
  const [charsToRemove, setCharsToRemove] = useState<string>("");
  const [truncateLength, setTruncateLength] = useState<string>("");
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [prefix, setPrefix] = useState<string>(""); // State cho tiền tố
  const [suffix, setSuffix] = useState<string>(""); // State cho hậu tố
  const showToast = useToast(); // Gọi hook useToast
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
            className="w-full bg-gray-100 pr-10" // Thêm padding-right để tránh nội dung bị che
            rows={4}
          />
          <Button
            size="icon" // Kích thước nhỏ hơn cho icon
            variant="ghost" // Loại bỏ nền
            className="absolute top-2 right-2" // Đặt vị trí tuyệt đối
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4" /> {/* Icon copy */}
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

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => addStep({ type: StepType.Uppercase })}>
          <I18n value={stepTypeNames[StepType.Uppercase]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.Lowercase })}>
          <I18n value={stepTypeNames[StepType.Lowercase]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.Capitalize })}>
          <I18n value={stepTypeNames[StepType.Capitalize]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.Reverse })}>
          <I18n value={stepTypeNames[StepType.Reverse]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.Trim })}>
          <I18n value={stepTypeNames[StepType.Trim]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.RemoveBlankLines })}>
          <I18n value={stepTypeNames[StepType.RemoveBlankLines]} />
        </Button>
        <Button
          onClick={() => addStep({ type: StepType.RemoveDuplicateLines })}
        >
          <I18n value={stepTypeNames[StepType.RemoveDuplicateLines]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.SentenceCase })}>
          <I18n value={stepTypeNames[StepType.SentenceCase]} />
        </Button>
        {/* Thêm các nút mới */}
        <Button onClick={() => addStep({ type: StepType.SwapCase })}>
          <I18n value={stepTypeNames[StepType.SwapCase]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.RemoveExtraSpaces })}>
          <I18n value={stepTypeNames[StepType.RemoveExtraSpaces]} />
        </Button>
        <Button onClick={() => addStep({ type: StepType.RemoveDiacritics })}>
          <I18n value={stepTypeNames[StepType.RemoveDiacritics]} />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Input
          value={charsToRemove}
          onChange={(e) => setCharsToRemove(e.target.value)}
          placeholder="Ký tự cần xóa"
          className="flex-1"
        />
        <Button
          onClick={() =>
            addStep({
              type: StepType.RemoveChars,
              chars: charsToRemove,
            } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.RemoveChars]} />
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
        <Button
          onClick={() =>
            addStep({
              type: StepType.FindReplace,
              find: findText,
              replace: replaceText,
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
