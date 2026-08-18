import { NextResponse } from "next/server"
import { createSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendOTP } from "@/lib/email"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    let { email, password, otp } = await request.json()
    email = (email || "").trim().toLowerCase()

    const authError = NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )

    if (!email) {
      return authError
    }

    const admin = await db.adminUser.findUnique({
      where: { email }
    })

    if (!admin) {
      return authError
    }

    // Step 1: Verify Password and Send OTP
    if (!otp) {
      if (!password) return authError

      const isValid = await bcrypt.compare(password, admin.passwordHash)
      if (!isValid) return authError

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      await db.adminUser.update({
        where: { id: admin.id },
        data: {
          otpCode: generatedOtp,
          otpExpiresAt,
        }
      })

      await sendOTP(email, generatedOtp)

      return NextResponse.json({ success: true, requireOtp: true })
    }

    // Step 2: Verify OTP
    if (otp) {
      if (!admin.otpCode || !admin.otpExpiresAt || admin.otpExpiresAt < new Date()) {
        return NextResponse.json({ error: "OTP expired or invalid" }, { status: 400 })
      }

      if (admin.otpCode !== otp) {
        return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 })
      }

      // Clear OTP
      await db.adminUser.update({
        where: { id: admin.id },
        data: {
          otpCode: null,
          otpExpiresAt: null,
        }
      })

      await createSession()

      return NextResponse.json({ success: true })
    }

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
