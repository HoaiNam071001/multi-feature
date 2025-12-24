import { RichText } from "exceljs";

export function richTextToHtml(richText: RichText[]): string {
  return richText
    .map((part) => {
      let style = "";
      if (part.font?.bold) style += "font-weight:bold;";
      if (part.font?.italic) style += "font-style:italic;";
      if (part.font?.underline) style += "text-decoration:underline;";
      if (part.font?.color?.argb) {
        // argb: 'FFRRGGBB' => lấy 6 ký tự cuối
        style += `color:#${part.font.color.argb.slice(2)};`;
      }
      return `<span style="${style}">${part.text}</span>`;
    })
    .join("");
}

export const renderCellValue = (cell: any): string => {
  if (!cell || !cell.value) return "";

  const val = cell.value;

  // RichText
  if (typeof val === "object" && "richText" in val) {
    return richTextToHtml(val.richText);
  }

  // Ngày
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }

  // Bình thường (số, chuỗi)
  return val.toString();
};