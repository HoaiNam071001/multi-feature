"use client";

import { useState } from "react";
import { StepInput, StepType, stepTypeNames } from "../handlers";
import { Input } from "@/components/ui/input";
import { CaseLower, CaseSensitive, Regex } from "lucide-react";
import { Button } from "@/components/ui/button";
import I18n from "@/components/utils/I18n";

// Component: Thay thế Nội dung
export const ReplaceContentControl: React.FC<{
    addStep: (step: StepInput) => void;
  }> = ({ addStep }) => {
    const [htmlFindText, setHtmlFindText] = useState<string>("");
    const [htmlReplaceText, setHtmlReplaceText] = useState<string>("");
    const [tagFilter, setTagFilter] = useState<string>("");
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
    const [useRegex, setUseRegex] = useState<boolean>(false);
  
    const parseCommaSeparated = (input: string) =>
      input
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
  
    return (
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={htmlFindText}
          onChange={(e) => setHtmlFindText(e.target.value)}
          placeholder="Nội dung"
          className="flex-1"
        />
        <Input
          value={htmlReplaceText}
          onChange={(e) => setHtmlReplaceText(e.target.value)}
          placeholder="Thay thế"
          className="flex-1"
        />
        <Input
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Thẻ"
          className="flex-1"
        />
        <Button
          size="icon"
          variant={caseSensitive ? "default" : "outline"}
          onClick={() => setCaseSensitive(!caseSensitive)}
          className="shrink-0"
        >
            <CaseSensitive className="w-4 h-4" />
  
        </Button>
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
              type: StepType.ReplaceHtmlContent,
              find: htmlFindText,
              replace: htmlReplaceText,
              tagFilter: parseCommaSeparated(tagFilter),
              caseSensitive,
              useRegex,
            } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.ReplaceHtmlContent]} />
        </Button>
      </div>
    );
  };