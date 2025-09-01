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
  }
  
  export type Step =
    | { id: string; type: StepType.Uppercase }
    | { id: string; type: StepType.Lowercase }
    | { id: string; type: StepType.Capitalize }
    | { id: string; type: StepType.Reverse }
    | { id: string; type: StepType.Trim }
    | { id: string; type: StepType.Truncate; length: number }
    | {
        id: string;
        type: StepType.FindReplace;
        find: string;
        replace: string;
        caseSensitive: boolean;
        useRegex: boolean;
      }
    | { id: string; type: StepType.RemoveBlankLines }
    | { id: string; type: StepType.RemoveDuplicateLines }
    | { id: string; type: StepType.SentenceCase }
    | { id: string; type: StepType.SwapCase }
    | { id: string; type: StepType.RemoveExtraSpaces }
    | { id: string; type: StepType.RemoveDiacritics }
    | {
        id: string;
        type: StepType.ReplaceHtmlStyles;
        find: string;
        replace: string;
        tagFilter?: string[];
        useRegex?: boolean;
        caseSensitive?: boolean;
      }
    | {
        id: string;
        type: StepType.ReplaceHtmlAttributes;
        find: string;
        replace: string;
        attributeName?: string;
        tagFilter?: string[];
        useRegex?: boolean;
        caseSensitive?: boolean;
      }
    | {
        id: string;
        type: StepType.ReplaceHtmlClassName;
        find: string;
        replace: string;
        tagFilter?: string[];
        useRegex?: boolean;
        caseSensitive?: boolean;
      }
    | {
        id: string;
        type: StepType.ReplaceHtmlContent;
        find: string;
        replace: string;
        tagFilter?: string[];
        useRegex?: boolean;
        caseSensitive?: boolean;
      };
  
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
  };
  
  export type StepInput = Omit<Step, "id">;