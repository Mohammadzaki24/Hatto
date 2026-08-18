import Link from "next/link"
import { LogoutButton } from "@/app/admin/logout-button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-charcoal)]/10 bg-[var(--color-background)] px-4 py-6">
        <div className="mb-8">
          <Link href="/admin/dashboard" className="font-display text-2xl font-bold tracking-tight">
            HATTO ADMIN
          </Link>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin/dashboard" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Dashboard
          </Link>
          <Link href="/admin/settings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <LogoutButton />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
