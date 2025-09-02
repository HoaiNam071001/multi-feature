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
    /<([a-z0-9]+)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (fullMatch, tagName: string, attrs: string, content: string) => {
      if (tagFilter?.length && !tagFilter.includes(tagName.toLowerCase())) {
        return fullMatch;
      }

      if (classFilter) {
        const classMatch = attrs.match(/\s*class\s*=\s*(['"])(.*?)\1/i);
        if (classMatch) {
          const classValue = classMatch[2];
          const classes = classValue.split(/\s+/).filter(Boolean);
          const findClasses = useRegex ? [find] : find.split(/\s+/).filter(Boolean);

          let isMatch: boolean;
          if (useRegex) {
            isMatch = pattern.test(classValue);
          } else if (match) {
            isMatch = findClasses.length === classes.length &&
              findClasses.every((fc) => classes.includes(fc));
          } else {
            isMatch = findClasses.every((fc) => classes.includes(fc));
          }

          if (!isMatch) return fullMatch;
        } else {
          return fullMatch;
        }
      }

      return replace ? `<${replace}${attrs}>${content}</${replace}>` : content;
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

    if (attributeName.toLowerCase() === "style") {
      return match.replace(
        /\s*style\s*=\s*(['"]|{)?\s*([^'"}]*?)\s*(['"]|})?\s*/gi,
        (_, quoteStart: string | undefined, styleValue: string) => {
          let newStyleValue = styleValue;

          if (find === "" && replace !== "") {
            // Add new style if find is empty
            newStyleValue = newStyleValue ? `${newStyleValue}; ${replace}` : replace;
          } else if (find !== "") {
            // Process style replacement
            const stylePairs = newStyleValue
              .split(";")
              .map((s) => s.trim())
              .filter(Boolean);
            const findStyles = find
              .split(";")
              .map((s) => s.trim())
              .filter(Boolean);

            const updatedStyles = stylePairs.filter((style) => {
              if (useRegex) {
                return !pattern.test(style);
              }
              return !findStyles.some((fs) => {
                const normalizedFs = caseSensitive ? fs : fs.toLowerCase();
                const normalizedStyle = caseSensitive ? style : style.toLowerCase();
                return normalizedStyle === normalizedFs;
              });
            });

            if (replace !== "") {
              updatedStyles.push(replace);
            }

            newStyleValue = updatedStyles.join("; ");
          }

          if (!newStyleValue) {
            return attrs.replace(/\s*style\s*=\s*(['"]|{)[^'"}]*(['"]|})\s*/gi, "");
          }

          const quote = quoteStart && quoteStart !== "{" ? quoteStart : '"';
          return ` style=${quote}${newStyleValue}${quote}`;
        }
      );
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
  return replaceHtmlAttribute(input, "style", options);
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