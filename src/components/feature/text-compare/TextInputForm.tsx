"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import I18n from "@/components/utils/I18n";
import { Dispatch, SetStateAction } from "react";

interface TextInputFormProps {
  text1: string;
  text2: string;
  setText1: Dispatch<SetStateAction<string>>;
  setText2: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
}

export const TextInputForm = ({
  text1,
  text2,
  setText1,
  setText2,
  onSubmit,
}: TextInputFormProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Input cho văn bản 1 */}
      <div>
        <label className="font-semibold block mb-2">
          <I18n value="Văn bản 1" />
        </label>
        <Textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="Nhập văn bản đầu tiên..."
          className="w-full h-40"
        />
      </div>

      {/* Input cho văn bản 2 */}
      <div>
        <label className="font-semibold block mb-2">
          <I18n value="Văn bản 2" />
        </label>
        <Textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="Nhập văn bản thứ hai..."
          className="w-full h-40"
        />
      </div>

      {/* Nút Submit */}
      <div>
        <Button onClick={onSubmit} disabled={!text1 || !text2}>
          <I18n value="So sánh" />
        </Button>
      </div>
    </div>
  );
};
