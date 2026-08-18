import { db } from "@/lib/db"
import { SettingsForm } from "./settings-form"

export default async function AdminSettingsPage() {
  let settings = await db.siteSettings.findFirst()

  if (!settings) {
    settings = {
      id: 1,
      ga4MeasurementId: null,
      aboutContent: "We curate the best minimalist items.",
      footerDisclaimer: "Disclosure: As an Amazon Associate, we earn from qualifying purchases.",
      updatedAt: new Date(),
    }
  }

  const validSettings = {
    ga4MeasurementId: settings.ga4MeasurementId,
    aboutContent: settings.aboutContent || "",
    footerDisclaimer: settings.footerDisclaimer || "",
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage global site configuration.</p>
      </div>
      
      <SettingsForm settings={validSettings} />
    </div>
  )
}
