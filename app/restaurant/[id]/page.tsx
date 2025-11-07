"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Restaurant, MenuItem } from "@/lib/types"
import { getRestaurantById, getMenuItems } from "@/lib/api"
import Header from "@/components/header"
import CartSidebar from "@/components/cart-sidebar"
import { Star, MapPin, Clock, ChevronLeft } from "lucide-react"

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number; specialInstructions?: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRestaurantData = async () => {
      const restaurantData = await getRestaurantById(restaurantId)
      if (restaurantData) {
        setRestaurant(restaurantData)
        const items = await getMenuItems(restaurantId)
        setMenuItems(items)

        // Set initial category
        const categories = Array.from(new Set(items.map((i) => i.category)))
        setSelectedCategory(categories[0] || "")
      }
      setLoading(false)
    }

    loadRestaurantData()
  }, [restaurantId])

  const addToCart = (item: MenuItem, quantity = 1, instructions?: string) => {
    const existingItem = cart.find((c) => c.item.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((c) =>
          c.item.id === item.id
            ? {
                ...c,
                quantity: c.quantity + quantity,
                specialInstructions: instructions || c.specialInstructions,
              }
            : c,
        ),
      )
    } else {
      setCart([...cart, { item, quantity, specialInstructions: instructions }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-96 bg-neutral-100 rounded-lg animate-pulse mb-8" />
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-lg text-muted-foreground">Restaurant not found</p>
        </div>
      </div>
    )
  }

  const categories = Array.from(new Set(menuItems.map((i) => i.category)))
  const filteredItems = menuItems.filter((i) => i.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cart.length} />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Restaurant Header */}
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-neutral-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Restaurant Info */}
          <div className="max-w-4xl mx-auto px-4 py-8 border-b border-neutral-200">
            <h1 className="text-4xl font-bold mb-3">{restaurant.name}</h1>
            <p className="text-muted-foreground mb-6">{restaurant.description}</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{restaurant.deliveryTime} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm">{restaurant.address}</span>
              </div>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="sticky top-0 bg-white border-b border-neutral-200 z-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex gap-4 overflow-x-auto py-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category ? "bg-primary text-white" : "text-foreground hover:bg-neutral-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        {item.vegetarian && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Vegetarian
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">${item.price.toFixed(2)}</p>
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar
          restaurantId={restaurantId}
          restaurant={restaurant}
          cartItems={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      </div>
    </div>
  )
}
