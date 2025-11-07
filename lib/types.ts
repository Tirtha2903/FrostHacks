// Data types for the entire platform

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "customer" | "kitchen" | "delivery" | "admin"
  avatar?: string
  createdAt: Date
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  rating: number
  deliveryTime: number // minutes
  deliveryFee: number
  cuisineType: string[]
  address: string
  coordinates: { lat: number; lng: number }
  createdAt: Date
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  image: string
  price: number
  category: string
  available: boolean
  vegetarian: boolean
  createdAt: Date
}

export interface Cart {
  items: CartItem[]
  restaurantId: string
  subtotal: number
  deliveryFee: number
  total: number
}

export interface CartItem {
  menuItemId: string
  quantity: number
  price: number
  specialInstructions?: string
}

export interface Order {
  id: string
  customerId: string
  restaurantId: string
  items: OrderItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "assigned" | "in_transit" | "delivered" | "cancelled"
  subtotal: number
  deliveryFee: number
  total: number
  deliveryPartner?: string
  estimatedDeliveryTime?: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

export interface DeliveryBid {
  id: string
  orderId: string
  deliveryPartnerId: string
  bidAmount: number
  estimatedTime: number
  status: "open" | "accepted" | "rejected"
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: "free" | "basic" | "premium"
  monthlyFee: number
  deliveryDiscount: number
  priority: boolean
  startDate: Date
  renewalDate: Date
}

export interface DeliveryPartner {
  id: string
  userId: string
  rating: number
  completedDeliveries: number
  isAvailable: boolean
  currentLocation?: { lat: number; lng: number }
  vehicleType: "bike" | "scooter" | "car"
  averageDeliveryTime: number
}

export interface KitchenStats {
  totalOrders: number
  completedOrders: number
  averagePrepTime: number
  rating: number
}
