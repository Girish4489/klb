import handleError from '@/app/util/error/handleError';
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Company from '@/models/companyModel';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const user = await User.findById({ _id: userId }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error("Invalid user operation")
    if (!user.companyId && user.role !== 'owner') throw new Error("You account not linked with your company\nPlease contact Admin/Hr for linking")
    if (!user.companyId && user.role === 'owner') throw new Error("Company not yet created\nPlease register company")
    const company = await Company.findOne({ _id: user.companyId });
    if (!company) throw new Error('Company not found');
    return NextResponse.json({ success: true, data: company, message: "Company details fetched successfuly" });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const updatedCompany = await Company.findOneAndUpdate({}, { ...reqBody, updatedAt: new Date() }, { new: true });
    if (!updatedCompany) throw new Error('Failed to update company details');
    return NextResponse.json({ success: true, updatedCompany });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req)
    const user = await User.findOne({ _id: userId }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error("invalid user operation")
    if (user.role !== 'owner') throw new Error("Company setup only done by the owner");

    const reqBody = await req.json();
    const newCompany = new Company(reqBody);

    user.companyId = newCompany._id;
    await user.save();

    await newCompany.save();
    return NextResponse.json({ success: true, messate: "Company setup created", data: newCompany });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}
