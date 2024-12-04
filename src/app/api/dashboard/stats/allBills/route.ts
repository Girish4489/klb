import handleError from '@/app/util/error/handleError';
import { Bill } from '@/models/klm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bills = await Bill.find();
    return NextResponse.json({ message: 'Bills fetched successfully', bills, success: true });
  } catch (error) {
    return handleError.api(error);
  }
}
