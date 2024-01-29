// /src/app/api/dashboard/work-manage/bill/route.ts
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const billNumber = request.nextUrl.searchParams.get('billNo');
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    const bill = await Bill.findOne({ billNumber: billNumber });
    if (!bill) throw new Error('Bill not found');
    return NextResponse.json({ message: 'User data', success: true, user: user, bill: bill });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
