"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

export function CategoryMenu({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex items-center h-full">
      <div 
        className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-w-[500px] opacity-100 pr-6 mr-4 border-r border-[var(--color-charcoal)]/20' : 'max-w-0 opacity-0 pr-0 mr-0 border-r-0'}`}
      >
        <div className="flex space-x-6 whitespace-nowrap px-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
              onClick={() => setIsOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          {categories.length === 0 && (
            <span className="text-sm text-muted-foreground">No categories</span>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[var(--color-accent)] focus:outline-none"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span>Categories</span>
      </button>
    </div>
  )
}
