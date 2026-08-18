"use client"

import { useState } from "react"
import { saveHeroSettings } from "@/app/actions/homepage"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface HeroFormProps {
  settings: {
    heroTitle: string
    heroSubtitle: string
    heroCtaText: string
    heroCtaLink: string
    heroImageUrl: string
    heroFontFamily: string
    heroImages: { id: string; url: string; order: number }[]
  }
}

export function HeroForm({ settings }: HeroFormProps) {
  // If no heroImages exist but heroImageUrl exists (legacy), convert it
  const initialImages = settings.heroImages && settings.heroImages.length > 0 
    ? settings.heroImages 
    : (settings.heroImageUrl ? [{ id: 'legacy', url: settings.heroImageUrl, order: 0 }] : [])

  const [images, setImages] = useState<{ id: string; url: string; order: number; file?: File }[]>(initialImages)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file, idx) => ({
        id: `new-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        order: images.length + idx,
        file
      }))
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (idToRemove: string) => {
    setImages(images.filter(img => img.id !== idToRemove).map((img, idx) => ({ ...img, order: idx })))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      
      // Append files for new images
      const newImages = images.filter(img => img.file)
      newImages.forEach(img => {
        formData.append("imageFiles", img.file!)
      })
      
      // Pass existing images data to backend so it knows what to keep and the orders
      const existingImagesToKeep = images.filter(img => !img.file).map(img => ({
        id: img.id,
        url: img.url,
        order: img.order
      }))
      formData.set("existingImages", JSON.stringify(existingImagesToKeep))

      await saveHeroSettings(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="heroTitle" className="text-sm font-medium">Hero Title</label>
          <input
            id="heroTitle"
            name="heroTitle"
            defaultValue={settings.heroTitle}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="heroSubtitle" className="text-sm font-medium">Hero Subtitle</label>
          <textarea
            id="heroSubtitle"
            name="heroSubtitle"
            defaultValue={settings.heroSubtitle}
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="heroCtaText" className="text-sm font-medium">CTA Button Text</label>
            <input
              id="heroCtaText"
              name="heroCtaText"
              defaultValue={settings.heroCtaText}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="heroCtaLink" className="text-sm font-medium">CTA Button Link</label>
            <input
              id="heroCtaLink"
              name="heroCtaLink"
              defaultValue={settings.heroCtaLink}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="heroFontFamily" className="text-sm font-medium">Hero Font Family</label>
          <select
            id="heroFontFamily"
            name="heroFontFamily"
            defaultValue={settings.heroFontFamily}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="font-inter">Inter (Modern Clean)</option>
            <option value="font-syne">Syne (Bold Modern)</option>
            <option value="font-playfair">Playfair Display (Classic Serif)</option>
            <option value="font-fraunces">Fraunces (Vintage Serif)</option>
            <option value="font-oswald">Oswald (Bold Impact)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hero Images (Slider)</label>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-lg border overflow-hidden bg-muted group">
                  <Image src={img.url} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Hero Settings"}
      </Button>
    </form>
  )
}
