"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  CheckCircle,
  Package,
  ChefHat,
  Bike,
  Star,
  MessageCircle,
  AlertCircle,
  Bell,
  Timer,
  TrendingUp
} from "lucide-react"
import type { Order, DeliveryPartner } from "@/lib/types"

interface OrderTrackingProps {
  order: Order
  deliveryPartner?: DeliveryPartner
  onUpdate?: () => void
}

interface TrackingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "active" | "pending"
  timestamp?: Date
}

export default function OrderTracking({ order, deliveryPartner, onUpdate }: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [partnerLocation, setPartnerLocation] = useState({ lat: 12.9716, lng: 77.5946 })
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    // Calculate current step based on order status
    const steps = getTrackingSteps(order)
    const activeStepIndex = steps.findIndex(step => step.status === "active")
    if (activeStepIndex !== -1) {
      setCurrentStep(activeStepIndex)
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)

      // Simulate partner movement
      setPartnerLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }))

      // Update estimated time
      setEstimatedTime(prev => Math.max(5, prev - 1))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [order])

  const getTrackingSteps = (order: Order): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been received and confirmed",
        icon: <CheckCircle className="w-5 h-5" />,
        status: "completed",
        timestamp: order.createdAt
      },
      {
        id: "preparing",
        title: "Preparing Your Food",
        description: "The kitchen is preparing your delicious meal",
        icon: <ChefHat className="w-5 h-5" />,
        status: order.status === "confirmed" ? "active" :
                order.status === "preparing" ? "active" :
                ["confirmed", "preparing"].includes(order.status) ? "completed" : "pending"
      },
      {
        id: "ready",
        title: "Ready for Pickup",
        description: "Your food is ready and waiting for delivery partner",
        icon: <Package className="w-5 h-5" />,
        status: order.status === "ready" ? "active" :
                ["ready", "awaiting_delivery", "assigned"].includes(order.status) ? "completed" : "pending"
      }
    ]

    // Add delivery steps if partner is assigned
    if (deliveryPartner || ["assigned", "in_transit"].includes(order.status)) {
      steps.push({
        id: "picked_up",
        title: "Order Picked Up",
        description: `${deliveryPartner?.name || "Delivery partner"} has picked up your order`,
        icon: <Bike className="w-5 h-5" />,
        status: order.status === "in_transit" ? "active" :
                order.status === "delivered" ? "completed" : "pending"
      })

      steps.push({
        id: "on_the_way",
        title: "On the Way",
        description: "Your order is on the way to your location",
        icon: <Navigation className="w-5 h-5" />,
        status: order.status === "in_transit" ? "active" :
                order.status === "delivered" ? "completed" : "pending",
        timestamp: order.status === "in_transit" ? new Date() : undefined
      })

      steps.push({
        id: "delivered",
        title: "Delivered Successfully",
        description: "Enjoy your meal! Thank you for ordering",
        icon: <CheckCircle className="w-5 h-5" />,
        status: order.status === "delivered" ? "completed" : "pending"
      })
    }

    return steps
  }

  const trackingSteps = getTrackingSteps(order)
  const progress = ((currentStep + 1) / trackingSteps.length) * 100

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-yellow-100 text-yellow-800",
      assigned: "bg-purple-100 text-purple-800",
      in_transit: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready for Pickup",
      assigned: "Delivery Assigned",
      in_transit: "On the Way",
      delivered: "Delivered"
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="space-y-6">
      {/* Order Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-foreground" />
              </div>
              Order Tracking
            </CardTitle>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-semibold">{order.id}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-semibold text-primary">
                {order.estimatedDeliveryTime ?
                  order.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                  `${estimatedTime} min`
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold">₹{order.total}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Order Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Tracking Steps */}
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                  step.status === "active" ? "bg-primary/5 border border-primary/20" :
                  step.status === "completed" ? "bg-green-50" :
                  "bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === "active" ? "bg-primary text-white animate-pulse" :
                  step.status === "completed" ? "bg-green-500 text-white" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  {step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${
                      step.status === "active" ? "text-primary" :
                      step.status === "completed" ? "text-green-700" :
                      "text-gray-600"
                    }`}>
                      {step.title}
                    </h3>
                    {step.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    step.status === "active" ? "text-primary" :
                    step.status === "completed" ? "text-green-600" :
                    "text-gray-500"
                  }`}>
                    {step.description}
                  </p>
                </div>

                {step.status === "completed" && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Partner Info */}
      {deliveryPartner && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="w-5 h-5" />
              Delivery Partner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/api/placeholder/48/48?text=${deliveryPartner.name.charAt(0)}`} />
                <AvatarFallback>{deliveryPartner.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{deliveryPartner.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{deliveryPartner.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{deliveryPartner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{deliveryPartner.completedDeliveries} deliveries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span>Avg {deliveryPartner.averageDeliveryTime} min delivery time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>Currently on your order</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button size="sm" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Partner
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Track Location
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Location Map Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Live Location</span>
                <Badge variant="outline" className="text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </Badge>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Interactive map view</p>
                  <p className="text-xs text-gray-500">Partner is {formatTime(estimatedTime)} away</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Instructions */}
      {order.status !== "delivered" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Delivery Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.street}, {order.deliveryAddress.area},
                    {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                  </p>
                </div>
              </div>

              {order.priorityDelivery && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">
                      Priority delivery - Partner will call you upon arrival
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Delivery Tips:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Keep your phone nearby for delivery updates</li>
                      <li>• Have the exact payment ready if it's a cash order</li>
                      <li>• Check your food before the delivery partner leaves</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Fee</span>
                <span>₹{order.platformFee}</span>
              </div>
              {order.priorityDelivery && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Priority Delivery</span>
                  <span>₹30</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{order.total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}