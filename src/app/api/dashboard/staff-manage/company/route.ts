import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@/helpers/getDataFromToken';
import Company from '@/models/companyModel';
import User from '@/models/userModel';
import handleError from '@util/error/handleError';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(req: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(req);
    const userId = tokenData.getId();
    const user = await User.findById({ _id: userId }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry',
    );
    if (!user) throw new Error('Invalid user operation');
    if (!user.companyAccess.companyId && user.companyAccess.role !== 'owner')
      throw new Error('You account not linked with your company\nPlease contact Admin/Hr for linking');
    if (!user.companyAccess.companyId && user.companyAccess.role === 'owner')
      throw new Error('Company not yet created\nPlease register company');
    const company = await Company.findOne({ _id: user.companyAccess.companyId });
    if (!company) throw new Error('Company not found');
    return NextResponse.json({ success: true, data: company, message: 'Company details fetched successfuly' });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { _id, ...updateData } = reqBody;
    const updatedCompany = await Company.findByIdAndUpdate(
      _id,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedCompany) throw new Error('Failed to update company details');

    // Update user roles and access levels
    if (updateData.users) {
      for (const user of updateData.users) {
        await User.findByIdAndUpdate(user.userId, {
          'companyAccess.role': user.role,
          'companyAccess.access': user.access,
          'companyAccess.accessLevels': user.accessLevels,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Company details updated successfully', data: updatedCompany });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function POST(req: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(req);
    const userId = tokenData.getId();
    const user = await User.findOne({ _id: userId }).select(
      '-password -username -email -isVerified -isAdmin -theme -profileImage -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -preferences',
    );
    if (!user) throw new Error('invalid user operation..');
    if (user.companyAccess.role !== 'owner') throw new Error('Company setup only done by the owner');

    const reqBody = await req.json();
    const newCompany = new Company(reqBody);

    user.companyAccess.companyId = newCompany._id;
    await user.save();

    await newCompany.save();
    return NextResponse.json({ success: true, message: 'Company setup created', data: newCompany });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}
