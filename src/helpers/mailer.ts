import handleError from '@/app/util/error/handleError';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

interface SendEmailParams {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASSWORD,
    },
  });
};

const generateEmailContent = (emailType: 'VERIFY' | 'RESET', hashedToken: string, tokenExpiryTime: number) => {
  const indianDate = new Date(tokenExpiryTime).toLocaleString('en-IN');
  const baseUrl = process.env.DOMAIN;
  const emailContent = {
    VERIFY: {
      subject: 'Verify Your Email',
      actionDescription: 'verify your email',
      actionLinkText: 'Verify Email',
      actionLink: `${baseUrl}/auth/verify-email?token=${hashedToken}`,
    },
    RESET: {
      subject: 'Reset Your Password',
      actionDescription: 'reset your password',
      actionLinkText: 'Reset Password',
      actionLink: `${baseUrl}/auth/reset-password?token=${hashedToken}`,
    },
  };

  const { subject, actionDescription, actionLinkText, actionLink } = emailContent[emailType];

  return {
    subject,
    html: `
      <h1>Kala Mandir</h1>
      <hr>
      <h3>The link will expire after 30 minutes or link active up to ${indianDate} IST</h3>
      <p>Click <a href="${actionLink}">${actionLinkText}</a> to ${actionDescription}
        or copy and paste the link below in your browser. <br> ${actionLink}</p>`,
  };
};

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const tokenExpiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds

    const updateUser =
      emailType === 'VERIFY'
        ? { verifyToken: hashedToken, verifyTokenExpiry: tokenExpiryTime }
        : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: tokenExpiryTime };

    await User.findByIdAndUpdate(userId, updateUser);

    const transporter = createTransporter();
    const { subject, html } = generateEmailContent(emailType, hashedToken, tokenExpiryTime);

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    handleError.log(error);
  }
};
