// =========================
// HTML TEXT FEATURES (Refactored)
// =========================

export interface HtmlReplaceOptions {
  find: string;
  replace: string;
  tagFilter?: string[];
  useRegex?: boolean;
  caseSensitive?: boolean;
}

/**
 * Replace class names.
 */
/**
 * Replace class names.
 */
export function replaceHtmlClassName(
  input: string,
  options: HtmlReplaceOptions
): string {
  const {
    find,
    replace,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
  } = options;

  const regexFlags = caseSensitive ? "g" : "gi";
  const pattern = useRegex
    ? new RegExp(find, regexFlags)
    : new RegExp(escapeRegex(find), regexFlags);

  return input.replace(
    /<([a-z0-9]+)([^>]*)>/gi,
    (match, tagName: string, attrs: string) => {
      if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase()))
        return match;

      const updatedAttrs = attrs.replace(
        /\s*class\s*=\s*(['"])(.*?)\1/gi,
        (_, quote: string, classValue: string) => {
          const newClassValue = classValue.replace(pattern, replace);
          return ` class=${quote}${newClassValue}${quote}`;
        }
      );

      return `<${tagName}${updatedAttrs}>`;
    }
  );
}

/**
 * Replace any attribute value by name.
 */
export function replaceHtmlAttribute(
  input: string,
  attributeName: string,
  options: HtmlReplaceOptions
): string {
  const {
    find,
    replace,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
  } = options;

  const regexFlags = caseSensitive ? "g" : "gi";
  const pattern = useRegex
    ? new RegExp(find, regexFlags)
    : new RegExp(escapeRegex(find), regexFlags);

  const attrRegex = new RegExp(
    `\\s*${attributeName}\\s*=\\s*(['"])(.*?)\\1`,
    "gi"
  );

  return input.replace(/<([a-z0-9]+)([^>]*)>/gi, (match, tagName, attrs) => {
    if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase()))
      return match;

    return match.replace(attrRegex, (_, quote, value) => {
      const newValue = value.replace(pattern, replace);
      return ` ${attributeName}=${quote}${newValue}${quote}`;
    });
  });
}

/**
 * Replace style content.
 */
export function replaceHtmlStyle(
  input: string,
  options: HtmlReplaceOptions
): string {
  return replaceHtmlAttribute(input, "style", options);
}

/**
 * Replace inner content of tags.
 */
export function replaceHtmlContent(
  input: string,
  options: HtmlReplaceOptions
): string {
  const {
    find,
    replace,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
  } = options;

  const regexFlags = caseSensitive ? "g" : "gi";
  const pattern = useRegex
    ? new RegExp(find, regexFlags)
    : new RegExp(escapeRegex(find), regexFlags);

  return input.replace(
    /<([a-z0-9]+)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tagName, attrs, content) => {
      if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase()))
        return match;

      const newContent = content.replace(pattern, replace);
      return `<${tagName}${attrs}>${newContent}</${tagName}>`;
    }
  );
}

/**
 * Escape regex special chars if not using regex.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
