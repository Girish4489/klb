import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Receipt } from '@models/klm';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { getParamsFromRequest } from '@utils/url/urlUtils';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();
    const { fromDate, toDate, page } = getParamsFromRequest(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');

    if (!fromDate || !toDate || !page) {
      throw new Error('Please provide fromDate, toDate and page');
    }

    const pageSize = 10;
    const skip = (parseInt(page) - 1) * pageSize;

    const [receipts, totalReceiptsCount] = await Promise.all([
      Receipt.find({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      })
        .limit(pageSize)
        .skip(skip)
        .select('-__v -updatedAt -createdAt -_id -order -email -tax'),
      Receipt.countDocuments({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      }),
    ]);
    return NextResponse.json({
      message: 'Receipt data',
      success: true,
      receipt: receipts,
      totalReceipts: totalReceiptsCount,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
