import nodemailer from "nodemailer"

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendOTP(to: string, otp: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP_EMAIL or SMTP_PASSWORD is not set. OTP is:", otp)
    return
  }

  const mailOptions = {
    from: `"HATTO Admin" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Your Admin Login OTP - HATTO",
    text: `Your OTP code is: ${otp}\nThis code will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Admin Login OTP</h2>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for logging into the HATTO Admin Dashboard is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <strong style="font-size: 24px; letter-spacing: 5px; color: #111;">${otp}</strong>
        </div>
        <p style="font-size: 14px; color: #888;">This code will expire in 5 minutes.</p>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not request this, please secure your account immediately.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendResetLink(to: string, token: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP_EMAIL or SMTP_PASSWORD is not set. Reset token is:", token)
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resetUrl = `${appUrl}/admin/reset-password?token=${token}`

  const mailOptions = {
    from: `"HATTO Admin" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Reset Your Password - HATTO",
    text: `You requested a password reset. Click this link to reset your password: ${resetUrl}\nThis link will expire in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">You requested to reset your password for the HATTO Admin Dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #888;">Or copy and paste this link into your browser: <br/> ${resetUrl}</p>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
