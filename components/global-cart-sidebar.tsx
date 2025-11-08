"use client"

import { useRouter } from "next/navigation"
import { Trash2, X, ChevronRight, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import CloudCartSidebar from "@/components/cloud-cart-sidebar"
import type { CloudKitchen } from "@/lib/types"

export default function GlobalCartSidebar() {
  const router = useRouter()
  const {
    cart,
    kitchen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getTotalItems,
    cartSubtotal,
    deliveryFee,
    platformFee,
    cartTotal,
    isOpen,
    setIsOpen
  } = useCart()

  const handleCheckout = () => {
    if (cart.length > 0 && kitchen) {
      const orderData = {
        kitchenId: kitchen.id,
        items: cart.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          specialInstructions: c.specialInstructions
        })),
        subtotal: cartSubtotal,
        deliveryFee,
        platformFee,
        total: cartTotal
      }

      // Store order data in sessionStorage for checkout page
      sessionStorage.setItem('orderData', JSON.stringify(orderData))
      setIsOpen(false)
      router.push('/checkout')
    }
  }

  const handleSubscription = () => {
    if (cart.length > 0 && kitchen) {
      const orderData = {
        kitchenId: kitchen.id,
        items: cart.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          specialInstructions: c.specialInstructions
        })),
        subtotal: cartSubtotal,
        deliveryFee,
        platformFee,
        total: cartTotal
      }

      // Store order data in sessionStorage for subscription page
      sessionStorage.setItem('orderData', JSON.stringify(orderData))
      setIsOpen(false)
      router.push('/checkout?mode=subscription')
    }
  }

  if (!isOpen || !kitchen) return null

  return (
    <CloudCartSidebar
      cart={cart}
      kitchen={kitchen}
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
    />
  )
}