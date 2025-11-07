"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"
import { dummyOrders } from "@/lib/dummy-data"
import KitchenHeader from "@/components/kitchen-header"
import OrderBoardColumn from "@/components/order-board-column"
import KitchenStats from "@/components/kitchen-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [view, setView] = useState<"board" | "list">("board")

  useEffect(() => {
    // Simulate kitchen getting orders for their restaurant (rest_1)
    const kitchenOrders = dummyOrders
    setOrders(kitchenOrders)
  }, [])

  const groupedOrders = {
    pending: orders.filter((o) => o.status === "pending"),
    confirmed: orders.filter((o) => o.status === "confirmed"),
    preparing: orders.filter((o) => o.status === "preparing"),
    ready: orders.filter((o) => o.status === "ready"),
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
  }

  return (
    <div className="min-h-screen bg-background">
      <KitchenHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <KitchenStats orders={orders} />

        {/* Tabs */}
        <Tabs defaultValue="board" className="w-full mt-8">
          <TabsList className="grid w-full max-w-xs">
            <TabsTrigger value="board">Order Board</TabsTrigger>
            <TabsTrigger value="list">Order List</TabsTrigger>
          </TabsList>

          {/* Kanban Board View */}
          <TabsContent value="board" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <OrderBoardColumn
                title="New Orders"
                orders={groupedOrders.pending}
                status="pending"
                onStatusChange={updateOrderStatus}
                nextStatus="confirmed"
              />
              <OrderBoardColumn
                title="Confirmed"
                orders={groupedOrders.confirmed}
                status="confirmed"
                onStatusChange={updateOrderStatus}
                nextStatus="preparing"
              />
              <OrderBoardColumn
                title="Preparing"
                orders={groupedOrders.preparing}
                status="preparing"
                onStatusChange={updateOrderStatus}
                nextStatus="ready"
              />
              <OrderBoardColumn
                title="Ready"
                orders={groupedOrders.ready}
                status="ready"
                onStatusChange={updateOrderStatus}
                nextStatus="assigned"
              />
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="mt-6">
            <div className="bg-card border border-neutral-200 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/5 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left font-bold">Items</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Time</th>
                    <th className="px-6 py-4 text-left font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-200 hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">#{order.id.split("_")[1]}</td>
                        <td className="px-6 py-4">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {Math.round((Date.now() - order.createdAt.getTime()) / 60000)} min
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800"
    case "confirmed":
      return "bg-purple-100 text-purple-800"
    case "preparing":
      return "bg-yellow-100 text-yellow-800"
    case "ready":
      return "bg-green-100 text-green-800"
    case "assigned":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-neutral-100 text-neutral-800"
  }
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
