import { IBill } from '@models/klm';

// Extended type for bill details that includes calculated fields from receipts
export interface IBillDetails extends Omit<IBill, 'order'> {
  discount?: number;
  paidAmount?: number;
  grandTotal?: number;
  dueAmount?: number;
  taxAmount?: number;
}

// Type for summarizing bill details
export interface IBillSummary {
  totalAmount: number;
  totalDiscount: number;
  totalTax: number;
  totalPaid: number;
  totalDue: number;
}
