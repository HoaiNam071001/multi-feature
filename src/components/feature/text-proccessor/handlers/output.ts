import { replaceHtmlClassName, replaceHtmlContent } from "./htmlProcessors";
import {
  findReplace,
  capitalize,
  truncateText,
  trimText,
  reverseText,
  toLowercase,
  toUppercase,
  removeExtraSpaces,
  swapCase,
  sentenceCase,
  removeDuplicateLines,
  removeBlankLines,
  removeDiacritics,
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
      return replaceHtmlClassName(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
      });
    case StepType.ReplaceHtmlStyles:
      return replaceHtmlClassName(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
      });
    case StepType.ReplaceHtmlClassName:
      return replaceHtmlClassName(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
      });
    case StepType.ReplaceHtmlContent:
      return replaceHtmlContent(text, {
        find: step.find,
        replace: step.replace,
        tagFilter: step.tagFilter,
        caseSensitive: step.caseSensitive,
        useRegex: step.useRegex,
      });
    default:
      return text;
  }
};
