import { Bill } from '@models/klm';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const bills = await Bill.find()
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBills = await Bill.countDocuments();

    return NextResponse.json({
      message: 'Bills fetched successfully',
      bills,
      totalBills,
      success: true,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
