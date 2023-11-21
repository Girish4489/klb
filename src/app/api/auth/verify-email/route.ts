import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    // Check if token is provided
    if (!token) {
      return NextResponse.json({
        message: "Token is missing",
        success: false,
        type: "missing-token",
      });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
      isVerified: false,
    });

    if (
      user == null ||
      user == undefined ||
      user.verifyTokenExpiry < Date.now()
    ) {
      return NextResponse.json({
        message: "Link expired",
        success: false,
        type: "token-expired",
      });
    } else if (user.verifyToken !== token) {
      return NextResponse.json({
        message: "Invalid token",
        success: false,
        type: "invalid-token",
      });
    } else if (user.isVerified) {
      return NextResponse.json({
        message: "Email already verified",
        success: false,
        type: "already-verified",
      });
    }
    if (!user) {
      return NextResponse.json({
        message: "Invalid token",
        success: false,
        type: "invalid-token",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified Successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
