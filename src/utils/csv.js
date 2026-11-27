// Tiny CSV helpers for admin exports (no dependency needed).

// Cells starting with these can run as formulas when opened in Excel/Sheets.
// Applicants type free text, so neutralise them ("CSV injection").
const FORMULA_START = /^[=+\-@\t\r]/;

function cell(value) {
  let text = value == null ? "" : String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * @param {Array<{ label: string, value: (row: any) => any }>} columns
 * @param {Array<any>} rows
 * @returns {string} CSV text (comma-separated, every cell quoted)
 */
export function toCsv(columns, rows) {
  const header = columns.map((c) => cell(c.label)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => cell(c.value(row))).join(","),
  );
  return [header, ...body].join("\r\n");
}

/** Download CSV text as a file. The BOM makes Excel read umlauts correctly. */
export function downloadCsv(filename, csvText) {
  const blob = new Blob(["﻿", csvText], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
