"use client"

import Link from "next/link"
import type { CloudKitchen } from "@/lib/types"
import { Star, Clock, MapPin, Calendar, CheckCircle } from "lucide-react"

export default function CloudKitchenCard({
  kitchen,
}: {
  kitchen: CloudKitchen
}) {
  const getKitchenTypeLabel = (type: string) => {
    switch (type) {
      case "cloud_kitchen":
        return "Cloud Kitchen"
      case "home_office":
        return "Home Office"
      case "both":
        return "Hybrid"
      default:
        return type
    }
  }

  const getKitchenTypeColor = (type: string) => {
    switch (type) {
      case "cloud_kitchen":
        return "bg-blue-100 text-blue-800"
      case "home_office":
        return "bg-green-100 text-green-800"
      case "both":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Link href={`/kitchen/${kitchen.id}`}>
      <div className="bg-card border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={kitchen.image || "https://picsum.photos/seed/kitchen-placeholder/400/300.jpg"}
            alt={kitchen.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/seed/food-fallback/400/300.jpg"
            }}
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-bold text-sm">{kitchen.rating}</span>
          </div>
          <div className="absolute top-3 left-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getKitchenTypeColor(kitchen.kitchenType)}`}>
              {getKitchenTypeLabel(kitchen.kitchenType)}
            </span>
          </div>
          {kitchen.subscriptionAvailable && (
            <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Subscription</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{kitchen.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{kitchen.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {kitchen.cuisineType.slice(0, 2).map((cuisine) => (
              <span key={cuisine} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                {cuisine}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm mb-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{kitchen.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>₹{kitchen.deliveryFee}</span>
              <span>delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{kitchen.address}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div className="text-xs text-muted-foreground">
              Min. Order: ₹{kitchen.minOrderAmount}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>FSSAI Licensed</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}