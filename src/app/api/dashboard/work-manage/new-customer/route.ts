import { connect } from '@/dbConfig/dbConfig';
import { Customer } from '@models/klm';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Check if customer phone is already present
    const existingCustomer = await Customer.findOne({ phone: reqBody.phone });
    if (existingCustomer) throw new Error('Customer Phone number already exists\nPhone number should be Unique or New');

    const customer = await Customer.create(reqBody);
    customer.save();
    return NextResponse.json({
      message: 'Customer created successfully',
      success: true,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
