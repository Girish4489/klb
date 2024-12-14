import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Bill, IReceipt, Receipt } from '@models/klm';
import User from '@models/userModel';
import handleError from '@util/error/handleError';
import { getParamsFromRequest } from '@util/url/urlUtils';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();
    const { searchValue: receiptBillOrMobileNumber, searchType, last, recent } = getParamsFromRequest(request);

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
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');

    const data: IReceipt = await request.json();
    if (!data.bill?.billNumber) throw new Error('Bill number is required');
    if (!data.amount) throw new Error('Amount is required');
    if (!data.receiptNumber) throw new Error('Receipt number is required');

    const totalTaxAmount = Number(
      data.tax
        .reduce(
          (acc, t) => acc + (t.taxType === 'Percentage' ? (data.amount * t.taxPercentage) / 100 : t.taxPercentage),
          0,
        )
        .toFixed(2),
    );

    const bill = await Bill.findOne({ billNumber: data.bill.billNumber });
    if (!bill) throw new Error('Bill not found');

    const roundedAmount = Number(data.amount.toFixed(2));
    const roundedDiscount = Number((data.discount || 0).toFixed(2));

    const receipt = new Receipt({
      _id: new mongoose.Types.ObjectId(),
      receiptNumber: data.receiptNumber,
      bill: {
        _id: bill._id,
        billNumber: bill.billNumber,
        name: bill.name,
        mobile: bill.mobile,
      },
      receiptBy: {
        _id: user._id,
        name: user.username,
      },
      amount: roundedAmount,
      discount: roundedDiscount,
      tax: data.tax,
      taxAmount: totalTaxAmount,
      paymentDate: data.paymentDate || new Date(),
      paymentMethod: data.paymentMethod,
      paymentType: data.paymentType || 'advance',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    bill.paidAmount = Number((bill.paidAmount + roundedAmount).toFixed(2));
    bill.discount = Number((bill.discount + roundedDiscount).toFixed(2));
    bill.taxAmount = Number((bill.taxAmount + totalTaxAmount).toFixed(2));
    bill.grandTotal = Number((bill.totalAmount + bill.taxAmount - bill.discount).toFixed(2));
    bill.dueAmount = Number((bill.grandTotal - bill.paidAmount).toFixed(2));
    bill.paymentStatus = bill.dueAmount <= 0 ? 'Paid' : bill.paidAmount > 0 ? 'Partially Paid' : 'Unpaid';
    receipt.paymentType = bill.dueAmount <= 0 ? 'fullyPaid' : 'advance';

    await Promise.all([receipt.save(), bill.save()]);

    return NextResponse.json({
      message: 'Receipt added successfully',
      success: true,
      receipt: receipt,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
