import { connect } from '@/dbConfig/dbConfig';
import { Bill } from '@models/klm';
import handleError from '@utils/error/handleError';
import { NextResponse } from 'next/server';

connect();

export async function GET(): Promise<NextResponse> {
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
    const discountAmount = await Bill.aggregate([{ $group: { _id: null, total: { $sum: '$discount' } } }]);
    const discountCount = await Bill.countDocuments({ discount: { $gt: 0 } });

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
      discountAmount: discountAmount[0]?.total || 0,
      discountCount,
      success: true,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
