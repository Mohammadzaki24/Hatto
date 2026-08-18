import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendResetLink } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const admin = await db.adminUser.findUnique({
      where: { email },
    })

    if (!admin) {
      // Return success even if email not found to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.adminUser.update({
      where: { id: admin.id },
      data: {
        resetToken,
        resetTokenExpiresAt: expiresAt,
      },
    })

    await sendResetLink(email, resetToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
