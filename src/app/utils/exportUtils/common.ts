import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { JSX } from 'react';

// Add type extension for jsPDF to include lastAutoTable
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export interface ExportColumn {
  header: string;
  field: string;
  selected: boolean;
}

export interface TableRow {
  [key: string]: string | number | boolean | JSX.Element | undefined;
}

export interface ExportData {
  columns: ExportColumn[];
  data: TableRow[];
  summary?: { [key: string]: number };
  title: string;
}

export const exportToCSV = (data: ExportData, filename: string) => {
  const selectedColumns = data.columns.filter(col => col.selected);
  const headers = selectedColumns.map(col => col.header);

  const rows = data.data.map(row =>
    selectedColumns.map(col => row[col.field] || '')
  );

  const csvContent = [
    headers,
    ...rows,
  ].map(e => e.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: ExportData, filename: string) => {
  const doc = new jsPDF() as ExtendedJsPDF;

  // Add title
  doc.setFontSize(16);
  doc.text(data.title, 14, 15);

  // Add date range if available
  const today = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, 14, 22);

  const selectedColumns = data.columns.filter(col => col.selected);
  const tableData = data.data.map(row =>
    selectedColumns.map(col => {
      const value = row[col.field];
      // Convert all values to strings, skip JSX elements
      return typeof value === 'object' ? '' : String(value || '');
    })
  );

  const tableOptions: UserOptions = {
    head: [selectedColumns.map(col => col.header)],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [51, 51, 51] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  };

  autoTable(doc, tableOptions);

  // Add summary if available
  if (data.summary) {
    const finalY = doc.lastAutoTable?.finalY || 25;
    const summaryY = finalY + 10;
    doc.setFontSize(10);
    Object.entries(data.summary).forEach(([key, value], index) => {
      doc.text(`${key}: ${formatCurrency(value)}`, 14, summaryY + (index * 6));
    });
  }

  doc.save(filename);
};
