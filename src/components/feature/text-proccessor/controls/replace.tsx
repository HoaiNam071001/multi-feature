import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import I18n from "@/components/utils/I18n";
import { CaseSensitive, Regex } from "lucide-react";
import { useState } from "react";
import { StepInput, StepType, stepTypeNames } from "../handlers";

export const FindReplaceControl: React.FC<{ addStep: (step: StepInput) => void }> = ({
  addStep,
}) => {
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);

  return (
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
            type: StepType.FindReplace,
            find: findText,
            replace: replaceText,
            caseSensitive,
            useRegex,
          } as StepInput)
        }
      >
        <I18n value={stepTypeNames[StepType.FindReplace]} />
      </Button>
    </div>
  );
};
