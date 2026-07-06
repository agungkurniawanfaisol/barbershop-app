import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadBlob } from "@/utils/export/csv";

type PdfTable = {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: string[];
};

export function downloadPdf(filename: string, table: PdfTable): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFontSize(16);
  doc.text(table.title, 14, 18);

  if (table.subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(table.subtitle, 14, 26);
    doc.setTextColor(0);
  }

  autoTable(doc, {
    startY: table.subtitle ? 32 : 24,
    head: [table.headers],
    body: table.rows.map((row) => row.map(String)),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  if (table.summary?.length) {
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY;
    const y = (finalY ?? 40) + 10;
    doc.setFontSize(10);
    table.summary.forEach((line, index) => {
      doc.text(line, 14, y + index * 6);
    });
  }

  const buffer = doc.output("arraybuffer");
  downloadBlob(
    buffer,
    filename.endsWith(".pdf") ? filename : `${filename}.pdf`,
    "application/pdf",
  );
}
