import handleError from '@/app/util/error/handleError';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const unpaidBills = await Bill.find({
      paymentStatus: { $in: ['Unpaid', 'Partially Paid'] },
    });
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 10);
    const dueBills = await Bill.find({
      dueDate: { $lte: dueDate },
      'order.status': { $ne: 'Completed' },
    });
    const completedOrders = await Bill.find({
      'order.status': 'Completed',
      deliveryStatus: 'Pending',
    });
    const allBills = await Bill.find();

    return NextResponse.json({
      message: 'Stats fetched successfully',
      unpaidBills,
      dueBills,
      completedOrders,
      allBills,
      success: true,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
