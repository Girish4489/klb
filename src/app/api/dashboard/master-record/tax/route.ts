// /src/app/api/dashboard/master-record/tax/route.ts
import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { Tax } from '@/models/klm';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const exsistinTaxName = await Tax.findOne({ taxName: reqBody.taxName });
    if (exsistinTaxName) {
      throw new Error('Tax name already exists');
    }
    const tax = await Tax.create(reqBody);
    await tax.save();
    return NextResponse.json({ message: 'Tax created successfully', success: true, data: tax });
  } catch (error) {
    handleError.api(error);
  }
}

export async function GET() {
  try {
    const taxes = await Tax.find();
    return NextResponse.json(taxes);
  } catch (error) {
    handleError.api(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('updateTId');
    if (!id) {
      throw new Error('Tax id is required');
    }
    const data = await req.json();
    // existing tax name except the current tax
    const exsistinTaxName = await Tax.findOne({ taxName: data.taxName, _id: { $ne: id } });
    if (exsistinTaxName) {
      throw new Error('Tax name already exists');
    }

    const tax = await Tax.findByIdAndUpdate(id, data, { new: true });
    if (!tax) {
      throw new Error('Tax not found');
    }
    await tax.save();
    return NextResponse.json({ message: 'Tax updated successfully', success: true, data: tax });
  } catch (error) {
    handleError.api(error);
  }
}

export async function DELETE(req: NextRequest) {
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
    handleError.api(error);
  }
}
