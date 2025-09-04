// components/feature/text-proccessor/InputOutputSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import I18n from "@/components/utils/I18n";
import { Label } from "@radix-ui/react-label";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";

// =========================================================================
export const InputOutputSection: React.FC<{
  inputText: string;
  outputText: string;
  setInputText: (text: string) => void;
  handleCopy: () => void;
}> = ({ inputText, outputText, setInputText, handleCopy }) => {
  // State nội bộ để theo dõi nội dung người dùng đang gõ
  const [currentInput, setCurrentInput] = useState(inputText);

  // Đồng bộ state nội bộ với prop khi prop thay đổi từ bên ngoài (ví dụ: khi nút Clear được nhấn)
  useEffect(() => {
    setCurrentInput(inputText);
  }, [inputText]);

  // Kiểm tra xem nội dung đã thay đổi chưa
  const isChanged = currentInput !== inputText;

  const handleApply = () => {
    // Chỉ cập nhật state của component cha khi nút "Áp dụng" được nhấn
    setInputText(currentInput);
  };

  return (
    <>
      <div className="mb-4 relative">
        <Label className="mb-2" htmlFor="inputText">
          <I18n value={"Văn bản đầu vào"} />
        </Label>
        <Textarea
          id="inputText"
          value={currentInput} // Sử dụng state nội bộ
          onChange={(e) => setCurrentInput(e.target.value)} // Cập nhật state nội bộ
          className="w-full max-h-[250px] pr-12"
          rows={4}
          placeholder="Nhập văn bản của bạn tại đây..."
        />
        <div className="text-sm text-gray-600 flex justify-between">
          <span>
            <I18n value={"Ký tự"} />: {currentInput.length}
          </span>
          <span>
            <I18n value={"Từ"} />:{" "}
            {currentInput.split(/\s+/).filter((w) => w.length > 0).length}
          </span>
          <span>
            <I18n value={"Dòng"} />: {currentInput.split("\n").length}
          </span>
        </div>
        <div className="flex items-center justify-end mt-1">
          <Button className="px-2 min-h-0 z-10 h-7 rounded-sm" onClick={handleApply} disabled={!isChanged}>
          <I18n value={"Áp dụng"} />
        </Button>
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
            className="w-full bg-gray-100 pr-10 max-h-[200px]"
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
};
