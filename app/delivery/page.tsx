"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"
import { dummyOrders } from "@/lib/dummy-data"
import DeliveryHeader from "@/components/delivery-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, Navigation, CheckCircle } from "lucide-react"

export default function DeliveryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
  const [earnings, setEarnings] = useState(0)

  useEffect(() => {
    // Simulate delivery partner getting their assigned orders
    const assignedOrders = dummyOrders.filter((o) => o.deliveryPartner === "user_3")
    setOrders(assignedOrders)

    const totalEarnings = assignedOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.deliveryFee, 0)
    setEarnings(totalEarnings)
  }, [])

  const availableOrders = orders.filter((o) => o.status === "ready" && o.deliveryPartner === "user_3")
  const activeOrders = orders.filter((o) => o.status === "in_transit" && o.deliveryPartner === "user_3")
  const completedOrders = orders.filter((o) => o.status === "delivered" && o.deliveryPartner === "user_3")

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
  }

  const currentDelivery = orders.find((o) => o.id === activeDelivery)

  return (
    <div className="min-h-screen bg-background">
      <DeliveryHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Available Orders</p>
            <p className="text-3xl font-bold">{availableOrders.length}</p>
          </div>
          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">In Transit</p>
            <p className="text-3xl font-bold">{activeOrders.length}</p>
          </div>
          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Today's Earnings</p>
            <p className="text-3xl font-bold">${earnings.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Rating</p>
            <p className="text-3xl font-bold">4.9</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-md">
                <TabsTrigger value="available">Available ({availableOrders.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
              </TabsList>

              {/* Available Orders */}
              <TabsContent value="available" className="mt-6 space-y-4">
                {availableOrders.length > 0 ? (
                  availableOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-mono text-sm text-muted-foreground mb-1">
                            Order #{order.id.split("_")[1]}
                          </p>
                          <h3 className="font-bold text-lg">{order.items.map((item) => item.name).join(", ")}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.deliveryFee.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">delivery fee</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>~3.2 km away</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Ready for pickup</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveDelivery(order.id)
                          updateOrderStatus(order.id, "assigned")
                        }}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                      >
                        Accept Delivery
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No available orders</p>
                  </div>
                )}
              </TabsContent>

              {/* Active Deliveries */}
              <TabsContent value="active" className="mt-6 space-y-4">
                {activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
                    <div key={order.id} className="bg-card border-2 border-secondary rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-mono text-sm text-muted-foreground mb-1">
                            Order #{order.id.split("_")[1]}
                          </p>
                          <h3 className="font-bold text-lg">{order.items.map((item) => item.name).join(", ")}</h3>
                        </div>
                        <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                          In Transit
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Delivery Location</p>
                            <p className="font-medium">123 Customer Street</p>
                          </div>
                          <Navigation className="w-5 h-5 text-secondary" />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Customer Contact</p>
                            <p className="font-medium">+1 555-0101</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          updateOrderStatus(order.id, "delivered")
                          setActiveDelivery(null)
                        }}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                      >
                        Confirm Delivery
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No active deliveries</p>
                  </div>
                )}
              </TabsContent>

              {/* Completed */}
              <TabsContent value="completed" className="mt-6 space-y-4">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order) => (
                    <div key={order.id} className="bg-card border border-green-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-mono text-sm text-muted-foreground mb-1">
                            Order #{order.id.split("_")[1]}
                          </p>
                          <h3 className="font-bold mb-2">{order.items.map((item) => item.name).join(", ")}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Delivered at {new Date(order.updatedAt).toLocaleTimeString()}
                            </span>
                            <p className="font-bold text-lg text-green-600">+${order.deliveryFee.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No completed deliveries</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Current Delivery Map & Info */}
          <div className="lg:col-span-1">
            {currentDelivery ? (
              <div className="bg-card border border-neutral-200 rounded-lg overflow-hidden sticky top-20">
                {/* Map Placeholder */}
                <div className="bg-neutral-100 h-64 relative flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">Live Map View</p>
                    <p className="text-xs text-muted-foreground mt-1">~3.2 km to pickup</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Restaurant */}
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold mb-2">Pickup From</p>
                    <p className="font-bold">La Bella Italia</p>
                    <p className="text-sm text-muted-foreground">123 Main St, Downtown</p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold mb-2">Deliver To</p>
                    <p className="font-bold">John Customer</p>
                    <p className="text-sm text-muted-foreground">123 Customer Street</p>
                  </div>

                  {/* Total */}
                  <div className="border-t border-neutral-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-muted-foreground">Delivery Fee</p>
                      <p className="font-bold text-lg text-primary">${currentDelivery.deliveryFee.toFixed(2)}</p>
                    </div>
                    <button className="w-full bg-secondary text-white py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                      Start Navigation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-neutral-200 rounded-lg p-8 text-center">
                <Navigation className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a delivery to view details and navigate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
