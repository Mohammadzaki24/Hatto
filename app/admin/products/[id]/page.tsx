import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductForm } from "../product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await db.product.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!product) {
    notFound()
  }

  const categories = await db.category.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-2">Update product details.</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
