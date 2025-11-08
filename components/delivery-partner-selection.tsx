"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bike,
  Car,
  Zap,
  Timer,
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Filter,
  ArrowUpDown,
  X
} from "lucide-react"
import type { DeliveryBid, DeliveryPartner } from "@/lib/types"

interface DeliveryPartnerSelectionProps {
  orderId: string
  kitchenLocation: { lat: number; lng: number; address: string }
  deliveryAddress: { lat: number; lng: number; street: string; area: string }
  onPartnerSelected: (bid: DeliveryBid) => void
  priorityDelivery: boolean
}

export default function DeliveryPartnerSelection({
  orderId,
  kitchenLocation,
  deliveryAddress,
  onPartnerSelected,
  priorityDelivery
}: DeliveryPartnerSelectionProps) {
  const [bids, setBids] = useState<DeliveryBid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("price")
  const [filterVehicle, setFilterVehicle] = useState<string | null>(null)

  useEffect(() => {
    // Simulate receiving bids from delivery partners
    const simulateBidding = async () => {
      setLoading(true)

      // Mock delivery partners
      const mockPartners: DeliveryPartner[] = [
        {
          id: "partner_1",
          userId: "user_1",
          name: "Rahul Kumar",
          phone: "+91 9876543210",
          rating: 4.8,
          completedDeliveries: 1247,
          isAvailable: true,
          currentLocation: { lat: 12.9716, lng: 77.5946 },
          availableVehicles: ["motorcycle", "e_vehicle"],
          preferredVehicleType: "motorcycle",
          averageDeliveryTime: 25,
          verifiedDocuments: {
            aadharCard: true,
            drivingLicense: true,
            vehicleRegistration: true,
            bankAccount: true
          },
          earnings: {
            totalEarnings: 285000,
            weeklyEarnings: 5800,
            monthlyEarnings: 23000
          }
        },
        {
          id: "partner_2",
          userId: "user_2",
          name: "Priya Sharma",
          phone: "+91 9123456789",
          rating: 4.9,
          completedDeliveries: 892,
          isAvailable: true,
          currentLocation: { lat: 12.9352, lng: 77.6245 },
          availableVehicles: ["e_vehicle", "cycle"],
          preferredVehicleType: "e_vehicle",
          averageDeliveryTime: 30,
          verifiedDocuments: {
            aadharCard: true,
            drivingLicense: true,
            vehicleRegistration: true,
            bankAccount: true
          },
          earnings: {
            totalEarnings: 198000,
            weeklyEarnings: 4200,
            monthlyEarnings: 16800
          }
        },
        {
          id: "partner_3",
          userId: "user_3",
          name: "Amit Singh",
          phone: "+91 8876543210",
          rating: 4.7,
          completedDeliveries: 2103,
          isAvailable: true,
          currentLocation: { lat: 12.9921, lng: 77.5603 },
          availableVehicles: ["motorcycle", "car"],
          preferredVehicleType: "motorcycle",
          averageDeliveryTime: 22,
          verifiedDocuments: {
            aadharCard: true,
            drivingLicense: true,
            vehicleRegistration: true,
            bankAccount: true
          },
          earnings: {
            totalEarnings: 412000,
            weeklyEarnings: 7900,
            monthlyEarnings: 31600
          }
        },
        {
          id: "partner_4",
          userId: "user_4",
          name: "Sneha Reddy",
          phone: "+91 9234567890",
          rating: 4.6,
          completedDeliveries: 567,
          isAvailable: true,
          currentLocation: { lat: 12.9280, lng: 77.5901 },
          availableVehicles: ["cycle", "e_vehicle"],
          preferredVehicleType: "e_vehicle",
          averageDeliveryTime: 35,
          verifiedDocuments: {
            aadharCard: true,
            drivingLicense: true,
            vehicleRegistration: true,
            bankAccount: true
          },
          earnings: {
            totalEarnings: 125000,
            weeklyEarnings: 2800,
            monthlyEarnings: 11200
          }
        }
      ]

      const vehicleTypes = ["cycle", "e_vehicle", "motorcycle", "car"] as const

      // Generate bids with realistic pricing
      const mockBids: DeliveryBid[] = mockPartners.map((partner, index) => {
        const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]

        // Calculate bid based on distance, vehicle type, and partner experience
        const basePrice = 15
        const vehicleMultiplier = {
          cycle: 0.7,
          e_vehicle: 0.9,
          motorcycle: 1.1,
          car: 1.4
        }[vehicleType]

        const experienceBonus = partner.completedDeliveries > 1000 ? 0.1 : 0
        const priorityMultiplier = priorityDelivery ? 1.4 : 1.0

        const bidAmount = Math.round(
          (basePrice * vehicleMultiplier + experienceBonus) * priorityMultiplier * 100
        ) / 100

        const estimatedTime = 15 + Math.floor(Math.random() * 40) // 15-55 minutes

        return {
          id: `bid_${partner.id}`,
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

      setBids(mockBids)
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

  // Mock partner data
  const getPartnerData = (partnerId: string): DeliveryPartner => {
    const partners: Record<string, DeliveryPartner> = {
      "partner_1": {
        id: "partner_1",
        userId: "user_1",
        name: "Rahul Kumar",
        phone: "+91 9876543210",
        rating: 4.8,
        completedDeliveries: 1247,
        isAvailable: true,
        currentLocation: { lat: 12.9716, lng: 77.5946 },
        availableVehicles: ["motorcycle", "e_vehicle"],
        preferredVehicleType: "motorcycle",
        averageDeliveryTime: 25,
        verifiedDocuments: { aadharCard: true, drivingLicense: true, vehicleRegistration: true, bankAccount: true },
        earnings: { totalEarnings: 285000, weeklyEarnings: 5800, monthlyEarnings: 23000 }
      },
      "partner_2": {
        id: "partner_2",
        userId: "user_2",
        name: "Priya Sharma",
        phone: "+91 9123456789",
        rating: 4.9,
        completedDeliveries: 892,
        isAvailable: true,
        currentLocation: { lat: 12.9352, lng: 77.6245 },
        availableVehicles: ["e_vehicle", "cycle"],
        preferredVehicleType: "e_vehicle",
        averageDeliveryTime: 30,
        verifiedDocuments: { aadharCard: true, drivingLicense: true, vehicleRegistration: true, bankAccount: true },
        earnings: { totalEarnings: 198000, weeklyEarnings: 4200, monthlyEarnings: 16800 }
      },
      "partner_3": {
        id: "partner_3",
        userId: "user_3",
        name: "Amit Singh",
        phone: "+91 8876543210",
        rating: 4.7,
        completedDeliveries: 2103,
        isAvailable: true,
        currentLocation: { lat: 12.9921, lng: 77.5603 },
        availableVehicles: ["motorcycle", "car"],
        preferredVehicleType: "motorcycle",
        averageDeliveryTime: 22,
        verifiedDocuments: { aadharCard: true, drivingLicense: true, vehicleRegistration: true, bankAccount: true },
        earnings: { totalEarnings: 412000, weeklyEarnings: 7900, monthlyEarnings: 31600 }
      },
      "partner_4": {
        id: "partner_4",
        userId: "user_4",
        name: "Sneha Reddy",
        phone: "+91 9234567890",
        rating: 4.6,
        completedDeliveries: 567,
        isAvailable: true,
        currentLocation: { lat: 12.9280, lng: 77.5901 },
        availableVehicles: ["cycle", "e_vehicle"],
        preferredVehicleType: "e_vehicle",
        averageDeliveryTime: 35,
        verifiedDocuments: { aadharCard: true, drivingLicense: true, vehicleRegistration: true, bankAccount: true },
        earnings: { totalEarnings: 125000, weeklyEarnings: 2800, monthlyEarnings: 11200 }
      }
    }
    return partners[partnerId] || partners["partner_1"]
  }

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
    const labels = {
      cycle: "Bicycle",
      e_vehicle: "E-Scooter",
      motorcycle: "Motorcycle",
      car: "Car"
    }
    return labels[vehicleType as keyof typeof labels] || vehicleType
  }

  const getTrafficColor = (condition: string) => {
    const colors = {
      light: "text-green-600",
      moderate: "text-yellow-600",
      heavy: "text-red-600"
    }
    return colors[condition as keyof typeof colors] || "text-gray-600"
  }

  // Sort and filter bids
  const filteredAndSortedBids = bids
    .filter(bid => !filterVehicle || bid.vehicleType === filterVehicle)
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.bidAmount - b.bidAmount
        case "time":
          return a.estimatedTime - b.estimatedTime
        case "rating":
          const partnerA = getPartnerData(a.deliveryPartnerId)
          const partnerB = getPartnerData(b.deliveryPartnerId)
          return partnerB.rating - partnerA.rating
        default:
          return 0
      }
    })

  const handleBidSelect = (bid: DeliveryBid) => {
    setSelectedBid(bid.id)
    onPartnerSelected(bid)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Finding Delivery Partners</h3>
          <p className="text-muted-foreground text-center">
            Getting the best delivery options for your order...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Choose Your Delivery Partner</h3>
              <p className="text-sm text-muted-foreground">
                Compare prices, delivery times, and ratings to select the best partner
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className={`text-3xl font-bold mb-1 ${
              timeRemaining < 60 ? "text-red-600" : "text-primary"
            }`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-muted-foreground">Time Remaining</div>
          </div>
        </div>

        {priorityDelivery && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-800">
              Priority delivery selected - Express delivery partners available
            </span>
          </div>
        )}

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
            <div className="flex gap-2">
              {["all", "e_vehicle", "motorcycle", "cycle"].map((vehicle) => (
                <Button
                  key={vehicle}
                  variant={filterVehicle === (vehicle === "all" ? null : vehicle) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterVehicle(vehicle === "all" ? null : vehicle)}
                  className="flex items-center gap-1"
                >
                  {vehicle !== "all" && getVehicleIcon(vehicle)}
                  <span className="text-xs">
                    {vehicle === "all" ? "All" : getVehicleLabel(vehicle)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort:</span>
            <div className="flex gap-2">
              {[
                { key: "price", label: "Price" },
                { key: "time", label: "Time" },
                { key: "rating", label: "Rating" }
              ].map((sort) => (
                <Button
                  key={sort.key}
                  variant={sortBy === sort.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(sort.key as any)}
                  className="text-xs"
                >
                  {sort.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bids List */}
      <div className="divide-y">
        {filteredAndSortedBids.map((bid, index) => {
          const partner = getPartnerData(bid.deliveryPartnerId)
          const isSelected = selectedBid === bid.id
          const isRecommended = index === 0

          return (
            <div
              key={bid.id}
              className={`p-6 cursor-pointer transition-all hover:bg-gray-50 ${
                isSelected ? "bg-primary/5 border-l-4 border-l-primary" : ""
              }`}
              onClick={() => handleBidSelect(bid)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/api/placeholder/48/48?text=${partner.name.charAt(0)}`} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{partner.name}</h4>
                      {isRecommended && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{partner.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({partner.completedDeliveries} deliveries)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(bid.vehicleType)}
                        <div>
                          <div className="font-medium">{getVehicleLabel(bid.vehicleType)}</div>
                          <div className="text-xs text-muted-foreground">Vehicle</div>
                        </div>
                      </div>

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

                      <div className="text-right">
                        <div className={`font-medium ${getTrafficColor(bid.deliveryRoute.trafficCondition)}`}>
                          {bid.deliveryRoute.trafficCondition.charAt(0).toUpperCase() +
                           bid.deliveryRoute.trafficCondition.slice(1)} Traffic
                        </div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{bid.bidAmount}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">Delivery Fee</div>
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={isSelected ? "bg-primary" : ""}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Verified Partner
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  Contact Available
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Navigation className="w-3 h-3" />
                  Real-time Tracking
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Avg {partner.averageDeliveryTime} min delivery
                </div>
              </div>

              {/* Progress indicator for selection */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Perfect choice!</span>
                    <span className="text-muted-foreground">
                      {partner.name} will pick up your order from {kitchenLocation.address}
                      and deliver to {deliveryAddress.area}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredAndSortedBids.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No delivery partners available</h3>
            <p className="text-muted-foreground">
              {filterVehicle ?
                `No ${getVehicleLabel(filterVehicle)} delivery partners available right now.` :
                "No delivery partners match your criteria. Try adjusting filters."
              }
            </p>
            {filterVehicle && (
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => setFilterVehicle(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}