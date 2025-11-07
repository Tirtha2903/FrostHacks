"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { MapPin, CreditCard, Clock } from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const items = searchParams.get("items")
    if (items) {
      try {
        setCartItems(JSON.parse(items))
      } catch {
        // Handle parse error
      }
    }
  }, [searchParams])

  const subtotal = cartItems.reduce((sum, c) => sum + c.item.price * c.quantity, 0)
  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handleCheckout = async () => {
    setLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/orders")
  }

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
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.item.name}
                    </span>
                    <span>${(item.item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-neutral-200 rounded-lg p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-6">Order Total</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Payment"}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">Your payment information is secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
