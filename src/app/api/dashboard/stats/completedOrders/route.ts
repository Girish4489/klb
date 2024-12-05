import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

connect();

export async function GET() {
  try {
    const completedOrders = await Bill.find({
      'order.status': 'Completed',
      deliveryStatus: 'Pending',
    });
    return NextResponse.json({ message: 'Completed orders fetched successfully', completedOrders, success: true });
  } catch (error) {
    return handleError.api(error);
  }
}
