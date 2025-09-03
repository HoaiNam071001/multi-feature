"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import I18n from "@/components/utils/I18n";
import { Dumbbell, Regex } from "lucide-react";
import { useState } from "react";
import { Step, StepType } from "../handlers";

// Component: Thay thế Tên Thẻ
export const ReplaceTagNameControl: React.FC<{
  addStep: (step: Step) => void;
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
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Tìm kiếm" />
              </Label>
              <Input
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="Tên thẻ tìm kiếm"
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
                placeholder="Tìm kiếm"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="mb-2">
                <I18n value="Class Name" />
              </Label>
              <Input
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                placeholder="Class"
                className="w-full"
              />
            </div>
            <div className="flex items-end">
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
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setFind("");
                setReplace("");
                setClassFilter("");
                setUseRegex(false);
              }}
            >
              <I18n value="Xóa" />
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                addStep({
                  type: StepType.ReplaceTagName,
                  options: {
                    find: find,
                    replace: replace,
                    classFilter: classFilter,
                    useRegex,
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
