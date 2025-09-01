import { useState } from "react";
import { StepInput, StepType, stepTypeNames } from "../handlers";
import { Button } from "@/components/ui/button";
import I18n from "@/components/utils/I18n";
import { Input } from "@/components/ui/input";

export const TruncateControl: React.FC<{ addStep: (step: StepInput) => void }> = ({
    addStep,
  }) => {
    const [truncateLength, setTruncateLength] = useState<string>("");
  
    return (
      <div className="flex items-center gap-2 mb-3">
        <Input
          type="number"
          value={truncateLength}
          onChange={(e) => setTruncateLength(e.target.value)}
          placeholder="Chiều dài cắt chuỗi"
          className="flex-1"
        />
        <Button
          onClick={() =>
            addStep({
              type: StepType.Truncate,
              length: parseInt(truncateLength, 10),
            } as StepInput)
          }
        >
          <I18n value={stepTypeNames[StepType.Truncate]} />
        </Button>
      </div>
    );
  };
  