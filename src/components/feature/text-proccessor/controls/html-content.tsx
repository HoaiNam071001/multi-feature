"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import I18n from "@/components/utils/I18n";
import { Label } from "@radix-ui/react-label";
import {
  CaseLower,
  CaseSensitive,
  CheckCircle,
  MemoryStick,
  Regex,
} from "lucide-react";
import { useState } from "react";
import { Step, StepType } from "../handlers";

// Component: Thay thế Nội dung
export const ReplaceContentControl: React.FC<{
  addStep: (step: Step) => void;
}> = ({ addStep }) => {
  const [find, setFind] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);

  const parseCommaSeparated = (input: string) =>
    input
      .split(" ")
      .map((s) => s.trim())
      .filter((s) => s);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          <MemoryStick className="w-4 h-4 mr-2" />
          <I18n value="Content" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Tìm kiếm" />
              </Label>
              <Input
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="Nội dung tìm kiếm"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Thay thế" />
              </Label>
              <Input
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="Thay thế"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Lọc Thẻ" />
              </Label>
              <Input
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="Thẻ (ex: h1 h2)"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Lọc class" />
              </Label>
              <Input
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                placeholder="Class (ex: class1 class2)"
                className="w-full"
              />
            </div>
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
              {caseSensitive ? (
                <CaseSensitive className="w-4 h-4 mr-2" />
              ) : (
                <CaseLower className="w-4 h-4 mr-2" />
              )}
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
              onClick={() => {
                setFind("");
                setReplace("");
                setTagFilter("");
                setClassFilter("");
                setCaseSensitive(false);
                setUseRegex(false);
                setMatch(false);
              }}
            >
              <I18n value="Xóa" />
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                addStep({
                  type: StepType.ReplaceHtmlContent,
                  options: {
                    find: find,
                    replace: replace,
                    tagFilter: parseCommaSeparated(tagFilter),
                    classFilter: classFilter,
                    caseSensitive,
                    useRegex,
                    match,
                  },
                } as Step)
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
