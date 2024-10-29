import handleError from '@/app/util/error/handleError';
import { getParamsFromRequest } from '@/app/util/url/urlUtils';
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
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

    const [bills, totalBillsCount] = await Promise.all([
      Bill.find({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      })
        .limit(pageSize)
        .skip(skip)
        .select('-__v -updatedAt -createdAt -_id -order -email -tax'),
      Bill.countDocuments({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      }),
    ]);
    return NextResponse.json({ message: 'Bill data', success: true, bill: bills, totalBills: totalBillsCount });
  } catch (error) {
    return handleError.api(error, false);
  }
}
