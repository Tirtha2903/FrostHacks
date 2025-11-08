"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Bike,
  Car,
  Zap,
  Navigation,
  Phone,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  Calendar,
  Target,
  Award
} from "lucide-react"
import type { DeliveryPartner, Order, DeliveryBid } from "@/lib/types"

interface DeliveryPartnerDashboardProps {
  partner: DeliveryPartner
  onBidAccept?: (order: Order, bidAmount: number, vehicleType: string) => void
  onOrderComplete?: (orderId: string) => void
}

export default function DeliveryPartnerDashboard({
  partner,
  onBidAccept,
  onOrderComplete
}: DeliveryPartnerDashboardProps) {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState(partner.preferredVehicleType)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    // Simulate loading orders
    const loadOrders = async () => {
      setLoading(true)

      // Mock available orders
      const mockAvailableOrders: Order[] = [
        {
          id: "order_1",
          customerId: "customer_1",
          kitchenId: "kitchen_1",
          items: [
            {
              menuItemId: "item_1",
              name: "Butter Chicken",
              quantity: 2,
              price: 350
            }
          ],
          orderType: "onetime",
          status: "ready",
          subtotal: 350,
          deliveryFee: 0,
          platformFee: 20,
          total: 370,
          deliveryAddress: {
            street: "123 MG Road",
            area: "Indiranagar",
            city: "Bangalore",
            pincode: "560038",
            coordinates: { lat: 12.9716, lng: 77.5946 }
          },
          priorityDelivery: false,
          createdAt: new Date(Date.now() - 10 * 60000),
          updatedAt: new Date(Date.now() - 5 * 60000)
        },
        {
          id: "order_2",
          customerId: "customer_2",
          kitchenId: "kitchen_2",
          items: [
            {
              menuItemId: "item_2",
              name: "Veg Biryani",
              quantity: 1,
              price: 280
            }
          ],
          orderType: "onetime",
          status: "awaiting_delivery",
          subtotal: 280,
          deliveryFee: 0,
          platformFee: 15,
          total: 295,
          deliveryAddress: {
            street: "456 Brigade Road",
            area: "Koramangala",
            city: "Bangalore",
            pincode: "560034",
            coordinates: { lat: 12.9279, lng: 77.6271 }
          },
          priorityDelivery: true,
          createdAt: new Date(Date.now() - 15 * 60000),
          updatedAt: new Date(Date.now() - 8 * 60000)
        }
      ]

      // Mock active orders
      const mockActiveOrders: Order[] = [
        {
          id: "order_3",
          customerId: "customer_3",
          kitchenId: "kitchen_1",
          items: [
            {
              menuItemId: "item_3",
              name: "Pasta Carbonara",
              quantity: 1,
              price: 320
            }
          ],
          orderType: "onetime",
          status: "assigned",
          subtotal: 320,
          deliveryFee: 0,
          platformFee: 18,
          total: 338,
          deliveryPartner: partner.id,
          estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
          deliveryAddress: {
            street: "789 Commercial Street",
            area: "Shivajinagar",
            city: "Bangalore",
            pincode: "560051",
            coordinates: { lat: 12.9756, lng: 77.6065 }
          },
          priorityDelivery: false,
          createdAt: new Date(Date.now() - 20 * 60000),
          updatedAt: new Date(Date.now() - 10 * 60000)
        }
      ]

      setAvailableOrders(mockAvailableOrders)
      setActiveOrders(mockActiveOrders)
      setCompletedOrders([])
      setLoading(false)
    }

    loadOrders()
  }, [partner.id])

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

  const calculateBidAmount = (order: Order, vehicleType: string) => {
    const baseFee = 15
    const distance = 3 + Math.random() * 7 // 3-10 km
    const vehicleMultiplier = {
      cycle: 0.8,
      e_vehicle: 1.0,
      motorcycle: 1.2,
      public_transport: 1.1,
      car: 1.5
    }[vehicleType] || 1.0

    const priorityMultiplier = order.priorityDelivery ? 1.5 : 1.0
    return Math.round((baseFee * vehicleMultiplier * priorityMultiplier + distance * 2) * 100) / 100
  }

  const getVehicleLabel = (vehicleType: string) => {
    const labels = {
      cycle: "Bicycle",
      e_vehicle: "E-Scooter",
      motorcycle: "Motorcycle",
      public_transport: "Public Transport",
      car: "Car"
    }
    return labels[vehicleType as keyof typeof labels] || vehicleType
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ready: "bg-orange-100 text-orange-800",
      awaiting_delivery: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      in_transit: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      ready: "Ready for Pickup",
      awaiting_delivery: "Awaiting Delivery",
      assigned: "Assigned to You",
      in_transit: "In Transit",
      delivered: "Delivered"
    }
    return labels[status as keyof typeof labels] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bike className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Delivery Partner Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {partner.name}!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/api/placeholder/32/32?text=${partner.name.charAt(0)}`} />
                  <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{partner.name}</p>
                  <p className="text-xs text-muted-foreground">⭐ {partner.rating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-green-700">₹{partner.earnings.weeklyEarnings}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Orders</p>
                  <p className="text-2xl font-bold text-blue-700">{activeOrders.length}</p>
                  <p className="text-xs text-blue-600 mt-1">2 in progress</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Timer className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-700">{partner.completedDeliveries}</p>
                  <p className="text-xs text-purple-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Rating</p>
                  <p className="text-2xl font-bold text-orange-700">{partner.rating}</p>
                  <p className="text-xs text-orange-600 mt-1">Excellent</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-700 fill-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Available Orders ({availableOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </TabsTrigger>
          </TabsList>

          {/* Available Orders */}
          <TabsContent value="available" className="space-y-4">
            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="w-5 h-5" />
                  Select Your Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {partner.availableVehicles.map((vehicle) => (
                    <Button
                      key={vehicle}
                      variant={selectedVehicle === vehicle ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto py-3"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      {getVehicleIcon(vehicle)}
                      <span className="text-xs">{getVehicleLabel(vehicle)}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Orders List */}
            <div className="grid gap-4">
              {availableOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          {order.priorityDelivery && (
                            <Badge variant="destructive">
                              <Zap className="w-3 h-3 mr-1" />
                              Priority
                            </Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Order Details</h4>
                            <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                            <p className="text-sm text-muted-foreground">Items: {order.items.length}</p>
                            <p className="text-sm text-muted-foreground">Total: ₹{order.total}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Delivery Address</h4>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm">{order.deliveryAddress.street}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.deliveryAddress.area}, {order.deliveryAddress.city}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Placed {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)} min ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {getVehicleIcon(selectedVehicle)}
                            <span>{getVehicleLabel(selectedVehicle)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="mb-2">
                          <p className="text-2xl font-bold text-primary">
                            ₹{calculateBidAmount(order, selectedVehicle)}
                          </p>
                          <p className="text-xs text-muted-foreground">Estimated delivery fee</p>
                        </div>
                        <Button
                          onClick={() => onBidAccept?.(order, calculateBidAmount(order, selectedVehicle), selectedVehicle)}
                          className="w-full"
                        >
                          Accept Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {availableOrders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No available orders</h3>
                    <p className="text-muted-foreground">Check back soon for new delivery opportunities!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Active Orders */}
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Order {order.id}</span>
                        </div>
                        <h4 className="font-medium">{order.items[0]?.name}</h4>
                      </div>
                      {order.estimatedDeliveryTime && (
                        <div className="text-right">
                          <p className="text-sm font-medium">ETA</p>
                          <p className="text-lg font-bold text-primary">
                            {order.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {order.deliveryAddress.area}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Customer Contact
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                        <Button size="sm">
                          Mark Delivered
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Pickup</span>
                        <span>Delivery</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeOrders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Timer className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No active orders</h3>
                    <p className="text-muted-foreground">Start accepting orders to see them here!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Completed Orders */}
          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No completed orders yet</h3>
                    <p className="text-muted-foreground">Your completed deliveries will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                // Completed orders would be rendered here
                <p>Completed orders will be shown here</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}