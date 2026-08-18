import { db } from "@/lib/db"
import { ProductForm } from "../product-form"

export default async function NewProductPage() {
  const categories = await db.category.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground mt-2">Create a new product for your catalog.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
