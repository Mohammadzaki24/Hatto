"use client"

import { useState } from "react"
import { saveSettings } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/ui/editor"

interface SettingsFormProps {
  settings: {
    ga4MeasurementId: string | null
    aboutContent: string
    footerDisclaimer: string
  }
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [aboutContent, setAboutContent] = useState(settings.aboutContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.set("aboutContent", aboutContent)
      await saveSettings(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="ga4MeasurementId" className="text-sm font-medium">GA4 Measurement ID</label>
          <input
            id="ga4MeasurementId"
            name="ga4MeasurementId"
            defaultValue={settings.ga4MeasurementId || ""}
            placeholder="G-XXXXXXXXXX"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">Leave empty to disable Google Analytics.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">About Page Content</label>
          <Editor value={aboutContent} onChange={setAboutContent} />
        </div>

        <div className="space-y-2">
          <label htmlFor="footerDisclaimer" className="text-sm font-medium">Footer Disclaimer</label>
          <textarea
            id="footerDisclaimer"
            name="footerDisclaimer"
            defaultValue={settings.footerDisclaimer}
            rows={3}
            required
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}
