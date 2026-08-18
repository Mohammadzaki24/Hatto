import Link from "next/link"
import { CategoryMenu } from "./category-menu"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"
import { db } from "@/lib/db"

export async function Navbar() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true }
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-black dark:text-white">
      <div className="w-full flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="mr-auto flex items-center">
          <span className="font-display text-2xl font-bold tracking-tight">HATTO</span>
        </Link>
        <nav className="flex items-center gap-1">
          <div className="hidden md:flex items-center">
            <CategoryMenu categories={categories} />
            <div className="ml-6 pl-6 border-l border-black/10 dark:border-white/10 flex items-center gap-3">
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
              >
                About
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <MobileMenu categories={categories} />
        </nav>
      </div>
    </header>
  )
}
