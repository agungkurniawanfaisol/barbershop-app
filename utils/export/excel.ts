import * as XLSX from "xlsx";
import { downloadBlob } from "@/utils/export/csv";

export function downloadXlsx(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][],
): void {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    buffer,
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
