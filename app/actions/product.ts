"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import fs from "fs/promises"
import path from "path"

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string | null
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const affiliateUrl = formData.get("affiliateUrl") as string
  const videoUrl = formData.get("videoUrl") as string | null
  const videoUrl2 = formData.get("videoUrl2") as string | null
  const videoUrl3 = formData.get("videoUrl3") as string | null
  const badge = formData.get("badge") as string | null
  const categoryId = formData.get("categoryId") as string

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  
  // Prepare images array
  const finalImages: { url: string; order: number }[] = []

  for (let i = 0; i < 3; i++) {
    const file = formData.get(`imageFile${i}`) as File | null
    const existingUrl = formData.get(`existingImageUrl${i}`) as string | null

    if (file && file.size > 0) {
      try {
        await fs.access(uploadDir)
      } catch {
        await fs.mkdir(uploadDir, { recursive: true })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
      const filePath = path.join(uploadDir, fileName)
      
      await fs.writeFile(filePath, buffer)
      finalImages.push({ url: `/uploads/${fileName}`, order: i })
    } else if (existingUrl) {
      finalImages.push({ url: existingUrl, order: i })
    }
  }

  const data = {
    name,
    slug,
    description,
    affiliateUrl,
    videoUrl: videoUrl || null,
    videoUrl2: videoUrl2 || null,
    videoUrl3: videoUrl3 || null,
    badge: badge || null,
    categoryId,
  }

  let productId = id

  if (id) {
    await db.product.update({
      where: { id },
      data,
    })
  } else {
    const newProduct = await db.product.create({
      data,
    })
    productId = newProduct.id
  }

  // Update or create the product image relations
  if (productId) {
    // Delete existing images to replace with the new ones
    await db.productImage.deleteMany({
      where: { productId },
    })
    
    if (finalImages.length > 0) {
      await db.productImage.createMany({
        data: finalImages.map(img => ({
          productId: productId!,
          url: img.url,
          order: img.order,
        }))
      })
    }
  }

  revalidatePath("/admin/products")
  revalidatePath("/")
  revalidatePath(`/products/${slug}`)
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  await db.product.delete({
    where: { id },
  })
  
  revalidatePath("/admin/products")
  revalidatePath("/")
}
