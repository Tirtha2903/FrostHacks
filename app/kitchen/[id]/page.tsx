"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { CloudKitchen, MenuItem } from "@/lib/types"
import { getCloudKitchenById, getMenuItems } from "@/lib/api"
import Header from "@/components/header"
import { useCart } from "@/lib/cart-context"
import { Star, MapPin, Clock, ChevronLeft, Users, CheckCircle } from "lucide-react"

export default function KitchenPage() {
  const params = useParams()
  const router = useRouter()
  const kitchenId = params.id as string

  const [kitchen, setKitchen] = useState<CloudKitchen | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const {
    cart,
    addToCart: addToCartGlobal,
    removeFromCart,
    updateQuantity,
    getCartItemCount,
    kitchen: cartKitchen,
    isOpen,
    setIsOpen
  } = useCart()

  useEffect(() => {
    const loadKitchenData = async () => {
      const kitchenData = await getCloudKitchenById(kitchenId)
      if (kitchenData) {
        setKitchen(kitchenData)
        const items = await getMenuItems(kitchenId)
        setMenuItems(items)

        // Set initial category
        const categories = Array.from(new Set(items.map((i) => i.category)))
        setSelectedCategory(categories[0] || "")
      }
      setLoading(false)
    }

    loadKitchenData()
  }, [kitchenId])

  const addToCart = (item: MenuItem, quantity = 1, instructions?: string) => {
    addToCartGlobal(item, quantity, instructions, kitchen || undefined)
  }

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory)
  const categories = Array.from(new Set(menuItems.map((i) => i.category)))

  const getKitchenTypeLabel = (type: string) => {
    switch (type) {
      case "cloud_kitchen":
        return "Cloud Kitchen"
      case "home_office":
        return "Home Office"
      case "both":
        return "Hybrid Kitchen"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Kitchen Not Found</h1>
          <p className="text-muted-foreground mb-8">The kitchen you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Kitchen Header */}
      <div className="relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-neutral-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <img
          src={kitchen.image || "https://picsum.photos/seed/kitchen-header/800/400.jpg"}
          alt={kitchen.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/seed/kitchen-fallback/800/400.jpg"
          }}
        />
      </div>

      {/* Kitchen Info */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{kitchen.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                kitchen.kitchenType === "cloud_kitchen" ? "bg-blue-100 text-blue-800" :
                kitchen.kitchenType === "home_office" ? "bg-green-100 text-green-800" :
                "bg-purple-100 text-purple-800"
              }`}>
                {getKitchenTypeLabel(kitchen.kitchenType)}
              </span>
            </div>

            <p className="text-muted-foreground mb-6 max-w-2xl">{kitchen.description}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{kitchen.rating}</span>
                <span className="text-muted-foreground">(200+ ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>{kitchen.deliveryTime} min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{kitchen.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Min. Order:</span>
                <span>₹{kitchen.minOrderAmount}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>FSSAI Licensed</span>
              </div>
              {kitchen.subscriptionAvailable && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Subscription Available</span>
                </div>
              )}
            </div>

            {/* Operating Hours */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium mb-2">Operating Hours</h3>
              <p className="text-sm text-muted-foreground">
                {kitchen.operatingHours.days.join(", ")} • {kitchen.operatingHours.open} - {kitchen.operatingHours.close}
              </p>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="ml-4 relative bg-primary text-white p-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{getCartItemCount()}</div>
              <div className="text-xs">Cart</div>
            </div>
            {getCartItemCount() > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {getCartItemCount()}
              </div>
            )}
          </button>
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
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-foreground hover:bg-neutral-200"
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
        <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items available in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image || "https://picsum.photos/seed/food-item/100/100.jpg"}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/seed/food-placeholder/100/100.jpg"
                  }}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                      {item.vegetarian && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
                          Vegetarian
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">₹{item.price}</div>
                      {item.available ? (
                        <span className="text-sm text-green-600">Available</span>
                      ) : (
                        <span className="text-sm text-red-600">Unavailable</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      {item.category}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}