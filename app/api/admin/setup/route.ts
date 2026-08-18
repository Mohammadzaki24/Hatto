import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Valid email and password (min 6 chars) are required" },
        { status: 400 }
      )
    }

    // Check if any admin already exists
    const adminCount = await db.adminUser.count()
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "An admin user already exists. Setup is disabled." },
        { status: 403 }
      )
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create the admin user
    await db.adminUser.create({
      data: {
        email,
        passwordHash,
      }
    })

    // Optionally create a session immediately so they don't have to login right away
    await createSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
