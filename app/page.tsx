"use client"

import { useState, useEffect } from "react"
import type { Restaurant } from "@/lib/types"
import { getRestaurants } from "@/lib/api"
import RestaurantCard from "@/components/restaurant-card"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import { Heart, MapPin, Clock, DollarSign } from "lucide-react"

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")

  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await getRestaurants()
      setRestaurants(data)
      setFilteredRestaurants(data)
      setLoading(false)
    }
    loadRestaurants()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterRestaurants(query, selectedCuisine)
  }

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine)
    filterRestaurants(searchQuery, cuisine)
  }

  const filterRestaurants = (query: string, cuisine: string) => {
    let filtered = restaurants

    if (query) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisineType.some((c) => c.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (cuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisineType.includes(cuisine))
    }

    setFilteredRestaurants(filtered)
  }

  const allCuisines = Array.from(new Set(restaurants.flatMap((r) => r.cuisineType))).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary-dark py-12 px-4 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Order from Your Favorite Restaurants
          </h1>
          <p className="text-lg text-white/90 mb-8">Fast delivery, wide selection, best prices</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          <button
            onClick={() => handleCuisineFilter("all")}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCuisine === "all"
                ? "bg-primary text-white"
                : "bg-neutral-100 text-foreground hover:bg-neutral-200"
            }`}
          >
            All
          </button>
          {allCuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => handleCuisineFilter(cuisine)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCuisine === cuisine
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-foreground hover:bg-neutral-200"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No restaurants found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Why TasteByte Section */}
      <div className="bg-secondary/10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose TasteByte?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Average 25-35 minutes delivery time</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Best Prices</h3>
              <p className="text-sm text-muted-foreground">Competitive pricing and exclusive deals</p>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Wide Coverage</h3>
              <p className="text-sm text-muted-foreground">Delivery across the entire city</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Your Favorites</h3>
              <p className="text-sm text-muted-foreground">Save and order your favorite meals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
