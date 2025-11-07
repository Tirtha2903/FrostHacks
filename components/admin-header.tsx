"use client"

import Link from "next/link"
import { Settings, LogOut, BarChart3 } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl">TasteByte Admin</h1>
            <p className="text-xs text-muted-foreground">Management Dashboard</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Admin Stats */}
          <div className="hidden lg:flex items-center gap-8 pr-6 border-r border-neutral-200">
            <div className="text-sm">
              <p className="text-muted-foreground">Platform Status</p>
              <p className="font-bold text-green-600">All Systems Online</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-secondary rounded-lg">
              <span className="text-white font-bold text-sm">AU</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">System</p>
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
