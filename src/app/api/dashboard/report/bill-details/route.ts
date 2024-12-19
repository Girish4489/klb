import { connect } from '@/dbConfig/dbConfig';
import { IBillDetails } from '@dashboard/report/bill-details/types';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Bill, Receipt } from '@models/klm';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { getParamsFromRequest } from '@utils/url/urlUtils';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
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

    const [bills, totalBillsCount] = await Promise.all([
      Bill.find({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      })
        .limit(pageSize)
        .skip(skip)
        .select('-__v -updatedAt -createdAt -order -email')
        .lean(),
      Bill.countDocuments({
        createdAt: {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        },
      }),
    ]);

    // Fetch and calculate receipt data for each bill
    const billsWithReceipts = await Promise.all(
      bills.map(async (bill) => {
        const receipts = await Receipt.find({ 'bill._id': bill._id }).select('amount discount tax taxAmount').lean();

        const totalPaid = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
        const totalDiscount = receipts.reduce((sum, receipt) => sum + receipt.discount, 0);
        const totalTaxAmount = receipts.reduce((sum, receipt) => sum + receipt.taxAmount, 0);

        const grandTotal = bill.totalAmount - totalDiscount + totalTaxAmount;
        const dueAmount = grandTotal - totalPaid;

        return {
          ...bill,
          paidAmount: totalPaid,
          discount: totalDiscount,
          taxAmount: totalTaxAmount,
          grandTotal,
          dueAmount,
        } as IBillDetails;
      }),
    );

    return NextResponse.json({
      message: 'Bill data',
      success: true,
      bill: billsWithReceipts,
      totalBills: totalBillsCount,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}
