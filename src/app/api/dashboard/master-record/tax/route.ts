// /src/app/api/dashboard/master-record/tax/route.ts
import { connect } from '@/dbConfig/dbConfig';
import { Tax } from '@models/klm';
import handleError from '@utils/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await req.json();
    const existingTaxName = await Tax.findOne({ taxName: reqBody.taxName });
    if (existingTaxName) {
      throw new Error('Tax name already exists');
    }
    const tax = await Tax.create(reqBody);
    await tax.save();
    return NextResponse.json({ message: 'Tax created successfully', success: true, data: tax });
  } catch (error) {
    return handleError.api(error);
  }
}

// returns all taxes from the database
export async function GET(): Promise<NextResponse> {
  try {
    const taxes = await Tax.find();
    return NextResponse.json({ message: 'Taxes fetched successfully', success: true, taxes: taxes });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const id = req.nextUrl.searchParams.get('updateTId');
    if (!id) {
      throw new Error('Tax id is required');
    }
    const data = await req.json();
    // existing tax name except the current tax
    const existingTaxName = await Tax.findOne({ taxName: data.taxName, _id: { $ne: id } });
    if (existingTaxName) {
      throw new Error('Tax name already exists');
    }

    const tax = await Tax.findByIdAndUpdate(id, data, { new: true });
    if (!tax) {
      throw new Error('Tax not found');
    }
    await tax.save();
    return NextResponse.json({ message: 'Tax updated successfully', success: true, data: tax });
  } catch (error) {
    return handleError.api(error);
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const id = req.nextUrl.searchParams.get('deleteTId');

    if (!id) {
      throw new Error('Tax id is required');
    }

    const tax = await Tax.findByIdAndDelete(id);
    if (!tax) {
      throw new Error('Tax not found');
    }

    return NextResponse.json({ message: 'Tax deleted successfully', success: true });
  } catch (error) {
    return handleError.api(error);
  }
}
