import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const tokenExpiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds
    const indianDate = new Date(tokenExpiryTime).toLocaleString('en-IN');

    let subject = '';
    let actionDescription = '';
    let actionLinkText = '';
    let actionLink = '';

    if (emailType === 'VERIFY') {
      subject = 'Verify Your Email';
      actionDescription = 'verify your email';
      actionLinkText = 'Verify Email';
      actionLink = `${process.env.DOMAIN}/auth/verify-email?token=${hashedToken}`;
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: tokenExpiryTime,
      });
    } else if (emailType === 'RESET') {
      subject = 'Reset Your Password';
      actionDescription = 'reset your password';
      actionLinkText = 'Reset Password';
      actionLink = `${process.env.DOMAIN}/auth/reset-password?token=${hashedToken}`;
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: tokenExpiryTime,
      });
    }

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: subject,
      html: `
        <h1>Kala Mandir</h1>
        <hr>
        <h3>The link will expire after 30 minutes or link active up to ${indianDate} IST</h3>
        <p>Click <a href="${actionLink}">${actionLinkText}</a> to ${actionDescription}
          or copy and paste the link below in your browser. <br> ${actionLink}</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    // Handle error
    // console.error(error);
  }
};
