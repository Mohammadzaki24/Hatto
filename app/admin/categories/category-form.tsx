"use client"

import { useState } from "react"
import { saveCategory } from "@/app/actions/category"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    parentId: string | null
    imageUrl: string | null
  }
  categories: { id: string; name: string }[]
}

export function CategoryForm({ category, categories }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(category?.imageUrl || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (category) {
        formData.set("id", category.id)
      }
      if (category?.imageUrl) {
        formData.set("existingImageUrl", category.imageUrl)
      }
      await saveCategory(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            defaultValue={category?.name}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={category?.slug}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="parentId" className="text-sm font-medium">Parent Category (Optional)</label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={category?.parentId || ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === category?.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="imageFile" className="text-sm font-medium">Category Image</label>
          {previewUrl && (
            <div className="relative w-full aspect-[4/3] rounded-lg border overflow-hidden bg-muted">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Category"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/categories">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
