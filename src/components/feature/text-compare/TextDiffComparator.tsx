"use client";

import { useState } from "react";
import { DiffViewerTabs } from "./DiffResult";
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
      <DiffViewerTabs text1={options.text1} text2={options.text2} />
    </div>
  );
};

export default TextDiffComparator;
