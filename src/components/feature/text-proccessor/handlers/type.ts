export enum StepType {
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Capitalize = "capitalize",
  Reverse = "reverse",
  Trim = "trim",
  Truncate = "truncate",
  FindReplace = "findReplace",
  Count = "count",
  RemoveBlankLines = "removeBlankLines",
  RemoveDuplicateLines = "removeDuplicateLines",
  SentenceCase = "sentenceCase",
  SwapCase = "swapCase",
  RemoveExtraSpaces = "removeExtraSpaces",
  RemoveDiacritics = "removeDiacritics",
  ReplaceHtmlStyles = "replaceHtmlStyles",
  ReplaceHtmlAttributes = "replaceHtmlAttributes",
  ReplaceHtmlClassName = "replaceHtmlClassName",
  ReplaceHtmlContent = "replaceHtmlContent",
  ReplaceTagName = "replaceTagName",
}

export type Step =
  | { type: StepType.Uppercase; options?: UppercaseOptions }
  | { type: StepType.Lowercase; options?: LowercaseOptions }
  | { type: StepType.Capitalize; options?: CapitalizeOptions }
  | { type: StepType.Reverse; options?: ReverseOptions }
  | { type: StepType.Trim; options?: TrimOptions }
  | { type: StepType.Truncate; options: TruncateOptions }
  | { type: StepType.FindReplace; options: FindReplaceOptions }
  | { type: StepType.RemoveBlankLines; options?: RemoveBlankLinesOptions }
  | {
      type: StepType.RemoveDuplicateLines;
      options?: RemoveDuplicateLinesOptions;
    }
  | { type: StepType.SentenceCase; options?: SentenceCaseOptions }
  | { type: StepType.SwapCase; options?: SwapCaseOptions }
  | { type: StepType.RemoveExtraSpaces; options?: RemoveExtraSpacesOptions }
  | { type: StepType.RemoveDiacritics; options?: RemoveDiacriticsOptions }
  | { type: StepType.ReplaceHtmlStyles; options: ReplaceHtmlStylesOptions }
  | {
      type: StepType.ReplaceHtmlAttributes;
      options: ReplaceHtmlAttributesOptions;
    }
  | {
      type: StepType.ReplaceHtmlClassName;
      options: ReplaceHtmlClassNameOptions;
    }
  | { type: StepType.ReplaceHtmlContent; options: ReplaceHtmlContentOptions }
  | { type: StepType.ReplaceTagName; options: ReplaceTagNameOptions };

export type StepItem = Step & { id: string };
// ======================
// OPTIONS INTERFACES
// ======================
export interface UppercaseOptions {}
export interface LowercaseOptions {}
export interface CapitalizeOptions {}
export interface ReverseOptions {}
export interface TrimOptions {}
export interface RemoveBlankLinesOptions {}
export interface RemoveDuplicateLinesOptions {}
export interface SentenceCaseOptions {}
export interface SwapCaseOptions {}
export interface RemoveExtraSpacesOptions {}
export interface RemoveDiacriticsOptions {}

export interface TruncateOptions {
  length: number;
}

export interface FindReplaceOptions {
  find: string;
  replace: string;
  caseSensitive: boolean;
  useRegex: boolean;
}

export interface BaseHtmlOptions {
  find: string;
  replace: string;
  tagFilter?: string[];
  classFilter?: string;
  useRegex?: boolean;
  caseSensitive?: boolean;
  match?: boolean;
}

export interface ReplaceHtmlStylesOptions extends BaseHtmlOptions {}
export interface ReplaceHtmlAttributesOptions extends BaseHtmlOptions {
  attributeName?: string;
}
export interface ReplaceHtmlClassNameOptions extends BaseHtmlOptions {}
export interface ReplaceHtmlContentOptions extends BaseHtmlOptions {}
export interface ReplaceTagNameOptions extends BaseHtmlOptions {}

export const stepTypeNames: { [key in StepType]: string } = {
  [StepType.Uppercase]: "In hoa",
  [StepType.Lowercase]: "In thường",
  [StepType.Capitalize]: "Viết hoa đầu từ",
  [StepType.Reverse]: "Đảo ngược",
  [StepType.Trim]: "Xóa khoảng trắng",
  [StepType.Truncate]: "Cắt chuỗi",
  [StepType.FindReplace]: "Thay thế",
  [StepType.Count]: "Đếm",
  [StepType.RemoveBlankLines]: "Xóa dòng trống",
  [StepType.RemoveDuplicateLines]: "Xóa dòng trùng lặp",
  [StepType.SentenceCase]: "Viết hoa câu",
  [StepType.SwapCase]: "Đảo ngược chữ hoa/thường",
  [StepType.RemoveExtraSpaces]: "Xóa khoảng trắng thừa",
  [StepType.RemoveDiacritics]: "Loại bỏ dấu",
  [StepType.ReplaceHtmlStyles]: "style",
  [StepType.ReplaceHtmlAttributes]: "Attr",
  [StepType.ReplaceHtmlClassName]: "class",
  [StepType.ReplaceHtmlContent]: "Content",
  [StepType.ReplaceTagName]: "Tag",
};
