"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("hatto-theme")
    if (stored === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("hatto-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("hatto-theme", "light")
    }
  }

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}
