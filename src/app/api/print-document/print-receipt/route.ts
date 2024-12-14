import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Bill, Receipt } from '@models/klm';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { getParamsFromRequest } from '@util/url/urlUtils';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();
    const { billNumber, printType } = getParamsFromRequest(request);

    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');

    if (printType === 'Receipt') {
      const bill = await Bill.findOne({ billNumber: billNumber });
      if (!bill) {
        throw new Error('Bill not found');
      }

      const receipts = await Receipt.find({ 'bill.billNumber': billNumber }).sort({ paymentDate: 1 });
      if (!receipts || receipts.length === 0) {
        throw new Error('Receipts not found');
      }

      return NextResponse.json({ message: 'Receipt data', success: true, receipts: receipts, bill: bill });
    }
    return NextResponse.json({ message: 'Receipt not found', success: false });
  } catch (error) {
    return handleError.api(error, false);
  }
}
