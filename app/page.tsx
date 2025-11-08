"use client"

import { useState, useEffect } from "react"
import type { CloudKitchen } from "@/lib/types"
import { getCloudKitchens } from "@/lib/api"
import CloudKitchenCard from "@/components/cloud-kitchen-card"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import {
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  ChefHat,
  Truck,
  Shield,
  Sparkles,
  ArrowRight,
  Utensils,
  Pizza,
  Coffee,
  IceCream2 as IceCream
} from "lucide-react"

export default function HomePage() {
  const [kitchens, setKitchens] = useState<CloudKitchen[]>([])
  const [filteredKitchens, setFilteredKitchens] = useState<CloudKitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [selectedKitchenType, setSelectedKitchenType] = useState<string>("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadKitchens = async () => {
      const data = await getCloudKitchens()
      setKitchens(data)
      setFilteredKitchens(data)
      setLoading(false)
      // Trigger animations after load
      setTimeout(() => setIsVisible(true), 100)
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <Header />

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
          </div>
        </div>

        <div className="relative z-10 py-16 px-4 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                <span className="text-white text-sm font-medium">Fresh from the kitchen to your doorstep</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Delicious Food
                <span className="block text-yellow-300">Delivered Fast</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the future of food delivery with professional cloud kitchens,
                smart delivery partners, and unbeatable prices
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 text-white">
                  <ChefHat className="w-8 h-8" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-white/80">Cloud Kitchens</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 text-white">
                  <Users className="w-8 h-8" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">50K+</p>
                    <p className="text-sm text-white/80">Happy Customers</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 text-white">
                  <Star className="w-8 h-8" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-white/80">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
            <p className="text-gray-600">Choose from your favorite cuisines</p>
          </div>
          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: Pizza, name: "Pizza", color: "from-red-400 to-red-600" },
            { icon: Utensils, name: "Indian", color: "from-orange-400 to-orange-600" },
            { icon: Coffee, name: "Beverages", color: "from-brown-400 to-brown-600" },
            { icon: IceCream, name: "Desserts", color: "from-pink-400 to-pink-600" },
            { icon: ChefHat, name: "Chinese", color: "from-yellow-400 to-yellow-600" },
            { icon: Truck, name: "Fast Food", color: "from-green-400 to-green-600" }
          ].map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Kitchen Type Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Kitchen Type</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {[
              { type: "all", label: "All Types", icon: ChefHat },
              { type: "cloud_kitchen", label: "Cloud Kitchen", icon: Shield },
              { type: "home_office", label: "Home Office", icon: Heart },
              { type: "both", label: "Hybrid", icon: Users }
            ].map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.type}
                  onClick={() => handleKitchenTypeFilter(filter.type)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${selectedKitchenType === filter.type
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-orange-300"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cuisine Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Cuisine Type</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4">
            <button
              onClick={() => handleCuisineFilter("all")}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${selectedCuisine === "all"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-orange-300"
                }`}
            >
              All Cuisines
            </button>
            {allCuisines.map((cuisine, index) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineFilter(cuisine)}
                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${selectedCuisine === cuisine
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-orange-300"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Cloud Kitchens Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Kitchens</h2>
            <p className="text-gray-600">Handpicked cloud kitchens with top ratings</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Fresh arrivals daily</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredKitchens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKitchens.map((kitchen, index) => (
              <div
                key={kitchen.id}
                className={`transition-all duration-700 transform hover:scale-105 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                  }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CloudKitchenCard kitchen={kitchen} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchBar onSearch={() => { }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No kitchens found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Enhanced Why Choose CloudBites Section */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-orange-200">
              <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-orange-600 font-medium">Why Choose CloudBites?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Experience the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Food Delivery
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring together the best cloud kitchens, smart delivery partners, and amazing food experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Lightning Fast Delivery",
                description: "30-minute average delivery time with real-time tracking",
                color: "from-blue-500 to-blue-600",
                delay: 0
              },
              {
                icon: DollarSign,
                title: "Smart Pricing",
                description: "Competitive bidding system ensures the best delivery prices",
                color: "from-green-500 to-green-600",
                delay: 150
              },
              {
                icon: Shield,
                title: "Quality Assured",
                description: "FSSAI certified kitchens with strict hygiene standards",
                color: "from-purple-500 to-purple-600",
                delay: 300
              },
              {
                icon: Heart,
                title: "Meal Subscriptions",
                description: "Weekly and monthly meal plans for regular customers",
                color: "from-pink-500 to-pink-600",
                delay: 450
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Amazing Food?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers enjoying delicious meals from the best cloud kitchens
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-500 rounded-xl font-bold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Order Now
              </button>
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold hover:bg-white hover:text-orange-500 transform hover:scale-105 transition-all duration-300">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
