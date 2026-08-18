import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CategoryForm } from "../category-form"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const category = await db.category.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  const categories = await db.category.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground mt-2">Update category details.</p>
      </div>
      <CategoryForm category={category} categories={categories} />
    </div>
  )
}
