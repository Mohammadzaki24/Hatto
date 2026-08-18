"use client"

import { trackProductClick } from "@/components/public/analytics-tracker"

export function ProductClickTracker({ 
  productId, 
  children 
}: { 
  productId: string
  children: React.ReactNode 
}) {
  return (
    <div onClick={() => trackProductClick(productId)}>
      {children}
    </div>
  )
}
