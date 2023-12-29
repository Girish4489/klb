import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const tokenExpiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds
    const indianDate = new Date(tokenExpiryTime).toLocaleString('en-IN');

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: tokenExpiryTime,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: tokenExpiryTime,
      });
    }

    var transport = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Use the correct SMTP server hostname
      port: 587, // Use the appropriate port for TLS/STARTTLS
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL, // Use the environment variable for Gmail email
        pass: process.env.GMAILPASSWORD, // Use the environment variable for Gmail password
      },
    });

    const mailOptions = {
      from: 'kalamandir@gmail.com',
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `
        <h1>Kala Mandir</h1>
        <hr>
        <h3>The link will expire after 30 minutes or link active upto ${indianDate} IST</h3>
        <p>Click <a href="${process.env.DOMAIN}/auth/${
          emailType === 'VERIFY' ? 'verify-email' : 'reset-password'
        }?token=${hashedToken}">here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}
              or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/auth/${
                emailType === 'VERIFY' ? 'verify-email' : 'reset-password'
              }?token=${hashedToken}</p>`,
    };
    // console.log('before mail');
    const mailresponse = await transport.sendMail(mailOptions);
    // console.log('after mail');
    return mailresponse;
  } catch (error) {
    // console.log(error);
  }
};
