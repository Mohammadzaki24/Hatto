import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const secretKey = process.env.SESSION_SECRET || "default_super_secret_key_change_me_in_prod"
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
 
  const cookieStore = await cookies()
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "strict",
    path: "/",
  })
}

export async function verifySession(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value
  if (!session) return null
  return await verifySession(session)
}

export async function requireAdminSession() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}

export async function verifyPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) return false
  return bcrypt.compare(password, hash)
}
