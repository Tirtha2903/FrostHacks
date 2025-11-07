"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { MapPin, CreditCard, Clock, Users } from "lucide-react"
import { getCloudKitchenById } from "@/lib/api"
import type { CloudKitchen } from "@/lib/types"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [kitchen, setKitchen] = useState<CloudKitchen | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSubscription, setIsSubscription] = useState(false)

  useEffect(() => {
    // Check if this is subscription mode
    setIsSubscription(searchParams.get("mode") === "subscription")

    // Get order data from sessionStorage
    const storedOrderData = sessionStorage.getItem('orderData')
    if (storedOrderData) {
      try {
        const data = JSON.parse(storedOrderData)
        setOrderData(data)

        // Load kitchen details
        loadKitchen(data.kitchenId)
      } catch (error) {
        console.error('Error parsing order data:', error)
        router.push('/')
      }
    } else {
      // Fallback to search params for backward compatibility
      const items = searchParams.get("items")
      if (items) {
        try {
          const cartItems = JSON.parse(items)
          setOrderData({
            items: cartItems,
            subtotal: cartItems.reduce((sum: number, c: any) => sum + c.item.price * c.quantity, 0),
            deliveryFee: 2.99,
            platformFee: 2.50,
            total: 0
          })
        } catch (error) {
          console.error('Error parsing items:', error)
        }
      }
    }
  }, [searchParams, router])

  const loadKitchen = async (kitchenId: string) => {
    const kitchenData = await getCloudKitchenById(kitchenId)
    setKitchen(kitchenData)
  }

  const handleCheckout = async () => {
    if (!orderData || !kitchen) return

    setLoading(true)

    // Simulate order processing
    setTimeout(() => {
      setLoading(false)

      // Clear sessionStorage
      sessionStorage.removeItem('orderData')

      if (isSubscription) {
        router.push('/orders?success=subscription')
      } else {
        router.push('/orders?success=order')
      }
    }, 2000)
  }

  if (!orderData || !kitchen) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const { subtotal, deliveryFee, platformFee, total } = orderData
  const tax = subtotal * 0.08
  const finalTotal = total + tax

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-card border border-neutral-200 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">123 Customer Street</p>
                  <p className="text-sm text-muted-foreground">Apt 4B, New York, NY 10001</p>
                </div>
                <button className="text-primary font-medium hover:underline">Change</button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-neutral-200 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="flex items-center gap-4">
                <input type="radio" id="card" name="payment" defaultChecked className="w-4 h-4" />
                <label htmlFor="card" className="cursor-pointer flex-1">
                  <p className="font-medium">Credit Card</p>
                  <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                </label>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-card border border-neutral-200 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Delivery Time
              </h2>
              <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>30-35 minutes</option>
                <option>35-40 minutes</option>
                <option>40-45 minutes</option>
              </select>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-neutral-200 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                {isSubscription && <Users className="w-5 h-5" />}
                {isSubscription ? "Subscription Summary" : "Order Summary"}
              </h2>
              <div className="space-y-3">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {isSubscription && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    🎉 Subscription mode activated! You'll save 15% on recurring orders.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-neutral-200 rounded-lg p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-6">Order Total</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
                {isSubscription && (
                  <div className="text-xs text-green-600 text-center">
                    💰 Save 15% with subscription!
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isSubscription
                    ? `Start Subscription • ₹${finalTotal.toFixed(2)}`
                    : `Complete Payment • ₹${finalTotal.toFixed(2)}`
                }
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">Your payment information is secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
