import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import { token } from '@utils/token/token';
import nodemailer from 'nodemailer';

interface SendEmailParams {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

const createTransporter = (): nodemailer.Transporter => {
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

const generateEmailContent = (
  emailType: 'VERIFY' | 'RESET',
  token: string,
  tokenExpiryTime: number,
): { subject: string; html: string } => {
  const indianDate = new Date(tokenExpiryTime * 1000).toLocaleString('en-IN');
  const baseUrl = process.env.DOMAIN;
  const emailContent = {
    VERIFY: {
      subject: 'Verify Your Email',
      actionDescription: 'verify your email',
      actionLinkText: 'Verify Email',
      actionLink: `${baseUrl}/auth/verify-email?token=${token}`,
    },
    RESET: {
      subject: 'Reset Your Password',
      actionDescription: 'reset your password',
      actionLinkText: 'Reset Password',
      actionLink: `${baseUrl}/auth/reset-password?token=${token}`,
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

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams): Promise<nodemailer.SentMessageInfo | undefined> => {
  try {
    const tokenData = { id: userId, email };
    const emailToken = await token.create(tokenData, '30m');
    const decodedToken = await token.verify(emailToken);
    const tokenExpiryTime = decodedToken?.exp || 0;

    const updateUser =
      emailType === 'VERIFY'
        ? { verifyToken: emailToken, verifyTokenExpiry: new Date(tokenExpiryTime * 1000) }
        : { forgotPasswordToken: emailToken, forgotPasswordTokenExpiry: new Date(tokenExpiryTime * 1000) };

    await User.findByIdAndUpdate(userId, updateUser);

    const transporter = createTransporter();
    const { subject, html } = generateEmailContent(emailType, emailToken, tokenExpiryTime);

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
