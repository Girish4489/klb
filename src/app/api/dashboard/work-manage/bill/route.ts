import handleError from '@/app/util/error/handleError';
import { getParamsFromRequest } from '@/app/util/url/urlUtils';
import { connect } from '@/dbConfig/dbConfig';
import { TokenData } from '@/helpers/getDataFromToken';
import { Bill, IBill } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = await TokenData.create(request);
    const userId = tokenData.getId();
    const { searchValue: billOrMobileNumber, type: billType, today, week, last } = getParamsFromRequest(request); // key: variable name, value: query parameter name
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');

    if (billOrMobileNumber && billType) {
      let bill;
      if (billType === 'bill') {
        bill = await Bill.find({ billNumber: billOrMobileNumber });
        if (!bill || bill.length === 0) {
          throw new Error('Bill number not found');
        }
      } else {
        bill = await Bill.find({ mobile: billOrMobileNumber });
        if (!bill || bill.length === 0) {
          throw new Error('Mobile number not found');
        }
      }
      return NextResponse.json({ message: 'Bill data', success: true, bill: bill });
    }

    if (last) {
      const lastBill = await Bill.findOne().sort({ createdAt: -1 }).select('billNumber');
      return NextResponse.json({ message: 'Last bill', success: true, lastBill: lastBill });
    }

    if (today && week) {
      const todayBill = await Bill.find({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59)),
        },
      }).select('-__v -updatedAt -createdAt -_id -order -paymentStatus -email -tax');

      const weekBill = await Bill.find({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      }).select('-__v -updatedAt -createdAt -_id -order -paymentStatus -email -tax');

      return NextResponse.json({
        message: 'Bill data',
        success: true,
        todayBill: todayBill,
        weekBill: weekBill,
      });
    }
  } catch (error) {
    return handleError.api(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = await TokenData.create(request);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const data = await request.json();

    // check if bill number already exists.
    const billExists = await Bill.findOne({ billNumber: data.billNumber });
    if (billExists) throw new Error('Bill number already exists');

    const bill = new Bill(data);
    if (bill.billBy) {
      bill.billBy = {
        ...bill.billBy,
        _id: user._id,
        name: user.username,
      };
    }
    // Update dueAmount based on grandTotal and paidAmount
    const { grandTotal, paidAmount } = bill;
    bill.dueAmount = (isNaN(grandTotal) ? 0 : grandTotal) - (isNaN(paidAmount) ? 0 : paidAmount);
    if (grandTotal === paidAmount) {
      bill.paymentStatus = 'Paid';
    } else if (paidAmount === 0) {
      bill.paymentStatus = 'Unpaid';
    } else if (paidAmount > 0 && paidAmount < grandTotal) {
      bill.paymentStatus = 'Partially Paid';
    }

    await bill.save();
    const today = await Bill.findOne({
      billNumber: bill.billNumber,
    }).select('-__v -updatedAt -createdAt -_id -order -paymentStatus -email -tax');
    return NextResponse.json({ message: 'Bill created', success: true, bill: bill, today: today });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const tokenData = await TokenData.create(request);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const billId = request.nextUrl.searchParams.get('updateBillId');
    if (!billId) throw new Error('Bill id is required');
    const data: IBill = await request.json();
    const billExists = await Bill.findOne({ _id: billId });
    if (!billExists) throw new Error('Bill not found');
    const bill = await Bill.findByIdAndUpdate(billId, data, { new: true });
    if (!bill) throw new Error('Bill not found');
    // Update dueAmount based on grandTotal and paidAmount
    const { grandTotal, paidAmount } = bill;
    bill.dueAmount = (isNaN(grandTotal) ? 0 : grandTotal) - (isNaN(paidAmount) ? 0 : paidAmount);
    if (grandTotal === paidAmount) {
      bill.paymentStatus = 'Paid';
    } else if (paidAmount === 0) {
      bill.paymentStatus = 'Unpaid';
    } else if (paidAmount > 0 && paidAmount < grandTotal) {
      bill.paymentStatus = 'Partially Paid';
    }
    bill.updatedAt = new Date();
    await bill.save();
    return NextResponse.json({ message: 'Bill updated', success: true, user: user, bill: bill });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tokenData = await TokenData.create(request);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const billNumber = request.nextUrl.searchParams.get('billNumber');
    const bill = await Bill.findOneAndDelete({ bill: billNumber });
    if (!bill) throw new Error('Bill not found');
    return NextResponse.json({ message: 'Bill deleted', success: true, user: user, bill: bill });
  } catch (error) {
    return handleError.api(error);
  }
}
