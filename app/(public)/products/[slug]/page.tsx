import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { ProductCarousel } from "@/components/public/product-carousel"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-card)] bg-muted">
          <ProductCarousel 
            images={product.images} 
            variant="manual" 
            altText={product.name} 
          />
        </div>

        {/* Right: Sticky Info Block */}
        <div className="relative">
          <div className="sticky top-24 flex flex-col items-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium uppercase text-black/60 dark:text-white/60">
                {product.category.name}
              </span>
              {product.badge && (
                <Badge variant="secondary" className="dark:bg-[#FFFFFF] dark:text-black">{product.badge}</Badge>
              )}
            </div>
            
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <div 
              className="prose max-w-none text-base text-black/80 dark:text-white/80"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="mt-10 w-full">
              <Button asChild variant="pill" size="lg" className="w-full text-base sm:w-auto sm:px-12">
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  Check current price on Amazon
                </a>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground text-center sm:text-left">
                As an Amazon Associate, we earn from qualifying purchases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Videos Section */}
      {(product.videoUrl || product.videoUrl2 || product.videoUrl3) && (
        <div className="mt-20 border-t border-border pt-16">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-10 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Need Review?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-start">
              {[product.videoUrl, product.videoUrl2, product.videoUrl3].map((url, idx) => {
                if (!url) return null;
                
                // YouTube regex (supports youtu.be, youtube.com/watch, embed, and shorts)
                const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
                if (ytMatch && ytMatch[1]) {
                  const videoId = ytMatch[1];
                  return (
                    <div key={idx} className="w-full max-w-[500px] overflow-hidden rounded-xl shadow-lg border border-border bg-muted/30">
                      <div className="relative w-full aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        ></iframe>
                      </div>
                    </div>
                  );
                }

                // TikTok regex
                const tiktokMatch = url.match(/tiktok\.com\/.*(?:video|v)\/(\d+)/i);
                if (tiktokMatch && tiktokMatch[1]) {
                  const videoId = tiktokMatch[1];
                  return (
                    <div key={idx} className="w-full max-w-[325px] overflow-hidden rounded-xl shadow-lg border border-border bg-muted/30">
                      <div className="relative w-full aspect-[9/16]">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.tiktok.com/embed/v2/${videoId}`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allowFullScreen
                          allow="encrypted-media;"
                        ></iframe>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
