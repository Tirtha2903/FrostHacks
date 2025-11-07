"use client"

import { useRouter } from "next/navigation"
import type { CloudKitchen, MenuItem } from "@/lib/types"
import { Trash2, X, ChevronRight, ShoppingBag } from "lucide-react"
import { useState } from "react"

interface CartItem {
  item: MenuItem
  quantity: number
  specialInstructions?: string
}

export default function CloudCartSidebar({
  cart,
  kitchen,
  onRemove,
  onUpdateQuantity,
  onClose,
  isOpen,
}: {
  cart: CartItem[]
  kitchen: CloudKitchen
  onRemove: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onClose: () => void
  isOpen: boolean
}) {
  const router = useRouter()
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false)

  const subtotal = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0)
  const deliveryFee = kitchen.deliveryFee
  const platformFee = 2.50
  const total = subtotal + deliveryFee + platformFee

  const handleCheckout = () => {
    if (cart.length > 0) {
      const orderData = {
        kitchenId: kitchen.id,
        items: cart.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          specialInstructions: c.specialInstructions
        })),
        subtotal,
        deliveryFee,
        platformFee,
        total
      }

      // Store order data in sessionStorage for checkout page
      sessionStorage.setItem('orderData', JSON.stringify(orderData))
      router.push('/checkout')
    }
  }

  const handleSubscription = () => {
    if (cart.length > 0) {
      const orderData = {
        kitchenId: kitchen.id,
        items: cart.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          specialInstructions: c.specialInstructions
        })),
        subtotal,
        deliveryFee,
        platformFee,
        total
      }

      // Store order data in sessionStorage for subscription page
      sessionStorage.setItem('orderData', JSON.stringify(orderData))
      router.push('/checkout?mode=subscription')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kitchen Info */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-semibold">{kitchen.name}</h3>
          <p className="text-sm text-muted-foreground">{kitchen.cuisineType.join(", ")}</p>
          <p className="text-sm text-muted-foreground">Min. Order: ₹{kitchen.minOrderAmount}</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="border border-neutral-200 rounded-lg p-3">
                  <div className="flex gap-3 mb-2">
                    <img
                      src={cartItem.item.image || "https://picsum.photos/seed/food-item/64/64.jpg"}
                      alt={cartItem.item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://picsum.photos/seed/food-placeholder/64/64.jpg"
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{cartItem.item.name}</h4>
                      <p className="text-primary font-bold text-sm">
                        ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">₹{cartItem.item.price} each</p>
                    </div>
                    <button
                      onClick={() => onRemove(cartItem.item.id)}
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

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-200 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Subscription Option */}
            {kitchen.subscriptionAvailable && (
              <button
                onClick={handleSubscription}
                className="w-full px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                Setup Subscription
              </button>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={subtotal < kitchen.minOrderAmount}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {subtotal < kitchen.minOrderAmount
                ? `Add ₹${(kitchen.minOrderAmount - subtotal).toFixed(2)} more to checkout`
                : `Checkout • ₹${total.toFixed(2)}`
              }
            </button>

            <div className="text-xs text-muted-foreground text-center">
              Estimated delivery: {kitchen.deliveryTime} minutes
            </div>
          </div>
        )}
      </div>
    </>
  )
}