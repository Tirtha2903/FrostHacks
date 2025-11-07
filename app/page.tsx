"use client"

import { useState, useEffect } from "react"
import type { CloudKitchen } from "@/lib/types"
import { getCloudKitchens } from "@/lib/api"
import CloudKitchenCard from "@/components/cloud-kitchen-card"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import { Heart, MapPin, Clock, DollarSign } from "lucide-react"

export default function HomePage() {
  const [kitchens, setKitchens] = useState<CloudKitchen[]>([])
  const [filteredKitchens, setFilteredKitchens] = useState<CloudKitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [selectedKitchenType, setSelectedKitchenType] = useState<string>("all")

  useEffect(() => {
    const loadKitchens = async () => {
      const data = await getCloudKitchens()
      setKitchens(data)
      setFilteredKitchens(data)
      setLoading(false)
    }
    loadKitchens()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterKitchens(query, selectedCuisine, selectedKitchenType)
  }

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine)
    filterKitchens(searchQuery, cuisine, selectedKitchenType)
  }

  const handleKitchenTypeFilter = (type: string) => {
    setSelectedKitchenType(type)
    filterKitchens(searchQuery, selectedCuisine, type)
  }

  const filterKitchens = (query: string, cuisine: string, kitchenType: string) => {
    let filtered = kitchens

    if (query) {
      filtered = filtered.filter(
        (k) =>
          k.name.toLowerCase().includes(query.toLowerCase()) ||
          k.cuisineType.some((c) => c.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (cuisine !== "all") {
      filtered = filtered.filter((k) => k.cuisineType.includes(cuisine))
    }

    if (kitchenType !== "all") {
      filtered = filtered.filter((k) => k.kitchenType === kitchenType)
    }

    setFilteredKitchens(filtered)
  }

  const allCuisines = Array.from(new Set(kitchens.flatMap((k) => k.cuisineType))).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary-dark py-12 px-4 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Order from Premium Cloud Kitchens & Home Chefs
          </h1>
          <p className="text-lg text-white/90 mb-8">Professional delivery partners, flexible subscriptions, best prices</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Kitchen Type Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Kitchen Type</h3>
          <div className="flex gap-2 overflow-x-auto pb-4">
            <button
              onClick={() => handleKitchenTypeFilter("all")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedKitchenType === "all"
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-foreground hover:bg-neutral-200"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => handleKitchenTypeFilter("cloud_kitchen")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedKitchenType === "cloud_kitchen"
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-foreground hover:bg-neutral-200"
              }`}
            >
              Cloud Kitchen
            </button>
            <button
              onClick={() => handleKitchenTypeFilter("home_office")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedKitchenType === "home_office"
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-foreground hover:bg-neutral-200"
              }`}
            >
              Home Office
            </button>
            <button
              onClick={() => handleKitchenTypeFilter("both")}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedKitchenType === "both"
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-foreground hover:bg-neutral-200"
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Cuisine Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Cuisine Type</h3>
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
      </div>

      {/* Cloud Kitchens Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredKitchens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKitchens.map((kitchen) => (
              <CloudKitchenCard key={kitchen.id} kitchen={kitchen} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No cloud kitchens found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Why Choose CloudBites Section */}
      <div className="bg-secondary/10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose CloudBites?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Flexible Delivery</h3>
              <p className="text-sm text-muted-foreground">Choose from cycle, e-vehicle, motorcycle, or public transport</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Competitive Bidding</h3>
              <p className="text-sm text-muted-foreground">Delivery partners bid for your order, you choose the best option</p>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Cloud Kitchens</h3>
              <p className="text-sm text-muted-foreground">Professional food preparation with optimized delivery</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Subscriptions</h3>
              <p className="text-sm text-muted-foreground">Weekly and monthly meal plans for office and home</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
