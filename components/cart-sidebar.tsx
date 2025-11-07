"use client"

import { useRouter } from "next/navigation"
import type { Restaurant } from "@/lib/types"
import { Trash2, ChevronRight, ShoppingBag } from "lucide-react"

interface CartItem {
  item: { id: string; name: string; price: number; image: string }
  quantity: number
  specialInstructions?: string
}

export default function CartSidebar({
  restaurantId,
  restaurant,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
}: {
  restaurantId: string
  restaurant: Restaurant
  cartItems: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
}) {
  const router = useRouter()

  const subtotal = cartItems.reduce((sum, c) => sum + c.item.price * c.quantity, 0)
  const deliveryFee = restaurant.deliveryFee
  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push(`/checkout?restaurantId=${restaurantId}&items=${encodeURIComponent(JSON.stringify(cartItems))}`)
    }
  }

  return (
    <div className="w-full md:w-80 border-l border-neutral-200 bg-card sticky top-0 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Your Cart
        </h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((cartItem) => (
              <div key={cartItem.item.id} className="border border-neutral-200 rounded-lg p-3">
                <div className="flex gap-3 mb-2">
                  <img
                    src={cartItem.item.image || "/placeholder.svg"}
                    alt={cartItem.item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{cartItem.item.name}</h4>
                    <p className="text-primary font-bold text-sm">
                      ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(cartItem.item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(cartItem.item.id, Math.max(1, cartItem.quantity - 1))}
                    className="w-6 h-6 rounded border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-medium">{cartItem.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                    className="w-6 h-6 rounded border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* Checkout Section */}
      {cartItems.length > 0 && (
        <div className="p-6 border-t border-neutral-200 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
