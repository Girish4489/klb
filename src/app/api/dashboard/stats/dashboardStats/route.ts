import handleError from '@/app/util/error/handleError';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const unpaidBillsCount = await Bill.countDocuments({ paymentStatus: 'Unpaid' });
    const partiallyPaidBillsCount = await Bill.countDocuments({ paymentStatus: 'Partially Paid' });
    const paidBillsCount = await Bill.countDocuments({ paymentStatus: 'Paid' });
    const pendingDeliveryBillsCount = await Bill.countDocuments({ deliveryStatus: 'Pending' });
    const deliveredBillsCount = await Bill.countDocuments({ deliveryStatus: 'Delivered' });
    const totalBillsCount = await Bill.countDocuments();
    const grandTotalAmount = await Bill.aggregate([{ $group: { _id: null, total: { $sum: '$grandTotal' } } }]);
    const paidAmount = await Bill.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]);
    const dueAmount = await Bill.aggregate([{ $group: { _id: null, total: { $sum: '$dueAmount' } } }]);

    return NextResponse.json({
      message: 'Stats fetched successfully',
      unpaidBillsCount,
      partiallyPaidBillsCount,
      paidBillsCount,
      pendingDeliveryBillsCount,
      deliveredBillsCount,
      totalBillsCount,
      grandTotalAmount: grandTotalAmount[0]?.total || 0,
      paidAmount: paidAmount[0]?.total || 0,
      dueAmount: dueAmount[0]?.total || 0,
      success: true,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
