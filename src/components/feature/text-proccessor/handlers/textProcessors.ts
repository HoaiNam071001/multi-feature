
export const toUppercase = (text: string) => text.toUpperCase();

export const toLowercase = (text: string) => text.toLowerCase();

export const capitalize = (text: string) =>
  text.replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());

export const reverseText = (text: string) =>
  text.split("").reverse().join("");

export const trimText = (text: string) => text.trim();

export const truncateText = (text: string, length: number) =>
  !isNaN(length) && length > 0 ? text.slice(0, length) : text;

export const findReplace = (
  text: string,
  find: string,
  replace: string,
  caseSensitive: boolean,
  useRegex: boolean
) => {
  const flags = caseSensitive ? "g" : "gi";
  const regexPattern = useRegex
    ? find
    : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(regexPattern, flags), replace);
};

export const removeBlankLines = (text: string) =>
  text.split("\n").filter((line) => line.trim() !== "").join("\n");

export const removeDuplicateLines = (text: string) => {
  const lines = text.split("\n");
  return [...new Set(lines)].join("\n");
};

export const sentenceCase = (text: string) =>
  text
    .toLowerCase()
    .replace(/(^\s*\w|[.?!]\s*\w)/g, (c) => c.toUpperCase());

export const swapCase = (text: string) =>
  text
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");

export const removeExtraSpaces = (text: string) =>
  text.replace(/\s+/g, " ").trim();

export const removeDiacritics = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
