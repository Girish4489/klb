import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Bill } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const billNumber = request.nextUrl.searchParams.get('billNo');
    const today = request.nextUrl.searchParams.get('today');
    const week = request.nextUrl.searchParams.get('week');
    const last = request.nextUrl.searchParams.get('last');
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );

    if (!user) throw new Error('User not found');

    if (billNumber) {
      const bill = await Bill.findOne({ billNumber: billNumber });
      if (!bill) throw new Error('Bill not found');
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
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
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
    await bill.save();
    const today = await Bill.findOne({
      billNumber: bill.billNumber,
    }).select('-__v -updatedAt -createdAt -_id -order -paymentStatus -email -tax');
    return NextResponse.json({ message: 'Bill created', success: true, bill: bill, today: today });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const data = await request.json();
    const bill = await Bill.findOneAndUpdate({ billNumber: data.billNumber }, data, { new: true });
    if (!bill) throw new Error('Bill not found');
    return NextResponse.json({ message: 'Bill updated', success: true, user: user, bill: bill });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -__v -email -isVerified -createdAt -updatedAt -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user) throw new Error('User not found');
    const billNumber = request.nextUrl.searchParams.get('billNumber');
    const bill = await Bill.findOneAndDelete({ bill: billNumber });
    if (!bill) throw new Error('Bill not found');
    return NextResponse.json({ message: 'Bill deleted', success: true, user: user, bill: bill });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
