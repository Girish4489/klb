import { Bill } from '@/models/klm';
import handleError from '@util/error/handleError';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 10);

    const dueBills = await Bill.find({
      dueDate: { $lte: dueDate },
      'order.status': { $ne: 'Completed' },
    });
    return NextResponse.json({ message: 'Due bills fetched successfully', dueBills, success: true });
  } catch (error) {
    return handleError.api(error);
  }
}
