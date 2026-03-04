import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const campusName = "KIST Hub";
const brandColor = "#2c3e50";
const accentColor = "#e67e22";

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  try {
    await transporter.sendMail({
      from: `"${campusName}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Verify Your Student Account - ${campusName}`,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
          <div style="background-color: ${brandColor}; padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">${campusName}</h1>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">The Official KIST Student Marketplace & Portal</p>
          </div>
          <div style="padding: 30px; text-align: center; color: #333;">
            <h2 style="color: ${brandColor};">Welcome to the KIST Community!</h2>
            <p>Please verify your campus email to start using the marketplace and lost & found services.</p>
            <a href="${verificationUrl}"
              style="display:inline-block; margin-top:20px; background-color: ${accentColor}; color:white; text-decoration:none; padding: 12px 30px; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Verify Email
            </a>
            <p style="margin-top:25px; font-size: 12px; color: #777;">If you did not sign up for a KIST Hub account, please ignore this email.</p>
          </div>
          <div style="background-color:#eee; text-align:center; padding:15px; font-size:12px; color:#666;">
            <p>&copy; ${new Date().getFullYear()} Kiambu Institute of Science and Technology. All rights reserved.</p>
          </div>
        </div>
      </div>
      `,
    });

    console.log("KIST Verification email sent!");
  } catch (error) {
    console.error("Error sending KIST verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"${campusName}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Reset Your Password - ${campusName}`,
      html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif; background-color:#f9f9f9; margin:0; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border: 1px solid #ddd; overflow:hidden;">
          <div style="background-color: #c0392b; padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px;">${campusName} Security</h1>
          </div>
          <div style="padding:30px; text-align:center; color:#333;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your KIST Hub account.</p>
            <a href="${resetUrl}"
              style="display:inline-block; margin-top:20px; background-color:#c0392b; color:white; text-decoration:none; padding:12px 28px; border-radius:5px; font-size:16px; font-weight:bold;">
              Reset Password
            </a>
            <p style="margin-top:25px; font-size:12px; color:#777;">This link will expire in 1 hour.</p>
          </div>
          <div style="background-color:#eee; text-align:center; padding:15px; font-size:12px; color:#666;">
            <p>&copy; ${new Date().getFullYear()} KIST Hub Admin Team.</p>
          </div>
        </div>
      </div>
      `,
    });

    console.log("KIST Password reset email sent!");
  } catch (error) {
    console.error("Error sending KIST password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};