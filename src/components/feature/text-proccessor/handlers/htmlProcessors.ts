
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
export function replaceTagName(
  input: string,
  options: HtmlReplaceOptions
): string {
  input = trimInput(input);
  const { find, replace, classFilter, useRegex = false } = options;

  // Xây dựng regex để tìm kiếm thẻ mở và đóng.
  // Chúng ta sẽ xử lý chúng một cách riêng biệt để giữ lại nội dung.
  const escapedFind = useRegex ? find : escapeRegex(find);

  // Regex cho thẻ mở (ví dụ: <div class="...">)
  const openTagPattern = new RegExp(`<(${escapedFind})([^>]*)>`, "gi");
  // Regex cho thẻ đóng (ví dụ: </div>)
  const closeTagPattern = new RegExp(`</(${escapedFind})>`, "gi");

  // Hàm helper để kiểm tra class filter
  const hasMatchingClass = (attrs: string, filter: string): boolean => {
    if (!filter) return true;
    const classMatch = attrs.match(/\s+class\s*=\s*(['"])(.*?)\1/i);
    if (!classMatch) return false;

    const classValue = classMatch[2];
    const filterClasses = filter.toLowerCase().split(/\s+/).filter(Boolean);
    const classes = classValue.toLowerCase().split(/\s+/).filter(Boolean);

    return filterClasses.every((fc) => classes.includes(fc));
  };

  // Thay thế các thẻ mở
  let result = input.replaceAll(
    openTagPattern,
    (fullMatch, tagName, attrsAndSlash) => {
      // Kiểm tra class filter
      if (classFilter && !hasMatchingClass(attrsAndSlash, classFilter)) {
        return fullMatch;
      }

      // Xử lý thẻ tự đóng
      if (attrsAndSlash.endsWith("/")) {
        const newTag = replace ? `<${replace}${attrsAndSlash}>` : "";
        return newTag;
      }

      // Trả về thẻ mở đã được thay thế
      return replace ? `<${replace}${attrsAndSlash}>` : "";
    }
  );

  // Thay thế các thẻ đóng
  if (replace) {
    result = result.replaceAll(closeTagPattern, `</${replace}>`);
  } else {
    // Nếu không có 'replace' thì xóa thẻ đóng
    result = result.replaceAll(closeTagPattern, "");
  }

  return result;
}

/**
 * Replace class names with enhanced matching logic.
 */
export function replaceHtmlClassName(
  input: string,
  options: HtmlReplaceOptions
): string {
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
      : new RegExp(
          `\\b${escapedFind.split(/\s+/).join("\\b|\\b")}\\b`,
          regexFlags
        );
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
            if (!pattern.test(classValue))
              return ` class=${quote}${classValue}${quote}`;
            return ` class=${quote}${classValue.replace(pattern, replace)}${quote}`;
          }

          const classes = classValue.split(/\s+/).filter(Boolean);
          const findClasses = find.split(/\s+/).filter(Boolean);
          let isMatch: boolean;

          if (match) {
            isMatch =
              findClasses.length === classes.length &&
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
    find = "",
    replace = "",
    classFilter,
    tagFilter,
    useRegex = false,
    caseSensitive = false,
    match = false,
  } = options;

  if (!attributeName) {
    return input;
  }

  // regex flag cho giá trị attribute
  const regexFlags = caseSensitive ? "" : "i"; // nếu cần match toàn bộ thì không dùng g
  const pattern =
    useRegex && find
      ? new RegExp(find, regexFlags)
      : find
        ? new RegExp(escapeRegex(find), regexFlags)
        : null;

  return input.replace(
    /<([a-z0-9]+)([^>]*)>/gi,
    (wholeTag, tagName: string, attrs: string) => {
      // filter theo tag
      if (tagFilter?.length) {
        const tags = tagFilter.map((e) => e.toLowerCase().trim());
        if (!tags.includes(tagName.toLowerCase())) {
          return wholeTag;
        }
      }

      // filter theo class
      if (classFilter) {
        const classMatch = attrs.match(/\s*class\s*=\s*(['"])(.*?)\1/i);
        if (!classMatch) return wholeTag;
        const classValue = classMatch[2];
        const classes = classValue.split(/\s+/).filter(Boolean);
        const requiredClasses = classFilter.split(/\s+/).filter(Boolean);

        const hasAllClasses = requiredClasses.every((c) => classes.includes(c));
        if (!hasAllClasses) return wholeTag;
      }

      // tìm attribute hiện tại
      const attrRegex = new RegExp(
        `\\s*${attributeName}\\s*=\\s*(['"])(.*?)\\1`,
        caseSensitive ? "g" : "gi"
      );
      const hasAttr = attrRegex.test(attrs);

      // Trường hợp 1: find rỗng, replace có -> thêm attribute nếu chưa có
      if (!find && replace) {
        if (!hasAttr) {
          return `<${tagName}${attrs} ${attributeName}="${replace}">`;
        }
        return wholeTag.replace(attrRegex, ` ${attributeName}="${replace}"`);
      }

      // Trường hợp 2: find & replace cùng rỗng -> bỏ qua
      if (!find && !replace) {
        return wholeTag;
      }

      // Trường hợp 3: find có, replace rỗng -> xoá attribute
      if (find && !replace) {
        return wholeTag.replace(attrRegex, "");
      }

      // Trường hợp 4: find & replace có -> thay thế giá trị
      if (find && replace && hasAttr && pattern) {
        return wholeTag.replace(
          attrRegex,
          (_, quote: string, value: string) => {
            let newValue = value;

            if (match) {
              // match toàn bộ
              const isEqual = useRegex
                ? pattern.test(value) && value.match(pattern)?.[0] === value
                : caseSensitive
                  ? value === find
                  : value.toLowerCase() === find.toLowerCase();

              if (isEqual) {
                newValue = replace;
              }
            } else {
              // match substring
              newValue = value.replace(pattern, replace);
            }

            return ` ${attributeName}=${quote}${newValue}${quote}`;
          }
        );
      }

      return wholeTag;
    }
  );
}

/**
 * Replace style content.
 */
export function replaceHtmlStyle(
  input: string,
  options: HtmlReplaceOptions
): string {
  replaceHtmlAttribute(input, "style", options);
  return " ";
}

/**
 * Replace inner content of tags.
 */
/**
 * Replace inner content of tags with enhanced matching logic.
 */
export function replaceHtmlContent(
  input: string,
  options: HtmlReplaceOptions
): string {
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
