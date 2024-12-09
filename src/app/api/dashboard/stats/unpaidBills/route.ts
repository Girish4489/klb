import { Bill } from '@models/klm';
import handleError from '@util/error/handleError';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const unpaidBills = await Bill.find({
      paymentStatus: { $in: ['Unpaid', 'Partially Paid'] },
    });
    return NextResponse.json({ message: 'Unpaid bills fetched successfully', unpaidBills, success: true });
  } catch (error) {
    return handleError.api(error);
  }
}
