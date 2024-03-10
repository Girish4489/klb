import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill, IReceipt, Receipt } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const urlSearchParams = new URLSearchParams(request.nextUrl.search);
    const receiptNumber = urlSearchParams.get('receiptNumber');
    const printType = urlSearchParams.get('printType');

    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');
    let receipt: IReceipt | null;
    if (printType === 'Receipt') {
      receipt = await Receipt.findOne({ receiptNumber: receiptNumber });
      if (!receipt) {
        throw new Error('Receipt not found');
      }
      let bill: any;
      if (receipt.bill?.billNumber) {
        bill = await Bill.findOne({ billNumber: receipt.bill.billNumber }).select(
          '-__v -createdAt -updatedAt -billBy -order -tax -urgent -trail -mobile -name -date -dueDate',
        );
        if (!bill) {
          throw new Error('Bill not found');
        }
      }
      return NextResponse.json({ message: 'Receipt data', success: true, receipt: receipt, bill: bill });
    }
    return NextResponse.json({ message: 'Receipt not found', success: false });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, success: false });
  }
}
