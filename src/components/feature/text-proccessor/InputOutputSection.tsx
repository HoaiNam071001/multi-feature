// =========================================================================
// 1. Component con: Hiển thị Input/Output và thống kê

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import I18n from "@/components/utils/I18n";
import { Label } from "@radix-ui/react-label";
import { Copy } from "lucide-react";

// =========================================================================
export const InputOutputSection: React.FC<{
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