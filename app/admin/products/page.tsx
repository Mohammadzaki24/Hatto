import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteProduct } from "@/app/actions/product"
import Image from "next/image"

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-square bg-muted">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{product.category?.name}</div>
            </CardHeader>
            <CardContent className="p-4 pt-0 mt-auto flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/admin/products/${product.id}`}>Edit</Link>
              </Button>
              <form action={async () => {
                "use server"
                await deleteProduct(product.id)
              }}>
                <Button variant="destructive" type="submit">Delete</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground">
            No products found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
