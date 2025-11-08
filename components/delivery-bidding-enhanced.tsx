"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Bike,
  Car,
  Zap,
  Timer,
  MapPin,
  TrendingUp,
  DollarSign,
  Navigation,
  Clock,
  Star,
  AlertCircle,
  Users,
  Target,
  Award,
  Sparkles
} from "lucide-react"
import type { Order, DeliveryBid } from "@/lib/types"

interface DeliveryBiddingEnhancedProps {
  order: Order
  onBidSubmit: (bid: Omit<DeliveryBid, 'id' | 'createdAt'>) => void
  availableVehicles: string[]
  partnerRating: number
}

export default function DeliveryBiddingEnhanced({
  order,
  onBidSubmit,
  availableVehicles,
  partnerRating
}: DeliveryBiddingEnhancedProps) {
  const [selectedVehicle, setSelectedVehicle] = useState(availableVehicles[0] || "motorcycle")
  const [bidAmount, setBidAmount] = useState(20)
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [priorityBoost, setPriorityBoost] = useState(false)
  const [smartPricing, setSmartPricing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const vehicleOptions = [
    {
      id: "cycle",
      label: "Bicycle",
      icon: Bike,
      basePrice: 15,
      timeMultiplier: 1.2,
      ecoScore: 5,
      description: "Eco-friendly, perfect for short distances"
    },
    {
      id: "e_vehicle",
      label: "E-Scooter",
      icon: Zap,
      basePrice: 18,
      timeMultiplier: 1.0,
      ecoScore: 4,
      description: "Fast delivery with zero emissions"
    },
    {
      id: "motorcycle",
      label: "Motorcycle",
      icon: Bike,
      basePrice: 22,
      timeMultiplier: 0.9,
      ecoScore: 2,
      description: "Quick navigation through traffic"
    },
    {
      id: "car",
      label: "Car",
      icon: Car,
      basePrice: 28,
      timeMultiplier: 1.1,
      ecoScore: 1,
      description: "Weather protection, large orders"
    }
  ]

  const calculateSmartPricing = () => {
    const vehicle = vehicleOptions.find(v => v.id === selectedVehicle)
    if (!vehicle) return 20

    let basePrice = vehicle.basePrice

    // Distance factor (mock calculation)
    const distanceFactor = 1 + (order.deliveryAddress.coordinates ?
      Math.random() * 0.5 : 0)
    basePrice *= distanceFactor

    // Priority order boost
    if (order.priorityDelivery) {
      basePrice *= 1.3
    }

    // Partner rating bonus
    const ratingBonus = 1 + (partnerRating - 4.5) * 0.1
    basePrice *= ratingBonus

    // Time of day boost (peak hours)
    const hour = new Date().getHours()
    const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21)
    if (isPeakHour) {
      basePrice *= 1.2
    }

    // Weather boost (mock)
    const weatherBoost = Math.random() > 0.7 ? 1.1 : 1.0
    basePrice *= weatherBoost

    return Math.round(basePrice * 100) / 100
  }

  const calculateEstimatedTime = (vehicleId: string) => {
    const vehicle = vehicleOptions.find(v => v.id === vehicleId)
    if (!vehicle) return 30

    let baseTime = 25
    baseTime *= vehicle.timeMultiplier

    // Distance factor
    baseTime *= 1 + Math.random() * 0.3

    // Traffic conditions
    const trafficConditions = ["light", "moderate", "heavy"]
    const currentTraffic = trafficConditions[Math.floor(Math.random() * trafficConditions.length)]
    const trafficMultiplier = { light: 0.9, moderate: 1.0, heavy: 1.3 }[currentTraffic]
    baseTime *= trafficMultiplier

    // Weather conditions
    const weatherMultiplier = Math.random() > 0.8 ? 1.2 : 1.0
    baseTime *= weatherMultiplier

    return Math.round(baseTime)
  }

  useEffect(() => {
    if (smartPricing) {
      setBidAmount(calculateSmartPricing())
    }
    setEstimatedTime(calculateEstimatedTime(selectedVehicle))
  }, [selectedVehicle, smartPricing, order.priorityDelivery])

  const currentVehicle = vehicleOptions.find(v => v.id === selectedVehicle)

  const getWinProbability = () => {
    // Mock calculation based on pricing and partner rating
    const avgMarketPrice = 25
    const priceCompetitiveness = Math.max(0, 100 - ((bidAmount - avgMarketPrice) / avgMarketPrice) * 50)
    const ratingBonus = (partnerRating - 4.0) * 20
    return Math.min(95, Math.max(5, priceCompetitiveness + ratingBonus))
  }

  const handleSubmitBid = async () => {
    setIsLoading(true)

    const bidData = {
      orderId: order.id,
      deliveryPartnerId: "current_partner_id",
      bidAmount: priorityBoost ? Math.round(bidAmount * 1.2) : bidAmount,
      estimatedTime: priorityBoost ? Math.round(estimatedTime * 0.8) : estimatedTime,
      vehicleType: selectedVehicle as any,
      deliveryRoute: {
        distance: 3 + Math.random() * 7,
        estimatedDuration: priorityBoost ? Math.round(estimatedTime * 0.8) : estimatedTime,
        trafficCondition: ["light", "moderate", "heavy"][Math.floor(Math.random() * 3)] as any
      },
      status: "open" as const,
      expiresAt: new Date(Date.now() + 5 * 60000)
    }

    // Simulate API call
    setTimeout(() => {
      onBidSubmit(bidData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Order Info Card */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            New Delivery Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-xs text-muted-foreground">Kitchen Location</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-xs text-muted-foreground">{order.deliveryAddress.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Order Value</p>
                <p className="text-xs text-muted-foreground">₹{order.total}</p>
              </div>
            </div>
          </div>

          {order.priorityDelivery && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Priority Order - Higher earnings available!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="w-5 h-5" />
            Select Your Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicleOptions
              .filter(vehicle => availableVehicles.includes(vehicle.id))
              .map((vehicle) => {
                const Icon = vehicle.icon
                const isSelected = selectedVehicle === vehicle.id

                return (
                  <div
                    key={vehicle.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-primary text-white" : "bg-gray-100"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{vehicle.label}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {vehicle.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>₹{vehicle.basePrice} base</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{vehicle.timeMultiplier}x speed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full mr-0.5 ${
                                    i < vehicle.ecoScore ? "bg-green-500" : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>Eco</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Set Your Bid
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Smart Pricing Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Smart Pricing</h4>
              <p className="text-sm text-blue-700">
                AI-powered pricing based on demand, distance, and competition
              </p>
            </div>
            <Switch
              checked={smartPricing}
              onCheckedChange={setSmartPricing}
            />
          </div>

          {/* Bid Amount Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bid-amount">Delivery Fee</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">₹{bidAmount}</span>
                <Badge variant={getWinProbability() > 70 ? "default" : "secondary"}>
                  {getWinProbability().toFixed(0)}% win chance
                </Badge>
              </div>
            </div>
            <Slider
              id="bid-amount"
              min={currentVehicle ? Math.round(currentVehicle.basePrice * 0.8) : 15}
              max={currentVehicle ? Math.round(currentVehicle.basePrice * 1.5) : 40}
              step={1}
              value={[bidAmount]}
              onValueChange={(value) => setBidAmount(value[0])}
              disabled={smartPricing}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Competitive</span>
              <span>Standard</span>
              <span>Premium</span>
            </div>
          </div>

          {/* Priority Boost */}
          {order.priorityDelivery && (
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <h4 className="font-medium text-orange-900">Priority Boost</h4>
                <p className="text-sm text-orange-700">
                  Get 20% extra earnings and priority placement
                </p>
              </div>
              <div className="text-right">
                <Switch
                  checked={priorityBoost}
                  onCheckedChange={setPriorityBoost}
                />
                <p className="text-xs text-orange-600 mt-1">
                  +₹{Math.round(bidAmount * 0.2)} extra
                </p>
              </div>
            </div>
          )}

          {/* Estimated Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="estimated-time">Estimated Delivery Time</Label>
              <span className="font-medium">{estimatedTime} minutes</span>
            </div>
            <Slider
              id="estimated-time"
              min={15}
              max={60}
              step={5}
              value={[estimatedTime]}
              onValueChange={(value) => setEstimatedTime(value[0])}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Earnings Projection */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="w-5 h-5" />
            Earnings Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Base Earnings</p>
              <p className="text-2xl font-bold text-green-700">₹{bidAmount}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">With Bonus</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{priorityBoost ? Math.round(bidAmount * 1.2) : bidAmount}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Time/Efficiency</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round((priorityBoost ? Math.round(bidAmount * 1.2) : bidAmount) / estimatedTime * 60)}/hr
              </p>
            </div>
          </div>

          {getWinProbability() > 80 && (
            <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-100 rounded-lg p-3">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">
                Excellent bid! You have a high chance of winning this order.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitBid}
        disabled={isLoading}
        className="w-full h-12 text-lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Submitting Bid...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Place Bid - Earn ₹{priorityBoost ? Math.round(bidAmount * 1.2) : bidAmount}
          </div>
        )}
      </Button>
    </div>
  )
}