import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill, IReceipt, Receipt } from '@/models/klm';
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const urlSearchParams = new URLSearchParams(request.nextUrl.search);
    const receiptBillOrMobileNumber = urlSearchParams.get('searchValue');
    const searchType = urlSearchParams.get('searchType');
    const last = urlSearchParams.get('last');
    const recent = urlSearchParams.get('recent');

    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');

    if (receiptBillOrMobileNumber && searchType) {
      if (searchType === 'receipt') {
        const receipt = await Receipt.find({ receiptNumber: receiptBillOrMobileNumber });
        if (!receipt) throw new Error('Receipt not found');
        return NextResponse.json({ message: 'Receipt found', success: true, receipt: receipt });
      } else if (searchType === 'bill') {
        const receipt = await Receipt.find({ 'bill.billNumber': receiptBillOrMobileNumber });
        if (!receipt) throw new Error('Bill not found');
        return NextResponse.json({ message: 'Bill found', success: true, receipt: receipt });
      } else if (searchType === 'mobile') {
        const receipt = await Receipt.find({ 'bill.mobile': receiptBillOrMobileNumber });
        if (!receipt) throw new Error('Mobile not found');
        return NextResponse.json({ message: 'Mobile found', success: true, receipt: receipt });
      }
    }

    if (last) {
      const LastReceipt = await Receipt.findOne().sort({ createdAt: -1 }).select('receiptNumber');
      return NextResponse.json({ message: 'Last receipt', success: true, lastReceipt: LastReceipt });
    }

    if (recent) {
      const recentReceipt = await Receipt.find().sort({ createdAt: -1 }).limit(10);
      return NextResponse.json({ message: 'Recent receipt', success: true, recentReceipt: recentReceipt });
    }
  } catch (error) {
    return handleError.api(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const data: IReceipt = await request.json();
    if (!data.bill?.billNumber) throw new Error('Bill number is required');
    if (!data.amount) throw new Error('Amount is required');
    if (!data.receiptNumber) throw new Error('Receipt number is required');

    if (data.bill?.billNumber) {
      const bill = await Bill.findOne({ billNumber: data.bill.billNumber });
      if (!bill) throw new Error('Bill not found');
      data.bill._id = bill._id;
      data.bill.name = bill.name;
      data.bill.mobile = bill.mobile;
    }

    const receipt = new Receipt({
      _id: new mongoose.Types.ObjectId(),
      receiptNumber: data.receiptNumber,
      bill: data.bill,
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      receiptBy: {
        _id: user._id,
        name: user.username,
      },
      createAt: new Date(),
      updateAt: new Date(),
    }) as IReceipt;

    if (data.amount && data.bill?.billNumber) {
      const bill = await Bill.findOne({ billNumber: data.bill.billNumber });
      if (!bill) throw new Error('Bill not found');
      bill.paidAmount += data.amount;
      if (bill.paidAmount >= bill.totalAmount) {
        bill.paymentStatus = 'Paid';
      } else {
        bill.paymentStatus = 'Partially Paid';
      }
      bill.dueAmount = bill.grandTotal - bill.paidAmount;
      await bill.save();
    }

    await receipt.save();
    return NextResponse.json({ message: 'Receipt added successfully', success: true, receipt: receipt });
  } catch (error) {
    return handleError.api(error);
  }
}
