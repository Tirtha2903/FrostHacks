"use client"

import { useState, useEffect } from "react"
import type { DeliveryBid, DeliveryPartner } from "@/lib/types"
import { getAvailableDeliveryPartners, createDeliveryBid } from "@/lib/api"
import { Clock, MapPin, Star, Bike, Car, Zap, Users, Timer } from "lucide-react"

interface DeliveryBiddingProps {
  orderId: string
  kitchenLocation: { lat: number; lng: number }
  deliveryAddress: { lat: number; lng: number; street: string; area: string }
  onBidSelected: (bid: DeliveryBid) => void
  priorityDelivery: boolean
}

export default function DeliveryBidding({
  orderId,
  kitchenLocation,
  deliveryAddress,
  onBidSelected,
  priorityDelivery
}: DeliveryBiddingProps) {
  const [bids, setBids] = useState<DeliveryBid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds

  useEffect(() => {
    // Simulate receiving bids from delivery partners
    const simulateBidding = async () => {
      setLoading(true)
      const partners = await getAvailableDeliveryPartners()

      // Generate mock bids
      const mockBids: DeliveryBid[] = partners.slice(0, 3).map((partner, index) => {
        const vehicleTypes = ["cycle", "e_vehicle", "motorcycle", "car"] as const
        const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]

        // Calculate bid based on distance and vehicle type
        const basePrice = 15
        const vehicleMultiplier = {
          cycle: 0.8,
          e_vehicle: 1.0,
          motorcycle: 1.2,
          car: 1.5
        }[vehicleType]

        const priorityMultiplier = priorityDelivery ? 1.5 : 1.0
        const bidAmount = Math.round((basePrice * vehicleMultiplier * priorityMultiplier + Math.random() * 10) * 100) / 100

        const estimatedTime = 20 + Math.floor(Math.random() * 30) // 20-50 minutes

        return {
          id: `bid_${index + 1}`,
          orderId,
          deliveryPartnerId: partner.id,
          bidAmount,
          estimatedTime,
          vehicleType,
          deliveryRoute: {
            distance: 2 + Math.random() * 8, // 2-10 km
            estimatedDuration: estimatedTime,
            trafficCondition: ["light", "moderate", "heavy"][Math.floor(Math.random() * 3)] as any
          },
          status: "open" as const,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 5 * 60000)
        }
      })

      setBids(mockBids.sort((a, b) => a.bidAmount - b.bidAmount))
      setLoading(false)
    }

    simulateBidding()

    // Timer for bid expiry
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderId, priorityDelivery])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "cycle":
        return <Bike className="w-5 h-5" />
      case "e_vehicle":
        return <Zap className="w-5 h-5" />
      case "motorcycle":
        return <Bike className="w-5 h-5" />
      case "car":
        return <Car className="w-5 h-5" />
      default:
        return <Bike className="w-5 h-5" />
    }
  }

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case "cycle":
        return "Cycle"
      case "e_vehicle":
        return "E-Vehicle"
      case "motorcycle":
        return "Motorcycle"
      case "car":
        return "Car"
      default:
        return vehicleType
    }
  }

  const getTrafficColor = (condition: string) => {
    switch (condition) {
      case "light":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "heavy":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleBidSelect = (bid: DeliveryBid) => {
    setSelectedBid(bid.id)
    onBidSelected(bid)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Getting delivery bids...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Choose Your Delivery Partner</h3>
              <p className="text-sm text-muted-foreground">
                Select from available delivery partners based on price and delivery time
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
            <div className="text-xs text-muted-foreground">Time Remaining</div>
          </div>
        </div>

        {priorityDelivery && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-800">
              Priority delivery selected - faster delivery times available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedBid === bid.id
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
              onClick={() => handleBidSelect(bid)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getVehicleIcon(bid.vehicleType)}
                    <div>
                      <div className="font-medium">
                        {getVehicleLabel(bid.vehicleType)} Delivery
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                        <span>•</span>
                        <span>500+ deliveries</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{bid.estimatedTime} min</div>
                        <div className="text-xs text-muted-foreground">Est. Time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{bid.deliveryRoute.distance.toFixed(1)} km</div>
                        <div className="text-xs text-muted-foreground">Distance</div>
                      </div>
                    </div>
                    <div>
                      <div className={`font-medium ${getTrafficColor(bid.deliveryRoute.trafficCondition)}`}>
                        {bid.deliveryRoute.trafficCondition.charAt(0).toUpperCase() +
                         bid.deliveryRoute.trafficCondition.slice(1)} Traffic
                      </div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">₹{bid.bidAmount}</div>
                      <div className="text-xs text-muted-foreground">Delivery Fee</div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedBid === bid.id
                      ? "border-primary bg-primary"
                      : "border-neutral-300"
                  }`}>
                    {selectedBid === bid.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bids.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No delivery partners available at the moment.</p>
            <p className="text-sm text-muted-foreground">Please try again in a few minutes.</p>
          </div>
        )}
      </div>
    </div>
  )
}