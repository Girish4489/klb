import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;
    const newPassword = password.password;
    const user = await User.findOne({
      forgotPasswordToken: token,
    });

    if (
      user == null ||
      user == undefined ||
      user.forgotPasswordTokenExpiry < Date.now()
    ) {
      return NextResponse.json({ error: "Link expired" }, { status: 400 });
    } else if (user.forgotPasswordToken !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const prevHashedPassword = user.password;
    // check is user password is the same as the new password
    const decryptedPassword = await bcryptjs.compare(
      newPassword,
      prevHashedPassword
    );
    console.log("decrypted password " + decryptedPassword);
    if (decryptedPassword) {
      return NextResponse.json(
        { error: "New password cannot be the same as the old password" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
