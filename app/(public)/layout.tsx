import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { AnalyticsTracker } from "@/components/public/analytics-tracker"
import { db } from "@/lib/db"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await db.siteSettings.findFirst()
  const disclaimer = settings?.footerDisclaimer || "As an Amazon Associate, we earn from qualifying purchases."

  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsTracker />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer disclaimer={disclaimer} />
    </div>
  )
}
