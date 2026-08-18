import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, path, productId } = body
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

    if (type === "pageview" && path) {
      await db.pageView.upsert({
        where: {
          path_date: { path, date: today },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          path,
          date: today,
          count: 1,
        },
      })
    } else if (type === "click" && productId) {
      await db.productClick.upsert({
        where: {
          productId_date: { productId, date: today },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          productId,
          date: today,
          count: 1,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
