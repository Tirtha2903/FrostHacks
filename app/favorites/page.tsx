"use client"

import Header from "@/components/header"
import RestaurantCard from "@/components/restaurant-card"
import { dummyRestaurants } from "@/lib/dummy-data"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Heart className="w-8 h-8 text-destructive fill-destructive" />
          Your Favorites
        </h1>
        <p className="text-muted-foreground mb-8">Your saved restaurants and quick reorder options</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  )
}
