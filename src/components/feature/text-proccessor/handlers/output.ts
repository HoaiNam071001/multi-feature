import {
  replaceHtmlAttribute,
  replaceHtmlClassName,
  replaceHtmlContent,
  replaceHtmlStyle,
  replaceTagName,
} from "./htmlProcessors";
import {
  capitalize,
  findReplace,
  removeBlankLines,
  removeDiacritics,
  removeDuplicateLines,
  removeExtraSpaces,
  reverseText,
  sentenceCase,
  swapCase,
  toLowercase,
  toUppercase,
  trimText,
  truncateText,
} from "./textProcessors";
import { Step, StepType } from "./type";

/**
 * Dispatcher: gọi đúng hàm xử lý dựa vào step
 */
export const processStep = (text: string, step: Step): string => {
  switch (step.type) {
    case StepType.Uppercase:
      return toUppercase(text);
    case StepType.Lowercase:
      return toLowercase(text);
    case StepType.Capitalize:
      return capitalize(text);
    case StepType.Reverse:
      return reverseText(text);
    case StepType.Trim:
      return trimText(text);
    case StepType.Truncate:
      return truncateText(text, step.length);
    case StepType.FindReplace:
      return findReplace(
        text,
        step.find,
        step.replace,
        step.caseSensitive,
        step.useRegex
      );
    case StepType.RemoveBlankLines:
      return removeBlankLines(text);
    case StepType.RemoveDuplicateLines:
      return removeDuplicateLines(text);
    case StepType.SentenceCase:
      return sentenceCase(text);
    case StepType.SwapCase:
      return swapCase(text);
    case StepType.RemoveExtraSpaces:
      return removeExtraSpaces(text);
    case StepType.RemoveDiacritics:
      return removeDiacritics(text);
    case StepType.ReplaceHtmlAttributes:
      return replaceHtmlAttribute(text, step.attributeName || "", {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        classFilter: step.classFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
        match: step.match,
      });
    case StepType.ReplaceHtmlStyles:
      return replaceHtmlStyle(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        classFilter: step.classFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
        match: step.match,
      });
    case StepType.ReplaceHtmlClassName:
      return replaceHtmlClassName(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
        match: step.match,
      });
    case StepType.ReplaceHtmlContent:
      return replaceHtmlContent(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
        match: step.match,
      });
    case StepType.ReplaceTagName:
      return replaceTagName(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        classFilter: step.classFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
        match: step.match,
      });
    default:
      return text;
  }
};
