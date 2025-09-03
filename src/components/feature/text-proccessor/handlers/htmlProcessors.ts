// =========================
// HTML TEXT FEATURES (Refactored)
// =========================

export interface HtmlReplaceOptions {
  find: string;
  replace: string;
  classFilter?: string;
  tagFilter?: string[];
  useRegex?: boolean;
  caseSensitive?: boolean;
  match?: boolean;
}

/**
 * Trim input string before processing.
 */
export function trimInput(input: string): string {
  return input.trim();
}

/**
 * Replace tagName with options for find, replace, classFilter, useRegex, caseSensitive.
 */
export function replaceTagName(input: string, options: HtmlReplaceOptions): string {
  input = trimInput(input);
  const {
    find,
    replace,
    classFilter,
    useRegex = false,
  } = options;

  // Build a regex for the tag name, applying useRegex to 'find'
  const escapedFind = useRegex ? `(${find})` : `(${escapeRegex(find)})`;
  // The new regex pattern now handles both self-closing tags and those with a closing tag
  const tagPattern = new RegExp(`<${escapedFind}([^>]*)(\/?>)(?:([\\s\\S]*?)<\\/\\1>)?`, "gi");

  return input.replaceAll(
    tagPattern,
    (fullMatch, tagName: string, attrsAndSlash: string, content: string = '') => {
      // Check if it's a self-closing tag
      const isSelfClosing = attrsAndSlash.endsWith('/');

      // Class filter logic
      if (classFilter) {
        const classMatch = attrsAndSlash.match(/\s+class\s*=\s*(['"])(.*?)\1/i);
        if (classMatch) {
          const classValue = classMatch[2];
          const filterClasses = classFilter.toLowerCase().split(/\s+/).filter(Boolean);
          const classes = classValue.toLowerCase().split(/\s+/).filter(Boolean);

          const isClassMatch = filterClasses.every((fc) => classes.includes(fc));
          if (!isClassMatch) {
            return fullMatch;
          }
        } else {
          return fullMatch;
        }
      }

      // Replacement logic
      if (replace) {
        if (isSelfClosing) {
          // Replace the tag name, keep attributes and the self-closing format
          return `<${replace}${attrsAndSlash.replace(/\s*\/?$/, ' /')}>`;
        } else {
          // Replace the tag name, keep attributes and content
          const newOpenTag = `<${replace}${attrsAndSlash}>`;
          const newCloseTag = `</${replace}>`;
          return `${newOpenTag}${content}${newCloseTag}`;
        }
      } else {
        // Remove the tag, keep content for non-self-closing tags, or return an empty string for self-closing tags
        return isSelfClosing ? '' : content;
      }
    }
  );
}

/**
 * Replace class names with enhanced matching logic.
 */
export function replaceHtmlClassName(input: string, options: HtmlReplaceOptions): string {
  input = trimInput(input);
  const {
    find,
    replace,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
    match = false,
  } = options;

  const regexFlags = caseSensitive ? "g" : "gi";
  let pattern: RegExp;

  if (useRegex) {
    pattern = new RegExp(find, regexFlags);
  } else {
    const escapedFind = escapeRegex(find);
    pattern = match
      ? new RegExp(`^${escapedFind}$`, regexFlags)
      : new RegExp(`\\b${escapedFind.split(/\s+/).join("\\b|\\b")}\\b`, regexFlags);
  }

  return input.replace(
    /<([a-z0-9]+)([^>]*)>/gi,
    (match, tagName: string, attrs: string) => {
      if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase())) {
        return match;
      }

      const updatedAttrs = attrs.replace(
        /\s*class\s*=\s*(['"])(.*?)\1/gi,
        (_, quote: string, classValue: string) => {
          if (useRegex) {
            if (!pattern.test(classValue)) return ` class=${quote}${classValue}${quote}`;
            return ` class=${quote}${classValue.replace(pattern, replace)}${quote}`;
          }

          const classes = classValue.split(/\s+/).filter(Boolean);
          const findClasses = find.split(/\s+/).filter(Boolean);
          let isMatch: boolean;

          if (match) {
            isMatch = findClasses.length === classes.length &&
              findClasses.every((fc) => classes.includes(fc));
          } else {
            isMatch = findClasses.every((fc) => classes.includes(fc));
          }

          if (!isMatch) return ` class=${quote}${classValue}${quote}`;

          const newClassValue = classes
            .map((c) => (findClasses.includes(c) ? replace : c))
            .join(" ");
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
  input = trimInput(input);
  const {
    find,
    replace,
    classFilter,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
  } = options;

  if (find === "" && replace === "") {
    return input; // No processing if both find and replace are empty
  }

  const regexFlags = caseSensitive ? "g" : "gi";
  const pattern = useRegex
    ? new RegExp(find, regexFlags)
    : new RegExp(escapeRegex(find), regexFlags);

  return input.replace(/<([a-z0-9]+)([^>]*)>/gi, (match, tagName: string, attrs: string) => {
    if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase())) {
      return match;
    }

    if (classFilter) {
      const classMatch = attrs.match(/\s*class\s*=\s*(['"])(.*?)\1/i);
      if (!classMatch) return match;
      const classValue = classMatch[2];
      const classes = classValue.split(/\s+/).filter(Boolean);
      const findClasses = useRegex ? [find] : find.split(/\s+/).filter(Boolean);

      let isClassMatch: boolean;
      if (useRegex) {
        isClassMatch = pattern.test(classValue);
      } else {
        isClassMatch = findClasses.every((fc) => classes.includes(fc));
      }
      if (!isClassMatch) return match;
    }

    const attrRegex = new RegExp(
      `\\s*${attributeName}\\s*=\\s*(['"])(.*?)\\1`,
      "gi"
    );

    return match.replace(attrRegex, (_, quote: string, value: string) => {
      const newValue = value.replace(pattern, replace);
      return ` ${attributeName}=${quote}${newValue}${quote}`;
    });
  });
}

/**
 * Replace style content.
 */
export function replaceHtmlStyle(input: string, options: HtmlReplaceOptions): string {
  replaceHtmlAttribute(input, "style", options);
  return " ";
}

/**
 * Replace inner content of tags.
 */
/**
 * Replace inner content of tags with enhanced matching logic.
 */
export function replaceHtmlContent(input: string, options: HtmlReplaceOptions): string {
  input = trimInput(input);
  const {
    find,
    replace,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
    match = false,
  } = options;

  const regexFlags = caseSensitive ? "g" : "gi";
  const pattern = useRegex
    ? new RegExp(find, regexFlags)
    : match
      ? new RegExp(`^${escapeRegex(find)}$`, regexFlags)
      : new RegExp(escapeRegex(find), regexFlags);

  return input.replace(
    /<([a-z0-9]+)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (fullMatch, tagName: string, attrs: string, content: string) => {
      if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase())) {
        return fullMatch;
      }

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