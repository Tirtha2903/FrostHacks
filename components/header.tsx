"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, LogOut, Menu } from "lucide-react"
import { useState } from "react"

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TB</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">TasteByte</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/orders" className="text-foreground hover:text-primary transition-colors">
            My Orders
          </Link>
          <Link href="/favorites" className="text-foreground hover:text-primary transition-colors">
            Favorites
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-10 h-10 md:hidden hover:bg-neutral-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-neutral-200">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium">John</p>
              <p className="text-xs text-muted-foreground">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden border-t border-neutral-200 bg-neutral-50">
          <nav className="flex flex-col p-4 gap-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>
            <Link href="/orders" className="text-foreground hover:text-primary transition-colors py-2">
              My Orders
            </Link>
            <Link href="/favorites" className="text-foreground hover:text-primary transition-colors py-2">
              Favorites
            </Link>
            <button className="text-foreground hover:text-primary transition-colors py-2 text-left flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
