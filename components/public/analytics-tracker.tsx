"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", path: pathname }),
    }).catch(() => {
      // Silently fail — analytics should never break the site
    })
  }, [pathname])

  return null
}

export function trackProductClick(productId: string) {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "click", productId }),
  }).catch(() => {})
}
