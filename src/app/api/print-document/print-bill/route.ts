import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Bill, IBill } from '@models/klm';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { getParamsFromRequest } from '@utils/url/urlUtils';
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
    let bill: IBill | null;
    if (printType === 'Customer Bill' || printType === 'Worker Bill' || printType === 'Both') {
      bill = await Bill.findOne({ billNumber: billNumber });
      if (!bill) {
        throw new Error(`${printType} not found`);
      }
      return NextResponse.json({ message: `${printType} Data`, success: true, bill: bill });
    }

    return NextResponse.json({ message: 'Print type not found', success: false });
  } catch (error) {
    return handleError.api(error, false);
  }
}
