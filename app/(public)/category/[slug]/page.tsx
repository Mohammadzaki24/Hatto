import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { ProductCarousel } from "@/components/public/product-carousel"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  let products = []
  let categoryName = ""

  if (slug === "all") {
    products = await db.product.findMany({
      include: { category: true, images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" }
    })
    categoryName = "All Products"
  } else {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: { category: true, images: { orderBy: { order: "asc" } } },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!category) {
      notFound()
    }

    products = category.products
    categoryName = category.name
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="mb-12 border-b border-[var(--color-charcoal)]/10 pb-8">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          {categoryName}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Curated picks for {categoryName.toLowerCase()}.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <Card className="h-full overflow-hidden border-transparent bg-transparent shadow-none transition-all hover:bg-[var(--color-background)]">
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-muted">
                  <ProductCarousel 
                    images={product.images} 
                    variant="autoplay" 
                    altText={product.name} 
                  />
                  {product.badge && (
                    <div className="absolute left-3 top-3 z-10">
                      <Badge className="bg-black text-white hover:bg-black/90 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-[#FFFFFF]/90">{product.badge}</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 px-1 text-black dark:text-white">
                  <p className="text-xs font-medium uppercase text-black/60 dark:text-white/60">
                    {product.category.name}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-tight">
                    {product.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
