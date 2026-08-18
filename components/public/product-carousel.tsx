"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductCarouselProps {
  images: { id: string; url: string; order: number }[]
  variant: "autoplay" | "manual"
  altText: string
}

export function ProductCarousel({ images, variant, altText }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasMultipleImages = images.length > 1

  // Autoplay logic
  useEffect(() => {
    if (variant === "autoplay" && hasMultipleImages) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [variant, images.length, hasMultipleImages])

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // If no images at all
  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, idx) => (
        <div
          key={image.id || idx}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            idx === currentIndex 
              ? "opacity-100 translate-x-0" 
              : idx < currentIndex 
                ? "opacity-0 -translate-x-full" 
                : "opacity-0 translate-x-full"
          }`}
        >
          <Image
            src={image.url}
            alt={`${altText} - Image ${idx + 1}`}
            fill
            className="object-contain"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Manual Controls */}
      {variant === "manual" && hasMultipleImages && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/50"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-4 bg-black dark:bg-white" : "w-1.5 bg-black/30 dark:bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
