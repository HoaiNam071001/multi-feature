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
      return truncateText(text, step.options.length);
    case StepType.FindReplace:
      return findReplace(
        text,
        step.options.find,
        step.options.replace,
        step.options.caseSensitive,
        step.options.useRegex
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
      return replaceHtmlAttribute(text, step.options.attributeName || "", {
        find: step.options.find,
        replace: step.options.replace,
        tagFilter: step.options.tagFilter,
        classFilter: step.options.classFilter,
        caseSensitive: step.options.caseSensitive,
        useRegex: step.options.useRegex,
        match: step.options.match,
      });
    case StepType.ReplaceHtmlStyles:
      return replaceHtmlStyle(text, {
        find: step.options.find,
        replace: step.options.replace,
        tagFilter: step.options.tagFilter,
        classFilter: step.options.classFilter,
        caseSensitive: step.options.caseSensitive,
        useRegex: step.options.useRegex,
        match: step.options.match,
      });
    case StepType.ReplaceHtmlClassName:
      return replaceHtmlClassName(text, {
        find: step.options.find,
        replace: step.options.replace,
        tagFilter: step.options.tagFilter,
        caseSensitive: step.options.caseSensitive,
        useRegex: step.options.useRegex,
        match: step.options.match,
      });
    case StepType.ReplaceHtmlContent:
      return replaceHtmlContent(text, {
        find: step.options.find,
        replace: step.options.replace,
        tagFilter: step.options.tagFilter,
        caseSensitive: step.options.caseSensitive,
        useRegex: step.options.useRegex,
        match: step.options.match,
      });
    case StepType.ReplaceTagName:
      return replaceTagName(text, {
        find: step.options.find,
        replace: step.options.replace,
        tagFilter: step.options.tagFilter,
        classFilter: step.options.classFilter,
        caseSensitive: step.options.caseSensitive,
        useRegex: step.options.useRegex,
        match: step.options.match,
      });
    default:
      return text;
  }
};
