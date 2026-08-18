"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import fs from "fs/promises"
import path from "path"

export async function saveHeroSettings(formData: FormData) {
  const heroTitle = formData.get("heroTitle") as string
  const heroSubtitle = formData.get("heroSubtitle") as string
  const heroCtaText = formData.get("heroCtaText") as string
  const heroCtaLink = formData.get("heroCtaLink") as string
  const heroFontFamily = formData.get("heroFontFamily") as string || "font-inter"
  
  // Handle new images
  const imageFiles = formData.getAll("imageFiles") as File[]
  const uploadedImageUrls: string[] = []

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  try {
    await fs.access(uploadDir)
  } catch {
    await fs.mkdir(uploadDir, { recursive: true })
  }

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)
      uploadedImageUrls.push(`/uploads/${fileName}`)
    }
  }

  // Handle existing images to keep
  const existingImagesJson = formData.get("existingImages") as string
  const existingImages: { id: string; url: string; order: number }[] = existingImagesJson 
    ? JSON.parse(existingImagesJson) 
    : []

  const data = {
    heroTitle,
    heroSubtitle,
    heroCtaText,
    heroCtaLink,
    heroFontFamily,
  }

  const existing = await db.homepageSettings.findFirst()

  if (existing) {
    await db.homepageSettings.update({
      where: { id: existing.id },
      data,
    })
  } else {
    await db.homepageSettings.create({
      data: {
        id: 1,
        ...data,
      },
    })
  }

  // Update HeroImages
  const settingsId = existing ? existing.id : 1

  // First, clear existing images not in the kept list
  const existingImageIdsToKeep = existingImages.map(img => img.id).filter(id => id && !id.startsWith("new-"))
  await db.heroImage.deleteMany({
    where: {
      settingsId,
      id: {
        notIn: existingImageIdsToKeep
      }
    }
  })

  // Then update orders for existing
  for (const img of existingImages) {
    if (!img.id.startsWith("new-")) {
      await db.heroImage.update({
        where: { id: img.id },
        data: { order: img.order }
      })
    }
  }

  // Finally create new images
  if (uploadedImageUrls.length > 0) {
    let maxOrder = existingImages.length
    await db.heroImage.createMany({
      data: uploadedImageUrls.map((url, idx) => ({
        url,
        order: maxOrder + idx,
        settingsId
      }))
    })
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")
}

export async function saveTiles(section: string, tiles: any[]) {
  // Clear existing tiles for this section
  await db.homepageTile.deleteMany({
    where: { section },
  })

  // Insert new tiles
  if (tiles.length > 0) {
    await db.homepageTile.createMany({
      data: tiles.map((tile, index) => ({
        section,
        type: tile.type,
        productId: tile.type === "PRODUCT" ? tile.itemId : null,
        categoryId: tile.type === "CATEGORY" ? tile.itemId : null,
        order: index,
      })),
    })
  }

  revalidatePath("/")
  revalidatePath("/admin/homepage")
}
