"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import I18n from "@/components/utils/I18n";
import { match } from "assert";
import { Dumbbell, Regex } from "lucide-react";
import { useState } from "react";
import { StepInput, StepType } from "../handlers";

// Component: Thay thế Tên Thẻ
export const ReplaceTagNameControl: React.FC<{
  addStep: (step: StepInput) => void;
}> = ({ addStep }) => {
  const [find, setFind] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [useRegex, setUseRegex] = useState<boolean>(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          <Dumbbell className="w-4 h-4 mr-2" />
          <I18n value="Tag" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Tên thẻ tìm kiếm"
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
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              placeholder="Class (ex: m-1 p-1)"
              className="flex-1"
            />
            <Button
              size="sm"
              variant={useRegex ? "default" : "outline"}
              onClick={() => setUseRegex(!useRegex)}
              className="justify-start"
            >
              <Regex className="w-4 h-4 mr-2" />
              <I18n value="Regex" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() =>
                addStep({
                  type: StepType.ReplaceTagName,
                  find: find,
                  replace: "",
                  classFilter: classFilter,
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
                  type: StepType.ReplaceTagName,
                  find: find,
                  replace: replace,
                  classFilter: classFilter,
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
