"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, LogOut, Menu, ChefHat, Truck, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartItemCount, setIsOpen } = useCart()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'kitchen':
        return <ChefHat className="w-4 h-4" />
      case 'delivery':
        return <Truck className="w-4 h-4" />
      case 'admin':
        return <Shield className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'kitchen':
        return 'Cloud Kitchen'
      case 'delivery':
        return 'Delivery Partner'
      case 'admin':
        return 'Administrator'
      default:
        return 'Customer'
    }
  }

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'kitchen':
        return '/kitchen'
      case 'delivery':
        return '/delivery'
      case 'admin':
        return '/admin'
      default:
        return '/orders'
    }
  }

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
          {isAuthenticated && (
            <>
              <Link href={getDashboardRoute(user?.role || 'customer')} className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              {user?.role === 'customer' && (
                <>
                  <Link href="/orders" className="text-foreground hover:text-primary transition-colors">
                    My Orders
                  </Link>
                  <Link href="/favorites" className="text-foreground hover:text-primary transition-colors">
                    Favorites
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {isAuthenticated && user?.role === 'customer' && (
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-10 h-10 md:hidden hover:bg-neutral-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* User Section */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-neutral-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardRoute(user.role))}>
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === 'customer' && (
                    <>
                      <DropdownMenuItem onClick={() => router.push('/orders')}>
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/favorites')}>
                        Favorites
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-neutral-200">
              <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                Login
              </Button>
              <Button onClick={() => router.push('/auth/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden border-t border-neutral-200 bg-neutral-50">
          <nav className="flex flex-col p-4 gap-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href={getDashboardRoute(user.role)} className="text-foreground hover:text-primary transition-colors py-2">
                  Dashboard
                </Link>
                {user.role === 'customer' && (
                  <>
                    <Link href="/orders" className="text-foreground hover:text-primary transition-colors py-2">
                      My Orders
                    </Link>
                    <Link href="/favorites" className="text-foreground hover:text-primary transition-colors py-2">
                      Favorites
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-foreground hover:text-primary transition-colors py-2 text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors py-2">
                  Login
                </Link>
                <Link href="/auth/register" className="text-foreground hover:text-primary transition-colors py-2">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
