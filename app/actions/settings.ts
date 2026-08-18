"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function saveSettings(formData: FormData) {
  const ga4MeasurementId = formData.get("ga4MeasurementId") as string | null
  const aboutContent = formData.get("aboutContent") as string
  const footerDisclaimer = formData.get("footerDisclaimer") as string

  // Always use id = "1" as there's only one row for settings
  const data = {
    ga4MeasurementId: ga4MeasurementId || null,
    aboutContent,
    footerDisclaimer,
  }

  const existing = await db.siteSettings.findFirst()

  if (existing) {
    await db.siteSettings.update({
      where: { id: existing.id },
      data,
    })
  } else {
    await db.siteSettings.create({
      data: {
        id: 1,
        ...data,
      },
    })
  }

  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/admin/settings")
  redirect("/admin/settings")
}
