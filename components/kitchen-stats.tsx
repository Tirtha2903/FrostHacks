"use client"

import type { Order } from "@/lib/types"
import { TrendingUp, Zap, Clock, DollarSign } from "lucide-react"

export default function KitchenStats({ orders }: { orders: Order[] }) {
  const completedOrders = orders.filter((o) => o.status === "ready").length
  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing",
  ).length

  const totalRevenue = orders
    .filter((o) => o.status === "ready" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0)

  const avgPrepTime =
    orders.length > 0
      ? Math.round(
          orders.reduce((sum, o) => {
            return sum + (o.updatedAt.getTime() - o.createdAt.getTime()) / 60000
          }, 0) / orders.length,
        )
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card border border-neutral-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active Orders</p>
            <p className="text-3xl font-bold">{activeOrders}</p>
          </div>
          <Zap className="w-12 h-12 text-primary opacity-20" />
        </div>
      </div>

      <div className="bg-card border border-neutral-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ready to Deliver</p>
            <p className="text-3xl font-bold">{completedOrders}</p>
          </div>
          <TrendingUp className="w-12 h-12 text-secondary opacity-20" />
        </div>
      </div>

      <div className="bg-card border border-neutral-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Prep Time</p>
            <p className="text-3xl font-bold">{avgPrepTime} min</p>
          </div>
          <Clock className="w-12 h-12 text-accent opacity-20" />
        </div>
      </div>

      <div className="bg-card border border-neutral-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Today's Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
          </div>
          <DollarSign className="w-12 h-12 text-primary opacity-20" />
        </div>
      </div>
    </div>
  )
}
