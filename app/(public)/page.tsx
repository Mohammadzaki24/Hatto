export const dynamic = "force-dynamic"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { HeroSlider } from "@/components/public/hero-slider"
import { ProductClickTracker } from "@/components/public/product-click-tracker"
import { ProductCarousel } from "@/components/public/product-carousel"

// Explicit types to avoid IDE type-cache issues with Prisma
interface HeroSettingsData {
  heroTitle: string
  heroSubtitle: string | null
  heroCtaText: string | null
  heroCtaLink: string | null
  heroFontFamily: string
  heroImageUrl: string | null
  heroImages: { id: string; url: string; order: number }[]
}

interface CategoryData {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

export default async function HomePage() {
  const heroSettings = await (db.homepageSettings as any).findUnique({
    where: { id: 1 },
    include: {
      heroImages: {
        orderBy: { order: 'asc' }
      }
    }
  }) as HeroSettingsData | null

  const newDropsTiles = await db.homepageTile.findMany({
    where: { section: "NEW_DROPS", type: "PRODUCT" },
    orderBy: { order: "asc" },
    include: {
      product: {
        include: { category: true, images: { orderBy: { order: "asc" } } },
      },
    },
  })
  
  const categorySplitTiles = await db.homepageTile.findMany({
    where: { section: "CATEGORIES", type: "CATEGORY" },
    orderBy: { order: "asc" },
    include: {
      category: true,
    },
  })

  // Fallbacks if DB is completely empty
  const hero: HeroSettingsData = heroSettings || {
    heroTitle: "DISCOVER THE EXCEPTIONAL",
    heroSubtitle: "Handpicked essentials for the modern lifestyle.",
    heroCtaText: "Shop New Drops",
    heroCtaLink: "#new-drops",
    heroFontFamily: "font-inter",
    heroImageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=2000",
    heroImages: [],
  }

  const products = newDropsTiles.map(t => t.product).filter(Boolean)
  const categories = categorySplitTiles.map(t => t.category).filter(Boolean) as CategoryData[]

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-12 md:pb-16">
      <section className="relative h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] w-full bg-muted">
        <HeroSlider 
          images={hero.heroImages} 
          fallbackImageUrl={hero.heroImageUrl || undefined} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className={`${hero.heroFontFamily || 'font-display'} text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight`}>
              {hero.heroTitle}
            </h1>
            {hero.heroSubtitle && (
              <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-base md:text-lg text-white/90 sm:text-xl px-4">
                {hero.heroSubtitle}
              </p>
            )}
            {hero.heroCtaText && hero.heroCtaLink && (
              <div className="mt-8 md:mt-10">
                <Button asChild size="lg" className="bg-[#FFFFFF] text-black hover:bg-[#FFFFFF]/90 dark:bg-[#FFFFFF] dark:text-black">
                  <Link href={hero.heroCtaLink}>{hero.heroCtaText}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="new-drops" className="container mx-auto px-4 md:px-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-0">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">New Drops</h2>
          <Link href="/category/all" className="text-sm font-medium hover:underline self-start sm:self-auto">
            View All →
          </Link>
        </div>
        
        {products.length === 0 ? (
          <p className="text-muted-foreground">No new drops yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductClickTracker key={product!.id} productId={product!.id}>
                <Link href={`/products/${product!.slug}`} className="group block">
                  <Card className="h-full overflow-hidden border-transparent bg-transparent shadow-none transition-all hover:bg-[var(--color-background)]">
                    <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-muted">
                      <ProductCarousel 
                        images={product!.images} 
                        variant="autoplay" 
                        altText={product!.name} 
                      />
                      {product!.badge && (
                        <div className="absolute left-3 top-3 z-10">
                          <Badge className="bg-black text-white hover:bg-black/90 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-[#FFFFFF]/90">{product!.badge}</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 px-1 text-black dark:text-white">
                      <p className="text-xs font-medium uppercase text-black/60 dark:text-white/60">
                        {product!.category.name}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold leading-tight">
                        {product!.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </ProductClickTracker>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 md:px-8">
        <h2 className="mb-6 md:mb-8 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">Shop by Category</h2>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories featured.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-500" />
                )}
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-widest">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
