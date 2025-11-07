"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"
import { getOrders } from "@/lib/api"
import Header from "@/components/header"
import OrderCard from "@/components/order-card"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      // Mock loading orders for user_1
      const data = await getOrders("user_1")
      setOrders(data)
      setLoading(false)
    }
    loadOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") {
      return !["delivered", "cancelled"].includes(order.status)
    }
    if (filter === "completed") {
      return order.status === "delivered"
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-200">
          {(["all", "active", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`pb-4 font-medium capitalize transition-colors ${
                filter === status
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {filter === "active"
                ? "No active orders"
                : filter === "completed"
                  ? "No completed orders"
                  : "No orders yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
