import { IBillDetails } from '@/app/dashboard/report/bill-details/types';
import type { ExportData, TableRow } from './common';
import { formatCurrency } from './common';

export const prepareBillExportData = (bills: IBillDetails[]): ExportData => {
  const columns = [
    { header: 'Sl No', field: 'slNo', selected: true },
    { header: 'Bill No', field: 'billNumber', selected: true },
    { header: 'Mobile', field: 'mobile', selected: true },
    { header: 'Date', field: 'date', selected: true },
    { header: 'Due Date', field: 'dueDate', selected: true },
    { header: 'U/T', field: 'ut', selected: true },
    { header: 'Total Amount', field: 'totalAmount', selected: true },
    { header: 'Discount', field: 'discount', selected: true },
    { header: 'Tax Amount', field: 'taxAmount', selected: true },
    { header: 'Grand Total', field: 'grandTotal', selected: true },
    { header: 'Paid Amount', field: 'paidAmount', selected: true },
    { header: 'Due Amount', field: 'dueAmount', selected: true },
    { header: 'Status', field: 'status', selected: true },
    { header: 'Bill by', field: 'billBy', selected: true },
  ];

  const data: TableRow[] = bills.map((bill, index) => ({
    slNo: index + 1,
    billNumber: bill.billNumber,
    mobile: bill.mobile || '',
    date: bill.date ? new Date(bill.date).toLocaleDateString() : '',
    dueDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '',
    ut: `${bill.urgent ? 'U' : ''}${bill.urgent && bill.trail ? ' | ' : ''}${bill.trail ? 'T' : ''}`,
    totalAmount: formatCurrency(bill.totalAmount || 0),
    discount: formatCurrency(bill.discount || 0),
    taxAmount: formatCurrency(bill.taxAmount || 0),
    grandTotal: formatCurrency(bill.grandTotal || 0),
    paidAmount: formatCurrency(bill.paidAmount || 0),
    dueAmount: formatCurrency(bill.dueAmount || 0),
    status: bill.paymentStatus || '',
    billBy: bill.billBy?.name || '',
  }));

  const summary = {
    'Total Amount': bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0),
    'Total Discount': bills.reduce((sum, bill) => sum + (bill.discount || 0), 0),
    'Total Tax': bills.reduce((sum, bill) => sum + (bill.taxAmount || 0), 0),
    'Total Paid': bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0),
    'Total Due': bills.reduce((sum, bill) => sum + (bill.dueAmount || 0), 0),
  };

  return { columns, data, summary, title: 'Bill Details Report' };
};
