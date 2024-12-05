import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

connect();

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
