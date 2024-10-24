import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill, IBill } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const urlSearchParams = new URLSearchParams(request.nextUrl.search);
    const billNumber = urlSearchParams.get('billNumber');
    const printType = urlSearchParams.get('printType');

    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');
    let bill: IBill | null;
    if (printType === 'Customer Bill' || printType === 'Worker Bill' || printType === 'Both') {
      bill = await Bill.findOne({ billNumber: billNumber });
      if (!bill) {
        throw new Error(`${printType} not found`);
      }
      return NextResponse.json({ message: `${printType} data`, success: true, bill: bill });
    }

    return NextResponse.json({ message: 'Print type not found', success: false });
  } catch (error) {
    return handleError.api(error, false);
  }
}
