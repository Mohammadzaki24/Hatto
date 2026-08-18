"use client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
    >
      Logout
    </button>
  )
}
