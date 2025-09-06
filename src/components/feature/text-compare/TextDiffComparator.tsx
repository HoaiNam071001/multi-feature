"use client";

import I18n from "@/components/utils/I18n";
import {
    useDiffViewer,
    useDiffViewerCompareByLine,
} from "@/hooks/useDiffViewer";
import { useState } from "react";
import { DiffResult } from "./DiffResult";
import { TextInputForm } from "./TextInputForm";

// Interface cho các tùy chọn so sánh
interface CompareOptions {
  caseSensitive?: boolean;
  useRegex?: boolean;
  text1: string;
  text2: string;
}

const TextDiffComparator = () => {
  const [text1, setText1] = useState<string>("");
  const [text2, setText2] = useState<string>("");
  const [options, setOptions] = useState<CompareOptions>({
    text1: "",
    text2: "",
  });
  const { diffHtml } = useDiffViewer(options.text1, options.text2);
  const { oldHtml, newHtml } = useDiffViewerCompareByLine(
    options.text1,
    options.text2
  );

  const handleSubmit = () => {
    setOptions({
      text1,
      text2,
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <TextInputForm
        text1={text1}
        text2={text2}
        setText1={setText1}
        setText2={setText2}
        onSubmit={handleSubmit}
      />
      <DiffResult diffHtml={diffHtml} />

      <div className="mt-4 flex gap-4">
        <div className="w-1/2">
          <h3 className="font-semibold">
            <I18n value="Văn bản cũ" />
          </h3>
          <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-64">
            <pre
              className="whitespace-pre-wrap font-sans"
              dangerouslySetInnerHTML={{ __html: oldHtml }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <h3 className="font-semibold">
            <I18n value="Văn bản mới" />
          </h3>
          <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-64">
            <pre
              className="whitespace-pre-wrap font-sans"
              dangerouslySetInnerHTML={{ __html: newHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextDiffComparator;
