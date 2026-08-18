import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteCategory } from "@/app/actions/category"

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      parent: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage your product categories.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">Add Category</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="flex flex-col">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <div className="text-sm text-muted-foreground">/{category.slug}</div>
              {category.parent && (
                <div className="text-xs text-muted-foreground mt-1">
                  Parent: {category.parent.name}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0 mt-auto flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/admin/categories/${category.id}`}>Edit</Link>
              </Button>
              <form action={async () => {
                "use server"
                await deleteCategory(category.id)
              }}>
                <Button variant="destructive" type="submit">Delete</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground">
            No categories found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
