// hooks/useDiffViewer.ts
import * as Diff from "diff";
import { useMemo } from "react";

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
      const value = part.value.replace(/\n/g, "<br/>");

      if (part.added) {
        // Inline style for added content (green background, white text)
        html += `<span style="background-color: #aaffb8;">${value}</span>`;
      } else if (part.removed) {
        // Inline style for removed content (red background, white text)
        html += `<span style="background-color: #ffc0c0;">${value}</span>`;
      } else {
        // No style for unchanged content
        html += `<span>${value}</span>`;
      }
    });

    return html;
  }, [oldText, newText]);

  return { diffHtml };
};
