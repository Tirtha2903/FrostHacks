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

export interface CloudKitchen {
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
  kitchenType: "cloud_kitchen" | "home_office" | "both"
  businessLicense: string
  fssaiLicense: string
  operatingHours: {
    open: string
    close: string
    days: string[]
  }
  minOrderAmount: number
  subscriptionAvailable: boolean
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
  kitchenId: string
  items: OrderItem[]
  orderType: "onetime" | "weekly" | "monthly"
  subscriptionDetails?: {
    startDate: Date
    endDate: Date
    deliveryDays: string[]
    mealTimes: string[]
  }
  status: "pending" | "confirmed" | "preparing" | "ready" | "awaiting_delivery" | "assigned" | "in_transit" | "delivered" | "cancelled"
  subtotal: number
  deliveryFee: number
  platformFee: number
  total: number
  deliveryPartner?: string
  estimatedDeliveryTime?: Date
  deliveryAddress: {
    street: string
    area: string
    city: string
    pincode: string
    coordinates?: { lat: number; lng: number }
  }
  priorityDelivery: boolean
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
  vehicleType: "cycle" | "e_vehicle" | "motorcycle" | "public_transport" | "car"
  deliveryRoute: {
    distance: number
    estimatedDuration: number
    trafficCondition: "light" | "moderate" | "heavy"
  }
  status: "open" | "accepted" | "rejected" | "expired"
  specialInstructions?: string
  createdAt: Date
  expiresAt?: Date
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
  name: string
  phone: string
  rating: number
  completedDeliveries: number
  isAvailable: boolean
  currentLocation?: { lat: number; lng: number }
  availableVehicles: ("cycle" | "e_vehicle" | "motorcycle" | "public_transport" | "car")[]
  preferredVehicleType: string
  averageDeliveryTime: number
  verifiedDocuments: {
    aadharCard: boolean
    drivingLicense: boolean
    vehicleRegistration: boolean
    bankAccount: boolean
  }
  earnings: {
    totalEarnings: number
    weeklyEarnings: number
    monthlyEarnings: number
  }
}

export interface KitchenStats {
  totalOrders: number
  completedOrders: number
  averagePrepTime: number
  rating: number
}
