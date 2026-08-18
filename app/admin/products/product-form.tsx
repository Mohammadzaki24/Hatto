"use client"

import { useState } from "react"
import { saveProduct } from "@/app/actions/product"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/ui/editor"
import { ImageCropper } from "@/components/ui/image-cropper"
import Image from "next/image"
import Link from "next/link"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    slug: string
    description: string
    affiliateUrl: string
    videoUrl: string | null
    videoUrl2: string | null
    videoUrl3: string | null
    badge: string | null
    images: { url: string; order: number }[]
    categoryId: string
  }
  categories: { id: string; name: string }[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [description, setDescription] = useState(product?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // States for up to 3 images
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([
    product?.images?.find(img => img.order === 0)?.url || null,
    product?.images?.find(img => img.order === 1)?.url || null,
    product?.images?.find(img => img.order === 2)?.url || null,
  ])
  
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null)
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null)
  const [croppedBlobs, setCroppedBlobs] = useState<(Blob | null)[]>([null, null, null])

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setTempImageSrc(url)
      setCroppingIndex(index)
    }
  }

  const handleCropComplete = (blob: Blob) => {
    if (croppingIndex !== null) {
      const newBlobs = [...croppedBlobs]
      newBlobs[croppingIndex] = blob
      setCroppedBlobs(newBlobs)

      const newUrls = [...previewUrls]
      newUrls[croppingIndex] = URL.createObjectURL(blob)
      setPreviewUrls(newUrls)
    }
    setCroppingIndex(null)
    setTempImageSrc(null)
  }

  const handleRemoveImage = (index: number) => {
    const newBlobs = [...croppedBlobs]
    newBlobs[index] = null
    setCroppedBlobs(newBlobs)

    const newUrls = [...previewUrls]
    newUrls[index] = null
    setPreviewUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.set("description", description)
      
      // Append files or keep existing
      for (let i = 0; i < 3; i++) {
        if (croppedBlobs[i]) {
          formData.set(`imageFile${i}`, new File([croppedBlobs[i]!], `image${i}.jpg`, { type: "image/jpeg" }))
        } else if (previewUrls[i] && product) {
          // If there's a preview URL but no new cropped blob, it means keeping the existing image
          // Check if the current previewUrl starts with blob: (which means it's unsaved somehow, though we shouldn't hit this)
          // If it's a real URL, pass it to keep
          if (!previewUrls[i]!.startsWith("blob:")) {
            formData.set(`existingImageUrl${i}`, previewUrls[i]!)
          }
        }
      }

      if (product) {
        formData.set("id", product.id)
      }
      
      await saveProduct(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="grid gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId || ""}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="affiliateUrl" className="text-sm font-medium">Amazon Affiliate URL</label>
          <input
            id="affiliateUrl"
            name="affiliateUrl"
            type="url"
            defaultValue={product?.affiliateUrl}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="videoUrl" className="text-sm font-medium">Video URL 1 (TikTok or YouTube)</label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            defaultValue={product?.videoUrl || ""}
            placeholder="e.g. https://www.youtube.com/watch?v=..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="videoUrl2" className="text-sm font-medium">Video URL 2 (Optional)</label>
          <input
            id="videoUrl2"
            name="videoUrl2"
            type="url"
            defaultValue={product?.videoUrl2 || ""}
            placeholder="e.g. https://www.tiktok.com/..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="videoUrl3" className="text-sm font-medium">Video URL 3 (Optional)</label>
          <input
            id="videoUrl3"
            name="videoUrl3"
            type="url"
            defaultValue={product?.videoUrl3 || ""}
            placeholder="e.g. https://www.youtube.com/watch?v=..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="badge" className="text-sm font-medium">Badge (Optional)</label>
          <input
            id="badge"
            name="badge"
            defaultValue={product?.badge || ""}
            placeholder="e.g. Bestseller, Editor's Pick"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="text-sm font-medium">Product Images (Max 3)</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Image {i + 1}</label>
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full aspect-square rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                    {previewUrls[i] ? (
                      <>
                        <Image src={previewUrls[i]!} alt={`Preview ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Empty</span>
                    )}
                  </div>
                  <input
                    id={`imageFile${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(i, e)}
                    className="flex w-full text-xs"
                    required={i === 0 && !previewUrls[0]} // First image is required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t pt-6">
          <label className="text-sm font-medium">Description</label>
          <Editor value={description} onChange={setDescription} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/products">Cancel</Link>
        </Button>
      </div>
      
      {croppingIndex !== null && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCroppingIndex(null)
            setTempImageSrc(null)
          }}
        />
      )}
    </form>
  )
}
