import { db } from "@/lib/db"
import { HeroForm } from "./hero-form"
import { TilesManager } from "./tiles-manager"

export default async function AdminHomepagePage() {
  let heroSettings = await db.homepageSettings.findFirst({
    include: {
      heroImages: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!heroSettings) {
    heroSettings = {
      id: 1,
      heroTitle: "Curated Essentials",
      heroSubtitle: "Discover our handpicked collection of minimalist goods.",
      heroCtaText: "Shop Now",
      heroCtaLink: "#new-drops",
      heroImageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
      heroFontFamily: "font-inter",
      heroImages: [],
      updatedAt: new Date(),
    }
  }

  const validHeroSettings = {
    heroTitle: heroSettings.heroTitle || "",
    heroSubtitle: heroSettings.heroSubtitle || "",
    heroCtaText: heroSettings.heroCtaText || "",
    heroCtaLink: heroSettings.heroCtaLink || "",
    heroImageUrl: heroSettings.heroImageUrl || "",
    heroFontFamily: heroSettings.heroFontFamily || "font-inter",
    heroImages: heroSettings.heroImages || [],
  }

  const products = await db.product.findMany({ select: { id: true, name: true } })
  const categories = await db.category.findMany({ select: { id: true, name: true } })

  const availableItems = [
    ...products.map(p => ({ id: p.id, name: p.name, type: "PRODUCT" as const })),
    ...categories.map(c => ({ id: c.id, name: c.name, type: "CATEGORY" as const })),
  ]

  const newDropsTilesRaw = await db.homepageTile.findMany({
    where: { section: "NEW_DROPS" },
    orderBy: { order: "asc" },
  })

  const newDropsTiles = newDropsTilesRaw.map(t => {
    const isProduct = t.type === "PRODUCT"
    const name = isProduct 
      ? products.find(p => p.id === t.productId)?.name || "Unknown Product"
      : categories.find(c => c.id === t.categoryId)?.name || "Unknown Category"
    
    return {
      id: t.id,
      type: t.type as "PRODUCT" | "CATEGORY",
      itemId: (isProduct ? t.productId : t.categoryId) as string,
      name,
    }
  })

  const categoryTilesRaw = await db.homepageTile.findMany({
    where: { section: "CATEGORIES" },
    orderBy: { order: "asc" },
  })

  const categoryTiles = categoryTilesRaw.map(t => {
    const isProduct = t.type === "PRODUCT"
    const name = isProduct 
      ? products.find(p => p.id === t.productId)?.name || "Unknown Product"
      : categories.find(c => c.id === t.categoryId)?.name || "Unknown Category"
    
    return {
      id: t.id,
      type: t.type as "PRODUCT" | "CATEGORY",
      itemId: (isProduct ? t.productId : t.categoryId) as string,
      name,
    }
  })

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Homepage Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your landing page content and layout.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-6">Hero Section</h2>
          <HeroForm settings={validHeroSettings} />
        </div>
        
        <div className="space-y-8">
          <TilesManager 
            section="NEW_DROPS" 
            title="New Drops Section" 
            initialTiles={newDropsTiles} 
            availableItems={availableItems.filter(i => i.type === "PRODUCT")}
          />
          <TilesManager 
            section="CATEGORIES" 
            title="Categories Section" 
            initialTiles={categoryTiles} 
            availableItems={availableItems.filter(i => i.type === "CATEGORY")}
          />
        </div>
      </div>
    </div>
  )
}
