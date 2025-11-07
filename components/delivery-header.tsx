"use client"

import Link from "next/link"
import { Bell, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function DeliveryHeader() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/delivery" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🚴</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">TasteByte Delivery</h1>
            <p className="text-xs text-muted-foreground">Partner Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Online Status Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isOnline
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-neutral-200 text-foreground hover:bg-neutral-300"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </button>

          {/* Notifications */}
          <button className="relative flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-neutral-200">
            <div className="flex items-center justify-center w-9 h-9 bg-secondary rounded-lg">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Alex Delivery</p>
              <p className="text-xs text-muted-foreground">4.9 Rating</p>
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
