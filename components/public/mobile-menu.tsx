"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

interface Category {
  id: string
  name: string
  slug: string
}

interface MobileMenuProps {
  categories: Category[]
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </Button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 shadow-lg sm:max-w-sm transition-all duration-300 ease-in-out flex flex-col text-black dark:text-white">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-2xl font-bold tracking-tight">Menu</span>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>

            <nav className="flex flex-col gap-6 overflow-y-auto pb-8">
              <div className="space-y-4">
                <h4 className="font-medium text-black/50 dark:text-white/50 uppercase tracking-wider text-xs">Categories</h4>
                <div className="flex flex-col gap-3 pl-2">
                  <Link href="/category/all" onClick={closeMenu} className="font-medium hover:text-[var(--color-accent)]">
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={closeMenu}
                      className="text-black/80 dark:text-white/80 hover:text-[var(--color-accent)] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
                <h4 className="font-medium text-black/50 dark:text-white/50 uppercase tracking-wider text-xs">Pages</h4>
                <div className="flex flex-col gap-3 pl-2">
                  <Link href="/about" onClick={closeMenu} className="font-medium hover:text-[var(--color-accent)]">
                    About
                  </Link>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10 mt-auto">
                <h4 className="font-medium text-black/50 dark:text-white/50 uppercase tracking-wider text-xs">Appearance</h4>
                <div className="flex items-center gap-3 pl-2">
                  <ThemeToggle />
                  <span className="text-sm font-medium">Toggle Theme</span>
                </div>
              </div>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
