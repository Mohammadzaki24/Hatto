import { db } from "@/lib/db"
import { CategoryForm } from "../category-form"

export default async function NewCategoryPage() {
  const categories = await db.category.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Add Category</h1>
        <p className="text-muted-foreground mt-2">Create a new category.</p>
      </div>
      <CategoryForm categories={categories} />
    </div>
  )
}
