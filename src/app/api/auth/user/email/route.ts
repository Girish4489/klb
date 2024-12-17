import { connect } from '@/dbConfig/dbConfig';
import User, { IUser, RoleType } from '@models/userModel';
import handleError from '@utils/error/handleError';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect();

// returns the single user having the email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User found',
      data: user,
      success: true,
    });
  } catch (error) {
    return handleError.api(error, false);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      email,
      data,
    }: {
      email: string;
      data: {
        companyAccess?: {
          role?: RoleType;
          access?: Partial<NonNullable<IUser['companyAccess']>['access']>;
          accessLevels?: RoleType[];
          removeAccessLevel?: RoleType;
        };
        secondaryEmails?: string[];
        mobile?: string[];
      };
    } = await request.json();

    if (!email || !data) {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }

    const user = (await User.findOne({ email })) as IUser;

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Initialize companyAccess if it doesn't exist
    if (!user.companyAccess) {
      user.companyAccess = {
        companyId: new mongoose.Types.ObjectId(),
        role: 'guest',
        access: {
          login: true,
          canEdit: false,
          canDelete: false,
          canView: true,
        },
        accessLevels: ['guest'],
      };
    }

    if (data.companyAccess) {
      const { role, access, accessLevels, removeAccessLevel } = data.companyAccess;

      if (role) {
        user.companyAccess.role = role;
      }

      if (access) {
        user.companyAccess.access = {
          ...user.companyAccess.access,
          ...access,
        };
      }

      if (accessLevels) {
        user.companyAccess.accessLevels = Array.from(new Set([...user.companyAccess.accessLevels, ...accessLevels]));
      }

      if (removeAccessLevel) {
        user.companyAccess.accessLevels = user.companyAccess.accessLevels.filter(
          (l: RoleType) => l !== removeAccessLevel,
        );
      }
    }

    if (data.secondaryEmails) {
      user.secondaryEmails = data.secondaryEmails;
    }

    if (data.mobile) {
      user.mobile = data.mobile;
    }

    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError.api(error, false);
  }
}
