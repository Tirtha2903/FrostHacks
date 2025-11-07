"use client"

import type { Order } from "@/lib/types"
import { ChevronRight, Clock } from "lucide-react"

interface OrderBoardColumnProps {
  title: string
  orders: Order[]
  status: Order["status"]
  onStatusChange: (orderId: string, newStatus: Order["status"]) => void
  nextStatus: Order["status"]
}

export default function OrderBoardColumn({ title, orders, onStatusChange, nextStatus }: OrderBoardColumnProps) {
  return (
    <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 min-h-screen md:min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {title}
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">{orders.length}</span>
        </h3>
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-primary/30 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">#{order.id.split("_")[1]}</p>
                  <h4 className="font-bold line-clamp-2">{order.items.map((item) => item.name).join(", ")}</h4>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <Clock className="w-3 h-3" />
                <span>{Math.round((Date.now() - order.createdAt.getTime()) / 60000)} min ago</span>
              </div>

              <div className="space-y-1 mb-4 text-sm">
                {order.items.map((item) => (
                  <p key={item.menuItemId} className="text-muted-foreground">
                    {item.quantity}x {item.name}
                    {item.specialInstructions && (
                      <span className="block text-xs italic text-primary">Note: {item.specialInstructions}</span>
                    )}
                  </p>
                ))}
              </div>

              <button
                onClick={() => onStatusChange(order.id, nextStatus)}
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1).replace("_", " ")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders in this stage</p>
          </div>
        )}
      </div>
    </div>
  )
}
