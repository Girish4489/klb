import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

connect();

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
