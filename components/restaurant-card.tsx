"use client"

import Link from "next/link"
import type { Restaurant } from "@/lib/types"
import { Star, Clock } from "lucide-react"

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant
}) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-card border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-bold text-sm">{restaurant.rating}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{restaurant.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{restaurant.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisineType.slice(0, 2).map((cuisine) => (
              <span key={cuisine} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                {cuisine}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>${restaurant.deliveryFee}</span>
              <span>delivery</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
