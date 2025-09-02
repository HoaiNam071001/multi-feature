"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import I18n from "@/components/utils/I18n";
import {
  CaseSensitive,
  CheckCircle,
  Group,
  Regex
} from "lucide-react";
import { useState } from "react";
import { StepInput, StepType } from "../handlers";

// Component: Thay thế Thuộc tính
export const ReplaceAttributesControl: React.FC<{
  addStep: (step: StepInput) => void;
}> = ({ addStep }) => {
  const [find, setFind] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [attributeName, setAttributeName] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);

  const parseCommaSeparated = (input: string) =>
    input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          <Group className="w-4 h-4 mr-2" />
          <I18n value="Attribute" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              placeholder="Tên thuộc tính"
              className="flex-1"
            />
            <Input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Giá trị tìm kiếm"
              className="flex-1"
            />
            <Input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Thay thế"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              placeholder="Thẻ (ex: p,span)"
              className="flex-1"
            />
            <Input
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              placeholder="Class (ex: m-1,p-1)"
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={useRegex ? "default" : "outline"}
              onClick={() => setUseRegex(!useRegex)}
              className="flex-1 justify-start"
            >
              <Regex className="w-4 h-4 mr-2" />
              <I18n value="Regex" />
            </Button>
            <Button
              size="sm"
              variant={caseSensitive ? "default" : "outline"}
              onClick={() => setCaseSensitive(!caseSensitive)}
              className="flex-1 justify-start"
            >
              <CaseSensitive className="w-4 h-4 mr-2" />

              <I18n value="Phân biệt hoa thường" />
            </Button>
            <Button
              size="sm"
              variant={match ? "default" : "outline"}
              onClick={() => setMatch(!match)}
              className="flex-1 justify-start"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              <I18n value="Khớp chính xác" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() =>
                addStep({
                  type: StepType.ReplaceHtmlAttributes,
                  attributeName: attributeName,
                  find: find,
                  replace: "",
                  tagFilter: parseCommaSeparated(tagFilter),
                  classFilter: classFilter,
                  caseSensitive,
                  useRegex,
                  match,
                } as StepInput)
              }
            >
              <I18n value="Xóa" />
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                addStep({
                  type: StepType.ReplaceHtmlAttributes,
                  attributeName: attributeName,
                  find: find,
                  replace: replace,
                  tagFilter: parseCommaSeparated(tagFilter),
                  classFilter: classFilter,
                  caseSensitive,
                  useRegex,
                  match,
                } as StepInput)
              }
            >
              <I18n value="Thay thế" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
