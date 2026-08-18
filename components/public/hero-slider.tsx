"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface HeroSliderProps {
  images: { id: string; url: string }[]
  fallbackImageUrl?: string
}

export function HeroSlider({ images, fallbackImageUrl }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use fallback if images are empty
  const activeImages = images.length > 0 ? images : (fallbackImageUrl ? [{ id: 'fallback', url: fallbackImageUrl }] : [])

  useEffect(() => {
    if (activeImages.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [activeImages.length])

  if (activeImages.length === 0) {
    return <div className="absolute inset-0 bg-muted" />
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {activeImages.map((image, idx) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt="Hero Background"
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
    </div>
  )
}
