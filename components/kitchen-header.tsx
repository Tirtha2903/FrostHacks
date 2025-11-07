"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function KitchenHeader() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/kitchen" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🍳</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">TasteByte Kitchen</h1>
            <p className="text-xs text-muted-foreground">La Bella Italia</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 bg-white border border-neutral-200 rounded-lg shadow-lg min-w-xs z-50">
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-neutral-200">
                    <p className="font-bold mb-2">New Order!</p>
                    <p className="text-sm text-muted-foreground">Order #order_3 placed - 2 Cheeseburgers</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-neutral-200">
            <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Chef Maria</p>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
          </div>

          {/* Actions */}
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
