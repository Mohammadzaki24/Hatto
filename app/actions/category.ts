"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import fs from "fs/promises"
import path from "path"

export async function saveCategory(formData: FormData) {
  const id = formData.get("id") as string | null
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const parentId = formData.get("parentId") as string | null

  // Handle image upload
  let imageUrl: string | null = (formData.get("existingImageUrl") as string) || null
  const imageFile = formData.get("imageFile") as File | null

  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, buffer)
    imageUrl = `/uploads/${fileName}`
  }

  const data = {
    name,
    slug,
    parentId: parentId || null,
    imageUrl,
  }

  if (id) {
    await db.category.update({
      where: { id },
      data,
    })
  } else {
    await db.category.create({
      data,
    })
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath(`/category/${slug}`)
  redirect("/admin/categories")
}

export async function deleteCategory(id: string) {
  await db.category.delete({
    where: { id },
  })
  
  revalidatePath("/admin/categories")
  revalidatePath("/")
}
