// hooks/useDiffViewer.ts
import * as Diff from "diff";
import { useMemo } from "react";

const styles = {
  "stripedBackground": {
    "height": "256px",
    "width": "100%",
    "background": "linear-gradient(45deg, #ffffff 25%, #cccccc 25%, #cccccc 50%, #ffffff 50%, #ffffff 75%, #cccccc 75%, #cccccc)",
    "backgroundSize": "20px 20px",
    "border": "2px solid #ccc",
    "borderRadius": "8px"
  },
  "diffAdded": {
    "backgroundColor": "#aaffb8",
    "display": "block"
  },
  "diffRemoved": {
    "backgroundColor": "#ffc0c0",
    "display": "block"
  },
  "diffUnchanged": {
    "display": "block"
  },
  "emptyLine": {
    "display": "block",
    "background": "linear-gradient(45deg, #ffffff 25%, #cccccc 25%, #cccccc 50%, #ffffff 50%, #ffffff 75%, #cccccc 75%, #cccccc)",
    "backgroundSize": "20px 20px"
  }
}

// Helper function to escape HTML characters
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * A custom React hook to generate HTML for a text diff view with inline styles.
 *
 * @param oldText The original text string.
 * @param newText The new text string.
 * @returns An object containing the diff HTML string.
 */
export const useDiffViewer = (oldText: string, newText: string) => {
  const diffHtml = useMemo(() => {
    // Escape the input texts first to treat them as plain text
    const escapedOldText = escapeHtml(oldText);
    const escapedNewText = escapeHtml(newText);

    // Perform diff on the escaped strings
    const diff = Diff.diffChars(escapedOldText, escapedNewText);
    let html = "";

    diff.forEach((part) => {
      // Replace newlines with <br/> to render line breaks in HTML
      const value = part.value.replace(/\n/g, `<br/>`);
      const isEmptyLine = part.value === '\n';
      console.log(part.value === '\n');

      if (part.added) {
        // Inline style for added content (green background, white text)
        html += `<span style="background-color: #aaffb8;${isEmptyLine ? "display: block;" : ""}">${value}</span>`;
      } else if (part.removed) {
        // Inline style for removed content (red background, white text)
        html += `<span style="background-color: #ffc0c0;${isEmptyLine ? "display: block;" : ""}">${value}</span>`;
      } else {
        // No style for unchanged content
        html += `<span>${value}</span>`;
      }
    });

    return html;
  }, [oldText, newText]);

  return { diffHtml };
};


/**
 * A custom React hook to generate HTML for a line-by-line text diff view with inline styles.
 *
 * @param oldText The original text string.
 * @param newText The new text string.
 * @returns An object containing the diff HTML strings for both old and new text.
 */
export const useDiffViewerCompareByLine = (oldText: string, newText: string) => {
  const diffResults = useMemo(() => {
    // Escape the input texts first to treat them as plain text
    const escapedOldText = escapeHtml(oldText);
    const escapedNewText = escapeHtml(newText);

    // Perform line-by-line diff
    const diff = Diff.diffLines(escapedOldText, escapedNewText);
    let oldHtml = "";
    let newHtml = "";

    diff.forEach((part) => {
      const lines = part.value.split("\n");
      lines.forEach((line, index) => {
        if (line || index < lines.length - 1) { // Handle the last empty line
          const lineContent = line + (index < lines.length - 1 ? "<br/>" : "");

          if (part.added) {
            // Added lines (green background) in new text
            newHtml += `<span style="${Object.entries(styles.diffAdded)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">${lineContent}</span>`;
            // Empty space in old text for alignment with striped background
            oldHtml += `<span style="${Object.entries(styles.emptyLine)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">&nbsp;</span>`;
          } else if (part.removed) {
            // Removed lines (red background) in old text
            oldHtml += `<span style="${Object.entries(styles.diffRemoved)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">${lineContent}</span>`;
            // Empty space in new text for alignment with striped background
            newHtml += `<span style="${Object.entries(styles.emptyLine)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">&nbsp;</span>`;
          } else {
            // Unchanged lines (no background)
            oldHtml += `<span style="${Object.entries(styles.diffUnchanged)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">${lineContent}</span>`;
            newHtml += `<span style="${Object.entries(styles.diffUnchanged)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
              .join('')}">${lineContent}</span>`;
          }
        }
      });
    });

    return { oldHtml, newHtml };
  }, [oldText, newText]);

  return { ...diffResults };
};