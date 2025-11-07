"use client"

import type { Order } from "@/lib/types"
import { Clock, MapPin, DollarSign, ChevronRight } from "lucide-react"

export default function OrderCard({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="bg-card border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Order #{order.id}</p>
          <p className="font-bold text-lg">{order.items.map((item) => item.name).join(", ")}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>${order.total.toFixed(2)}</span>
        </div>
        {order.estimatedDeliveryTime && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {new Date(order.createdAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors font-medium">
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
