import { db } from "@/lib/db"
import Link from "next/link"
import { Package, FolderOpen, LayoutDashboard, Eye, MousePointer, TrendingUp } from "lucide-react"

function getDateRange(days: number) {
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split("T")[0])
  }
  return dates
}

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0]
  const last7Days = getDateRange(7)

  // Today's stats
  const todayViews = await db.pageView.aggregate({
    where: { date: today },
    _sum: { count: true },
  })

  const todayClicks = await db.productClick.aggregate({
    where: { date: today },
    _sum: { count: true },
  })

  // Last 7 days page views for chart
  const weekViews = await db.pageView.groupBy({
    by: ["date"],
    where: { date: { in: last7Days } },
    _sum: { count: true },
    orderBy: { date: "asc" },
  })

  // Map to array with all 7 days (fill in zeros)
  const weekData = last7Days.map(date => {
    const found = weekViews.find(v => v.date === date)
    return {
      date,
      label: new Date(date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short" }),
      count: found?._sum?.count || 0,
    }
  })
  const maxViews = Math.max(...weekData.map(d => d.count), 1)

  // Top clicked products
  const topClicks = await db.productClick.groupBy({
    by: ["productId"],
    _sum: { count: true },
    orderBy: { _sum: { count: "desc" } },
    take: 5,
  })

  const topProductIds = topClicks.map(c => c.productId)
  const topProducts = topProductIds.length > 0 
    ? await db.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true },
      })
    : []

  const topProductsWithClicks = topClicks.map(click => {
    const product = topProducts.find(p => p.id === click.productId)
    return {
      name: product?.name || "Unknown",
      clicks: click._sum?.count || 0,
    }
  })

  // Counts for quick stats
  const totalProducts = await db.product.count()
  const totalCategories = await db.category.count()

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Selamat datang di panel admin HATTO.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kunjungan Hari Ini</p>
              <p className="text-3xl font-bold">{todayViews._sum?.count || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2.5">
              <MousePointer className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Klik Produk Hari Ini</p>
              <p className="text-3xl font-bold">{todayClicks._sum?.count || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produk Terpopuler</p>
              <p className="text-lg font-bold truncate">
                {topProductsWithClicks[0]?.name || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart - Last 7 Days */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Kunjungan 7 Hari Terakhir</h3>
          <div className="flex items-end gap-2 h-40">
            {weekData.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{day.count}</span>
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all"
                  style={{ height: `${Math.max((day.count / maxViews) * 100, 4)}%` }}
                />
                <span className="text-xs text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Produk Paling Banyak Diklik</h3>
          {topProductsWithClicks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data klik.</p>
          ) : (
            <div className="space-y-3">
              {topProductsWithClicks.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium truncate max-w-[200px]">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">{product.clicks} klik</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Management Section */}
      <div>
        <h2 className="mb-6 font-display text-xl font-bold tracking-tight border-t pt-8">Kelola Konten</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/products"
            className="group flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-black/20"
          >
            <div className="rounded-lg bg-orange-50 p-3 group-hover:bg-orange-100 transition-colors">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold">Products</h3>
              <p className="text-sm text-muted-foreground">{totalProducts} produk</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-black/20"
          >
            <div className="rounded-lg bg-teal-50 p-3 group-hover:bg-teal-100 transition-colors">
              <FolderOpen className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold">Categories</h3>
              <p className="text-sm text-muted-foreground">{totalCategories} kategori</p>
            </div>
          </Link>

          <Link
            href="/admin/homepage"
            className="group flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-black/20"
          >
            <div className="rounded-lg bg-indigo-50 p-3 group-hover:bg-indigo-100 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold">Homepage Layout</h3>
              <p className="text-sm text-muted-foreground">Hero, tiles & sections</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
