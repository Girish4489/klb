import { IReceipt } from '@models/klm';
import type { ExportData, TableRow } from './common';
import { formatCurrency } from './common';

export const prepareReceiptExportData = (receipts: IReceipt[]): ExportData => {
  const columns = [
    { header: 'Sl No', field: 'slNo', selected: true },
    { header: 'Receipt No', field: 'receiptNumber', selected: true },
    { header: 'Bill No', field: 'billNumber', selected: true },
    { header: 'Mobile', field: 'mobile', selected: true },
    { header: 'Customer', field: 'customer', selected: true },
    { header: 'Amount', field: 'amount', selected: true },
    { header: 'Discount', field: 'discount', selected: true },
    { header: 'Tax Amount', field: 'taxAmount', selected: true },
    { header: 'Payment Method', field: 'paymentMethod', selected: true },
    { header: 'Payment Date', field: 'paymentDate', selected: true },
    { header: 'Created By', field: 'createdBy', selected: true },
  ];

  const data: TableRow[] = receipts.map((receipt, index) => ({
    slNo: index + 1,
    receiptNumber: receipt.receiptNumber,
    billNumber: receipt.bill?.billNumber || '',
    mobile: receipt.bill?.mobile || '',
    customer: receipt.bill?.name || '',
    amount: formatCurrency(receipt.amount),
    discount: formatCurrency(receipt.discount),
    taxAmount: formatCurrency(receipt.taxAmount),
    paymentMethod: receipt.paymentMethod || '',
    paymentDate: new Date(receipt.paymentDate).toLocaleDateString(),
    createdBy: receipt.receiptBy?.name || '',
  }));

  const summary = {
    'Total Amount': receipts.reduce((sum, receipt) => sum + receipt.amount, 0),
    'Total Discount': receipts.reduce((sum, receipt) => sum + receipt.discount, 0),
    'Total Tax Amount': receipts.reduce((sum, receipt) => sum + receipt.taxAmount, 0),
  };

  return { columns, data, summary, title: 'Receipt Details Report' };
};
