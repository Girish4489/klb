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
    const billOrMobileNumber = urlSearchParams.get('searchValue');
    const billType = urlSearchParams.get('type');
    const last = urlSearchParams.get('last');
    const recent = urlSearchParams.get('recent');

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
      const LastReceipt = await Receipt.findOne().sort({ createdAt: -1 }).select('receiptNumber');
      return NextResponse.json({ message: 'Last receipt', success: true, lastReceipt: LastReceipt });
    }

    if (recent) {
      const recentReceipt = await Receipt.find().sort({ createdAt: -1 }).limit(10);
      return NextResponse.json({ message: 'Recent receipt', success: true, recentReceipt: recentReceipt });
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
    const receipt = new Receipt(data);

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
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
