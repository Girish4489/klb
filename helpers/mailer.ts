import User from '@models/userModel';
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

export interface MailResponse {
  success: boolean;
  message: string;
  error?: string;
  sentMessageInfo?: nodemailer.SentMessageInfo;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams): Promise<MailResponse> => {
  try {
    if (!userId || !email) {
      console.error('Missing required fields:', { userId, email });
      return {
        success: false,
        message: 'Missing required fields',
        error: 'User ID and email are required',
      };
    }

    const user = await User.findById(userId).select('username email isVerified isAdmin isCompanyMember lastLogin');
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        error: 'Invalid user ID',
      };
    }

    const tokenData = {
      id: userId,
      email,
      username: user.username,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isCompanyMember: user.isCompanyMember,
      lastLogin: user.lastLogin,
    };

    let emailToken;
    try {
      emailToken = await token.create(tokenData, '30m');
    } catch (tokenError) {
      console.error('Token creation failed:', tokenError);
      return {
        success: false,
        message: 'Failed to create verification token',
        error: tokenError instanceof Error ? tokenError.message : 'Token creation failed',
      };
    }

    if (!emailToken) {
      return {
        success: false,
        message: 'Token creation failed',
        error: 'Unable to generate verification token',
      };
    }

    const decodedToken = await token.verify(emailToken);
    if (!decodedToken) {
      return {
        success: false,
        message: 'Token verification failed',
        error: 'Invalid token generated',
      };
    }

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

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: `${emailType === 'VERIFY' ? 'Verification' : 'Reset password'} email sent successfully`,
      sentMessageInfo: info,
    };
  } catch (error) {
    console.error('Mail service error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown mail service error',
    };
  }
};
