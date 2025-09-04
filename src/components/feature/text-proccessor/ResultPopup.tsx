// components/feature/text-proccessor/ResultPopup.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import I18n from "@/components/utils/I18n";
import { useDiffViewer } from "@/hooks/useDiffViewer";
import { CaseSensitive, CheckCircle, Eye, Regex } from "lucide-react";
import {
  BaseHtmlOptions,
  FindReplaceOptions,
  ReplaceHtmlAttributesOptions,
  StepItem,
  StepType,
  stepTypeNames,
  TruncateOptions,
} from "./handlers";

// Component con để hiển thị các tùy chọn (Case/Regex/Match)
const StepOptions = ({
  caseSensitive,
  useRegex,
  match,
}: {
  caseSensitive?: boolean;
  useRegex?: boolean;
  match?: boolean;
}) => (
  <div className="flex items-center gap-2 justify-between">
    {caseSensitive && (
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <CaseSensitive className="w-4 h-4" />
        <I18n value="Phân biệt chữ hoa/thường" />
      </span>
    )}
    {useRegex && (
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <Regex className="w-4 h-4" />
        <I18n value="Sử dụng Regex" />
      </span>
    )}
    {match && (
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <CheckCircle className="w-4 h-4" />
        <I18n value="Chỉ so khớp" />
      </span>
    )}
  </div>
);

// Component chính
export const ResultPopup = ({ step }: { step: StepItem }) => {
  const { diffHtml } = useDiffViewer(step.input || "", step.output || "");

  const renderDetails = (s: StepItem) => {
    switch (s.type) {
      case StepType.Truncate: {
        const opts = s.options as TruncateOptions;
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                <I18n value="Độ dài" />:
              </span>
              <span>{opts.length}</span>
            </div>
          </>
        );
      }
      case StepType.FindReplace: {
        const opts = s.options as FindReplaceOptions;
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                <I18n value="Tìm kiếm" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.find}
              </code>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Thay thế" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.replace}
              </code>
            </div>
            <div className="mt-2">
              <StepOptions
                caseSensitive={opts.caseSensitive}
                useRegex={opts.useRegex}
              />
            </div>
          </>
        );
      }
      case StepType.ReplaceHtmlClassName:
      case StepType.ReplaceHtmlContent:
      case StepType.ReplaceHtmlStyles:
      case StepType.ReplaceTagName: {
        const opts = s.options as BaseHtmlOptions;
        return (
          <>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Tìm kiếm" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.find}
              </code>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Thay thế" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.replace}
              </code>
            </div>
            {opts.tagFilter && opts.tagFilter.length > 0 && (
              <div className="flex justify-between items-center mt-1">
                <span className="font-semibold">
                  <I18n value="Thẻ HTML" />:
                </span>
                <span>
                  {"<"}
                  {opts.tagFilter.join(", ")}
                  {">"}
                </span>
              </div>
            )}
            {opts.classFilter && (
              <div className="flex justify-between items-center mt-1">
                <span className="font-semibold">
                  <I18n value="Lọc theo Class" />:
                </span>
                <span>.{opts.classFilter}</span>
              </div>
            )}
            <div className="mt-2">
              <StepOptions
                caseSensitive={opts.caseSensitive}
                useRegex={opts.useRegex}
                match={opts.match}
              />
            </div>
          </>
        );
      }
      case StepType.ReplaceHtmlAttributes: {
        const opts = s.options as ReplaceHtmlAttributesOptions;
        return (
          <>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Thuộc tính" />:
              </span>
              <span>[{opts.attributeName}]</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Tìm kiếm" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.find}
              </code>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold">
                <I18n value="Thay thế" />:
              </span>
              <code className="text-sm bg-gray-100 p-1 rounded break-all">
                {opts.replace}
              </code>
            </div>
            {opts.tagFilter && opts.tagFilter.length > 0 && (
              <div className="flex justify-between items-center mt-1">
                <span className="font-semibold">
                  <I18n value="Thẻ HTML" />:
                </span>
                <span>
                  {"<"}
                  {opts.tagFilter.join(", ")}
                  {">"}
                </span>
              </div>
            )}
            {opts.classFilter && (
              <div className="flex justify-between items-center mt-1">
                <span className="font-semibold">
                  <I18n value="Lọc theo Class" />:
                </span>
                <span>.{opts.classFilter}</span>
              </div>
            )}
            <div className="mt-2">
              <StepOptions
                caseSensitive={opts.caseSensitive}
                useRegex={opts.useRegex}
                match={opts.match}
              />
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-5 bg-transparent border-0 w-4 text-gray-400 hover:text-gray-600"
        >
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <I18n value={"Chi tiết"} />
            <span className="ml-1">({stepTypeNames[step.type]})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid">{renderDetails(step)}</div>

        {/* Vùng Input & Output */}
        <Tabs defaultValue="compare" className="overflow-hidden">
          <TabsList>
            <TabsTrigger value="compare">
              <I18n value="So sánh" />
            </TabsTrigger>
            <TabsTrigger value="value">
              <I18n value="Giá trị" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="compare" className="overflow-hidden">
            <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-full">
              <pre
                className="whitespace-pre-wrap font-sans"
                dangerouslySetInnerHTML={{ __html: diffHtml }}
              />
            </div>
          </TabsContent>
          <TabsContent value="value" className="overflow-hidden">
            <div className="flex gap-4 space-y-4 overflow-hidden h-full">
              <div className="flex-1 overflow-hidden flex flex-col">
                <span className="font-semibold">
                  <I18n value="Input" />:
                </span>
                <div className="text-sm p-2 bg-gray-100 rounded-md whitespace-pre-wrap overflow-auto">
                  {step.input || <I18n value="Không có" />}
                </div>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                <span className="font-semibold">
                  <I18n value="Output" />:
                </span>
                <div className="text-sm p-2 bg-gray-100 rounded-md whitespace-pre-wrap overflow-auto">
                  {step.output || <I18n value="Không có" />}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-auto pt-4">
          <DialogClose asChild>
            <Button variant="outline">
              <I18n value="Đóng" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
